# Research: RAG Chatbot Backend

**Feature**: `3-rag-chatbot-backend`
**Date**: 2026-03-07
**Phase**: 0 — Research & Decision Resolution

---

## Decision 1: RAG Orchestration Framework

**Decision**: Custom lightweight pipeline (no LangChain.js)

**Rationale**:
The DJ College knowledge base has ~80 documents across 6 data files. LangChain.js adds ~500KB to bundle size and significant abstraction overhead for a pipeline this simple: embed → retrieve → prompt → stream. A direct implementation using the official SDKs (`@google/generative-ai`, `@upstash/vector`) is simpler, faster to debug, easier to maintain, and has zero framework lock-in.

**Alternatives Considered**:
- **LangChain.js** (`@langchain/google-genai` + `@langchain/community/vectorstores/upstash`): Mature, well-documented, handles chunking/retrieval/prompting. Rejected — overkill for a 80-document knowledge base; adds complexity and bundle weight with no meaningful benefit at this scale.
- **Vercel AI SDK** (`ai` package with `@ai-sdk/google`): Excellent streaming DX for Next.js, `streamText` built-in. Rejected for orchestration — still requires manual retrieval logic; the streaming benefit is subsumed by using the Gemini SDK's native streaming directly.

---

## Decision 2: Streaming Implementation

**Decision**: Native `ReadableStream` with `Response` in Next.js App Router API route

**Rationale**:
Next.js App Router supports returning a `ReadableStream` directly from a route handler. Gemini's SDK (`@google/generative-ai`) natively supports streaming via `generateContentStream()`. Combining these produces a minimal, framework-agnostic streaming pipeline without extra dependencies.

The existing `useChatbot.js` UI hook reads streamed responses via `fetch()` + `response.body.getReader()`, which is standard browser API — no Vercel AI SDK `useChat` hook needed (we already have our own state management).

**Alternatives Considered**:
- **Server-Sent Events (SSE)**: More formal protocol, easier reconnection. Rejected — overkill for a stateless per-message chatbot; adds `EventSource` complexity on the client when `fetch` + `ReadableStream` is sufficient.
- **Vercel AI SDK `streamText`**: Excellent DX, automatic SSE formatting. Rejected — introduces `ai` package dependency; our existing `useChatbot.js` hook already handles state, making the SDK's `useChat` redundant.

---

## Decision 3: Rate Limiting Implementation

**Decision**: `@upstash/ratelimit` with Upstash Redis (sliding window, 20 req/min per IP)

**Rationale**:
Vercel serverless functions are stateless — each invocation is independent, so in-memory Maps reset per cold start and cannot reliably track rate limits. `@upstash/ratelimit` uses Upstash Redis (same provider ecosystem, free tier: 10,000 commands/day) with a sliding window algorithm, making it serverless-safe and accurate. It requires only one extra package and zero infrastructure changes.

**Alternatives Considered**:
- **In-memory Map**: Simple, zero dependencies. Rejected — unreliable in serverless; rate limit resets on every cold start.
- **Next.js Middleware with in-memory store**: Same statelessness problem.
- **Upstash Ratelimit with fixed window**: Simpler but allows burst at window boundaries. Rejected — sliding window is fairer for conversational use.

---

## Decision 4: Knowledge Base Chunking Strategy

**Decision**: One chunk per data entry (object/item), with metadata tagging by category

**Rationale**:
The knowledge base is structured JS objects — each department, facility, alumni bio, FAQ, etc. is already a discrete, self-contained unit of information. Treating each as one chunk preserves semantic coherence and matches the natural retrieval unit (a user asking about "Chemistry" should retrieve the Chemistry entry, not a fragment of it). Chunks average 50–200 words — well within the 2,048 token embedding limit.

**Alternatives Considered**:
- **Character-based chunking** (e.g., 512 chars with 50-char overlap): Common for unstructured text. Rejected — our data is already structured; splitting mid-entry destroys semantic coherence.
- **Section-level chunking** (e.g., all departments in one chunk): Too coarse; reduces retrieval precision.

---

## Decision 5: Conversation History Format

**Decision**: Last 6 turns sent as `contents` array in Gemini's multi-turn format

**Rationale**:
Gemini's `generateContentStream()` accepts a `contents` array with `role: 'user' | 'model'` and `parts: [{ text }]`. Sending the last 6 turns (3 exchanges, per FR-007) directly in this format requires no transformation and uses the model's native multi-turn conversation capability. This satisfies SC-007 (3 follow-up questions with context).

**Alternatives Considered**:
- **System prompt injection** (prepend history as text in the system prompt): Works but loses structured role distinction; model performs worse on follow-ups.
- **Full history** (all turns): Risks exceeding token limits on long sessions; increases cost and latency.

---

## Decision 6: Ingestion Script Data Conversion

**Decision**: Import JS data files directly; serialize each entry to descriptive plain text before embedding

**Rationale**:
All knowledge base data lives in `app/data/*.js` as named exports of arrays/objects. The ingestion script (`scripts/ingest.js`) can `import` these directly (using `--input-type=module` or `.mjs` extension). Each entry is serialized to a human-readable string (e.g., `"Department: Chemistry. Description: Master the science of matter..."`) before embedding, ensuring the embedding model captures semantic meaning rather than JSON syntax.

**Alternatives Considered**:
- **Embed raw JSON strings**: Embedding `{"name":"Chemistry","description":"..."}` includes JSON syntax tokens that dilute semantic signal.
- **External Markdown files**: Duplicate the data already in JS files; creates sync risk.

---

## Resolved Unknowns (from Spec)

| Unknown | Resolution |
|---|---|
| Streaming mechanism | Native `ReadableStream` via Gemini SDK |
| Rate limiting in serverless | `@upstash/ratelimit` with Upstash Redis |
| Context window format | Gemini `contents` array, last 6 turns |
| Chunking strategy | 1 chunk per data entry, category metadata |
| Ingestion approach | Direct JS import + text serialization |
| RAG framework | Custom pipeline (no LangChain) |

---

## Dependencies Required

| Package | Purpose | Free Tier |
|---|---|---|
| `@google/generative-ai` | Gemini LLM + embeddings | Yes (1500 req/day) |
| `@upstash/vector` | Vector DB client | Yes (10k vectors) |
| `@upstash/ratelimit` | Serverless rate limiting | Yes |
| `@upstash/redis` | Backend for ratelimit | Yes (10k cmd/day) |

No new packages needed for the frontend — existing `useChatbot.js` uses standard browser `fetch` API.
