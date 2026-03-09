# Implementation Plan: RAG Chatbot Backend

**Branch**: `main` | **Date**: 2026-03-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/3-rag-chatbot-backend/spec.md`

---

## Summary

Build the backend for the DJ College AI chatbot: a Next.js API route (`/api/chat`) that embeds incoming questions, retrieves relevant chunks from a pre-ingested Upstash Vector knowledge base, builds a grounded prompt with conversation history, and streams a response from Google Gemini 1.5 Flash. A one-time ingestion script converts all structured data files in `app/data/` into vector embeddings. The existing `useChatbot.js` hook is wired to the API by replacing the `setTimeout` placeholder with a streaming `fetch` call.

---

## Technical Context

**Language/Version**: JavaScript (ES Modules), Node.js 18+
**Primary Dependencies**: `@google/generative-ai`, `@upstash/vector`, `@upstash/ratelimit`, `@upstash/redis`
**Storage**: Upstash Vector (768-dim, cosine similarity) + Upstash Redis (rate limiting)
**Testing**: Manual browser testing + `node scripts/ingest.js` smoke test
**Target Platform**: Vercel (serverless, Edge-compatible)
**Performance Goals**: First streamed token ≤ 3 seconds (FR-010, SC-001)
**Constraints**: Free tier only; no server-side session persistence; 20 req/min per IP
**Scale/Scope**: ~85–100 vector chunks; ~200 daily active users max

---

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| Code Quality | ✅ Pass | Clean modular route handler; ingestion script separated |
| Performance First | ✅ Pass | Streaming avoids wait; top-5 vector retrieval is fast |
| Accessibility | ✅ Pass | No UI changes; existing accessible widget unchanged |
| Maintainability | ✅ Pass | Single responsibility: ingest.js, route.js, useChatbot.js |
| Responsiveness | ✅ N/A | No UI changes in this feature |
| SEO Optimization | ✅ N/A | Chatbot is client-side; no SEO impact |
| Framework (Next.js App Router) | ✅ Pass | API route uses App Router `route.js` convention |
| Styling (Tailwind) | ✅ N/A | No styling changes |
| ESLint (zero critical warnings) | ✅ Pass | Must pass before merge |
| No unnecessary dependencies | ✅ Pass | 4 packages, all purpose-built and minimal |

**Gate result**: All checks pass. No violations to justify.

---

## Project Structure

### Documentation (this feature)

```text
specs/3-rag-chatbot-backend/
├── plan.md              ← this file
├── research.md          ← Phase 0 decisions
├── data-model.md        ← entities, state transitions, vector schema
├── quickstart.md        ← developer setup guide
├── contracts/
│   └── api-contract.md  ← POST /api/chat full contract
└── checklists/
    └── requirements.md  ← spec quality checklist (all pass)
