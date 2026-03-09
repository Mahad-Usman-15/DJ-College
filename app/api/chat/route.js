import { GoogleGenerativeAI } from '@google/generative-ai';
import { Index } from '@upstash/vector';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// ── Rate limiter (initialized once per cold start) ────────────────────────
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'),
  analytics: false,
});

// ── System prompt (FR-005, FR-012) ───────────────────────────────────────
const SYSTEM_PROMPT = `You are a helpful assistant for D.J. Sindh Government Science College. Answer questions using ONLY the provided college information below. If the question is not about DJ College or its programs, facilities, admissions, alumni, events, or contact information, politely say you can only help with DJ College questions and suggest topics you can assist with. If no relevant information is found in the context, respond: "I don't have specific information about that. Please contact us at 021-32622070 or use the contact form for assistance." Never make up information not in the provided context.`;

function buildPrompt(context, message) {
  return `${SYSTEM_PROMPT}\n\nCollege Information:\n${context}\n\nQuestion: ${message}`;
}

// ── POST /api/chat ─────────────────────────────────────────────────────────
export async function POST(request) {
  // T008: Rate limiting (FR-011)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return Response.json(
      {
        error: 'Too many requests. Please wait a moment before trying again.',
        code: 'RATE_LIMIT_EXCEEDED',
      },
      { status: 429 }
    );
  }

  // T009: Request validation (FR-001)
  let message, history;
  try {
    const body = await request.json();
    message = body.message;
    history = Array.isArray(body.history) ? body.history : [];
  } catch {
    return Response.json(
      { error: 'Invalid request body.', code: 'INVALID_MESSAGE' },
      { status: 400 }
    );
  }

  const trimmedMessage = message?.trim();
  if (!trimmedMessage || trimmedMessage.length > 2000) {
    return Response.json(
      {
        error: 'Message is required and must be between 1 and 2000 characters.',
        code: 'INVALID_MESSAGE',
      },
      { status: 400 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

    // T010: Embed query (RETRIEVAL_QUERY task type)
    const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const embeddingResult = await embeddingModel.embedContent({
      content: { parts: [{ text: trimmedMessage }] },
      taskType: 'RETRIEVAL_QUERY',
      outputDimensionality: 786,
    });
    const queryVector = embeddingResult.embedding.values;

    // T011: Vector retrieval — top 5 relevant chunks
    const index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    });
    const results = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    });
    const contextChunks = results
      .map(r => r.metadata?.text ?? '')
      .filter(Boolean);
    const context = contextChunks.join('\n\n');

    // T012: Build prompt with SYSTEM_PROMPT constant + buildPrompt helper
    // Handles FR-012 (zero-match): if context is empty, SYSTEM_PROMPT instructs
    // Gemini to direct the visitor to contact the college directly.
    const userContent = buildPrompt(context, trimmedMessage);

    // T028 (US4): Build Gemini contents array with conversation history
    const contents = [
      ...history.slice(-6).map(h => ({
        role: h.role,
        parts: [{ text: h.content }],
      })),
      { role: 'user', parts: [{ text: userContent }] },
    ];

    // T013: Gemini streaming
    const llmModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await llmModel.generateContentStream({ contents });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    // T014: Error handling
    console.error('Chat API error:', error);
    return Response.json(
      {
        error:
          'Our assistant is temporarily unavailable. Please call 021-32622070 or use the contact form.',
        code: 'SERVICE_UNAVAILABLE',
      },
      { status: 503 }
    );
  }
}
