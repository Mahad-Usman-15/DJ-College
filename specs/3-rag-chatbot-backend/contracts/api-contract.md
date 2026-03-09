# API Contract: RAG Chatbot Backend

**Feature**: `3-rag-chatbot-backend`
**Date**: 2026-03-07
**Version**: v1

---

## Endpoint: POST /api/chat

### Description

Accepts a user message and conversation history, retrieves relevant college knowledge, and streams a grounded AI response back to the client.

---

### Request

**Method**: `POST`
**URL**: `/api/chat`
**Content-Type**: `application/json`

**Body**:
```json
{
  "message": "string",
  "history": [
    {
      "role": "user | model",
      "content": "string"
    }
  ]
}
```

**Field Constraints**:

| Field | Required | Type | Constraints |
|---|---|---|---|
| `message` | Yes | string | 1–2000 characters, non-empty after trim |
| `history` | No | array | Max 6 elements (last 3 exchanges); omit or `[]` for first message |
| `history[].role` | Yes (if history provided) | string | Must be `"user"` or `"model"` |
| `history[].content` | Yes (if history provided) | string | Non-empty string |

**Example Request**:
```json
{
  "message": "What programs does DJ College offer?",
  "history": []
}
```

**Follow-up Request Example**:
```json
{
  "message": "Tell me more about the Chemistry department",
  "history": [
    { "role": "user", "content": "What programs does DJ College offer?" },
    { "role": "model", "content": "DJ College offers FSc Pre-Engineering, FSc Pre-Medical..." }
  ]
}
```

---

### Response — Success (200)

**Content-Type**: `text/plain; charset=utf-8`
**Transfer-Encoding**: chunked (streaming)

The response body is a stream of UTF-8 text chunks. The client reads these incrementally and appends each chunk to the displayed bot message.

**Stream behavior**:
- First chunk arrives within 3 seconds (FR-010 / SC-001)
- Chunks are raw text fragments (no delimiters, no JSON wrapping)
- Stream ends with an empty chunk signaling completion

**Example stream output** (chunks received over time):
```
"D.J. Sindh "
"Government "
"Science College "
"offers the following programs..."
```

---

### Response — Errors

All errors return JSON with `Content-Type: application/json`.

#### 400 Bad Request
Returned when `message` is missing, empty, or exceeds 2000 characters.

```json
{
  "error": "Message is required and must be between 1 and 2000 characters.",
  "code": "INVALID_MESSAGE"
}
```

#### 429 Too Many Requests
Returned when the client IP exceeds 20 requests per minute.

```json
{
  "error": "Too many requests. Please wait a moment before trying again.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

**Headers included**:
```
Retry-After: <seconds until limit resets>
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 0
```

#### 503 Service Unavailable
Returned when the AI service (Gemini) or vector database (Upstash) is unreachable.

```json
{
  "error": "Our assistant is temporarily unavailable. Please call 021-32622070 or use the contact form.",
  "code": "SERVICE_UNAVAILABLE"
}
```

#### 500 Internal Server Error
Returned for unexpected errors.

```json
{
  "error": "Something went wrong. Please try again.",
  "code": "INTERNAL_ERROR"
}
```

---

### Headers

**Request headers** (sent by client):
| Header | Value |
|---|---|
| `Content-Type` | `application/json` |

**Response headers** (for 200 streaming):
| Header | Value |
|---|---|
| `Content-Type` | `text/plain; charset=utf-8` |
| `Transfer-Encoding` | `chunked` |
| `X-Content-Type-Options` | `nosniff` |

---

### Rate Limiting

- **Algorithm**: Sliding window
- **Limit**: 20 requests per minute per IP address
- **Identification**: `x-forwarded-for` header (Vercel) → fallback to `request.ip`
- **Backend**: Upstash Redis via `@upstash/ratelimit`
- **Exceeded behavior**: Return `429` immediately without hitting Gemini or Upstash Vector

---

### Processing Pipeline (Internal)

```
1. Extract IP from request headers
2. Check rate limit (Upstash Redis) → 429 if exceeded
3. Parse + validate request body → 400 if invalid
4. Embed user message (Google text-embedding-004)
5. Query Upstash Vector (top-5 chunks by cosine similarity)
6. Build Gemini prompt:
     [System prompt: DJ College assistant, no hallucination]
     [Retrieved context: top-5 chunks as text]
     [History: last 6 turns in Gemini contents format]
     [User message]
7. Call Gemini 1.5 Flash generateContentStream()
8. Pipe stream to Response → client
```

---

### Client Integration (useChatbot.js)

```javascript
// Pseudocode — replace the setTimeout in sendMessage with:

const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: content, history: last6Turns })
});

if (!response.ok) {
  const { error } = await response.json();
  // dispatch ADD_MESSAGE with error text
  return;
}

const reader = response.body.getReader();
const decoder = new TextDecoder();

// dispatch ADD_MESSAGE (bot, empty) — creates the message bubble
// dispatch SET_TYPING(false)

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value, { stream: true });
  // dispatch APPEND_TO_LAST_MESSAGE(chunk)
}

// dispatch SET_STREAMING(false)
```

---

### Security

- API keys (`GOOGLE_GENERATIVE_AI_API_KEY`, `UPSTASH_VECTOR_REST_TOKEN`, `UPSTASH_REDIS_REST_TOKEN`) are accessed via `process.env` server-side only — never exposed to the browser.
- No authentication required (public endpoint for college website visitors).
- Input validated server-side before any external API call.
- Rate limiting prevents quota abuse.