```

### Source Code Changes

```text
app/
├── api/
│   └── chat/
│       └── route.js          ← NEW: RAG endpoint (streaming)
├── components/
│   └── chatbot/
│       └── useChatbot.js     ← MODIFY: replace setTimeout with streaming fetch
│                                        add APPEND_TO_LAST_MESSAGE action
│                                        add isStreaming state field
scripts/
└── ingest.js                 ← NEW: one-time knowledge base ingestion
```

---

## Phase 0: Research — Complete

All unknowns resolved. See `research.md` for full decision rationale.

| Decision | Chosen | Rejected |
|---|---|---|
| RAG framework | Custom pipeline | LangChain.js, Vercel AI SDK |
| Streaming | Native `ReadableStream` + Gemini SDK | SSE, Vercel AI SDK `streamText` |
| Rate limiting | `@upstash/ratelimit` (Redis, sliding window) | In-memory Map, Middleware |
| Chunking | 1 chunk per data entry | Character-split, Section-level |
| History format | Gemini `contents[]` array (last 6 turns) | System prompt injection, Full history |
| Ingestion | Direct JS import + text serialization | External Markdown files, Raw JSON |

---

## Phase 1: Design — Complete

All design artifacts generated.

| Artifact | Path | Status |
|---|---|---|
| Data Model | `data-model.md` | ✅ Done |
| API Contract | `contracts/api-contract.md` | ✅ Done |
| Quickstart | `quickstart.md` | ✅ Done |

---

## Implementation Overview

### File 1: `scripts/ingest.js`

**Purpose**: One-time script. Reads all `app/data/*.js` files, serializes each entry to plain text, embeds with Google text-embedding-004, and upserts into Upstash Vector.

**Key logic**:
1. Import all data file exports
2. For each entry, generate `id` (e.g., `"department-chemistry"`) and `text` (human-readable string)
3. Call `embedContent()` on Google Generative AI client with `RETRIEVAL_DOCUMENT` task type
4. Call `index.upsert()` on Upstash Vector client with `{ id, vector, metadata: { text, category, source } }`
5. Log progress per file; report total at end

**Runs**: `node scripts/ingest.js` (once after setup; again after any `app/data/` change)

---

### File 2: `app/api/chat/route.js`

**Purpose**: Serverless API route. Validates request, rate-limits, retrieves context, builds prompt, streams Gemini response.

**Key logic**:
```
export async function POST(request):
  1. Rate limit check (IP → Upstash Redis) → 429 if exceeded
  2. Parse body: { message, history } → 400 if invalid
  3. Embed message with text-embedding-004 (RETRIEVAL_QUERY task)
  4. Query Upstash Vector: top-5 chunks by cosine similarity
  5. Build system prompt: "You are a helpful assistant for DJ College..."
  6. Build contents array: [system context] + history (last 6 turns) + [user message]
  7. Call gemini.generateContentStream(contents)
  8. Return new Response(ReadableStream from stream)

  On any external error:
  9. Return 503 with friendly contact redirect message
```

**System prompt** (baked in):
> "You are a helpful assistant for D.J. Sindh Government Science College. Answer questions using only the provided college information. If the question is not about the college, politely redirect the visitor to ask college-related questions. Never make up information not in the provided context."

---

### File 3: `app/components/chatbot/useChatbot.js`

**Purpose**: Replace the `setTimeout` placeholder with a real streaming API call.

**Changes required**:
1. Add `isStreaming: false` to `initialState`
2. Add `SET_STREAMING` to `ActionTypes`
3. Add `APPEND_TO_LAST_MESSAGE` to `ActionTypes`
4. Handle both in `chatbotReducer`:
   - `SET_STREAMING`: toggle `state.isStreaming`
   - `APPEND_TO_LAST_MESSAGE`: append chunk to last message's `content`
5. Replace the `setTimeout` block in `sendMessage` with:
   - `SET_STREAMING(true)` → `fetch('/api/chat', ...)` → read stream → `APPEND_TO_LAST_MESSAGE` → `SET_STREAMING(false)`
6. Build `history` from last 6 `state.messages` (mapped to `{ role: 'user'|'model', content }`)
7. Pass `isStreaming` in the return value (UI uses it to disable input)

---

## Environment Variables Required

```env
GOOGLE_GENERATIVE_AI_API_KEY=   # Gemini LLM + embeddings
UPSTASH_VECTOR_REST_URL=        # Vector DB endpoint
UPSTASH_VECTOR_REST_TOKEN=      # Vector DB auth
UPSTASH_REDIS_REST_URL=         # Redis for rate limiting
UPSTASH_REDIS_REST_TOKEN=       # Redis auth
```

All accessed server-side only via `process.env`. Never exposed to the browser.

---

## Acceptance Checks (from spec)

- [ ] Chatbot streams first word within 3 seconds (SC-001)
- [ ] 90%+ of college questions return accurate answers (SC-002)
- [ ] Off-topic questions declined gracefully (SC-003)
- [ ] Stays within free-tier limits at ≤200 DAU (SC-004)
- [ ] No API keys in browser network traffic (SC-005)
- [ ] Zero UI changes required to wire in the backend (SC-006)
- [ ] 3+ follow-up questions work with correct context (SC-007)
- [ ] Rate limit returns 429 after 20 req/min (FR-011)
- [ ] Input disabled while streaming (FR-001a)
- [ ] Error shows contact redirect message (FR-006)
