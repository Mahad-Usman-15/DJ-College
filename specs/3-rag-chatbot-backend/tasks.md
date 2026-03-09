# Tasks: RAG Chatbot Backend

**Input**: Design documents from `specs/3-rag-chatbot-backend/`
**Prerequisites**: spec.md ✅ | plan.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅
**Tests**: No automated tests — manual smoke tests included per user story (no TDD requested in spec)

**Organization**: Tasks grouped by user story for independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other [P] tasks (different files, no shared dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file paths included in every task description

---

## Phase 1: Setup (Environment & Dependencies)

**Purpose**: Install packages and configure external services before any code is written.

- [x] T001 Install npm packages: `npm install @google/generative-ai @upstash/vector @upstash/ratelimit @upstash/redis`
- [x] T002 [P] Create `.env.local` with all 5 required environment variables: `GOOGLE_GENERATIVE_AI_API_KEY`, `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- [x] T003 [P] In Upstash console: create Vector index with dimensions=768, distance=Cosine; create Redis database. Copy all REST URLs and tokens into `.env.local`

**Checkpoint**: `node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'OK' : 'MISSING')"` returns OK for all 5 vars.

---

## Phase 2: Foundational — Knowledge Base Ingestion

**Purpose**: Populate the Upstash Vector index with embedded college data. **All user stories depend on this being complete.**

**⚠️ CRITICAL**: No user story can be tested until this phase is complete and `node scripts/ingest.js` runs successfully.

- [x] T004 Create `scripts/ingest.js`: import all 6 data files from `app/data/` (`college-info.js`, `admission.js`, `facilities.js`, `alumni.js`, `events.js`, `home.js`) and write a `serializeChunk(entry, category, source)` helper that converts each JS object to a human-readable plain text string (e.g., `"Department: Chemistry. Description: Master the science of matter..."`)
- [x] T005 Add Google embedding logic to `scripts/ingest.js`: initialize `GoogleGenerativeAI` client using `process.env.GOOGLE_GENERATIVE_AI_API_KEY`; create `embedChunk(text)` function that calls `model.embedContent({ content: { parts: [{ text }] }, taskType: 'RETRIEVAL_DOCUMENT' })` using model `text-embedding-004`; return the 768-dim embedding values array
- [x] T006 Add Upstash Vector upsert logic to `scripts/ingest.js`: initialize `Index` client from `@upstash/vector` using env vars; iterate all serialized chunks; call `embedChunk()` then `index.upsert([{ id, vector, metadata: { text, category, source } }])`; log progress per data file
- [x] T007 Run `node scripts/ingest.js` and verify console output confirms ~65–100 chunks ingested across all 6 data files with no errors

**Checkpoint**: Ingestion script exits with `Done. Total: N chunks ingested` and zero errors. Verify in Upstash console that the vector index shows the expected vector count.

---

## Phase 3: User Story 1 — Core Streaming Q&A (Priority: P1) 🎯 MVP

**Goal**: A visitor types any college question and receives a streamed, grounded answer in real time.

**Independent Test**: Open the chatbot widget, type "What programs does DJ College offer?", verify text streams word-by-word and the answer accurately covers FSc Pre-Engineering, Pre-Medical, and BS programs.

### Implementation

- [x] T008 [US1] Create `app/api/chat/route.js`: scaffold the `POST` export; initialize `@upstash/ratelimit` with `Ratelimit.slidingWindow(20, '1 m')` using `@upstash/redis` client from env vars; extract client IP from `request.headers.get('x-forwarded-for') ?? '127.0.0.1'`; call `ratelimit.limit(ip)` and return `Response` with status 429 and JSON `{ error: "Too many requests. Please wait a moment before trying again.", code: "RATE_LIMIT_EXCEEDED" }` if limit exceeded
- [x] T009 [US1] Add request validation to `app/api/chat/route.js`: parse JSON body; validate `message` is present, non-empty after trim, and under 2000 characters; return 400 with `{ error: "Message is required and must be between 1 and 2000 characters.", code: "INVALID_MESSAGE" }` on failure
- [x] T010 [US1] Add query embedding to `app/api/chat/route.js`: initialize `GoogleGenerativeAI` client; call `model.embedContent({ content: { parts: [{ text: message }] }, taskType: 'RETRIEVAL_QUERY' })` using `text-embedding-004`; store resulting 768-dim vector
- [x] T011 [US1] Add vector retrieval to `app/api/chat/route.js`: initialize `@upstash/vector` `Index` client; call `index.query({ vector, topK: 5, includeMetadata: true })`; extract `metadata.text` from each result into a `contextChunks` array
- [x] T012 [US1] Add prompt construction to `app/api/chat/route.js`: define `SYSTEM_PROMPT` constant: `"You are a helpful assistant for D.J. Sindh Government Science College. Answer questions using ONLY the provided college information below. If the question is not about DJ College, politely decline and redirect the visitor to ask college-related questions. If no relevant information is found in the context, respond: 'I don't have specific information about that. Please contact us at 021-32622070 or use the contact form for assistance.' Never make up information not in the provided context."`; build context string by joining `contextChunks` with newline separators (handles FR-012: zero-match retrieval)
- [x] T013 [US1] Add Gemini streaming to `app/api/chat/route.js`: initialize `gemini-1.5-flash` model; extract the system prompt and context-building logic into a named constant `SYSTEM_PROMPT` and a `buildPrompt(context, message)` helper within `route.js`; call `model.generateContentStream(contents)` where contents combines system prompt + context + message; create a `ReadableStream` that iterates `stream.stream`, encodes each `chunk.text()` with `TextEncoder`, and enqueues it; return `new Response(readableStream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })`
- [x] T014 [US1] Add error handling to `app/api/chat/route.js`: wrap all external calls (embedding, vector query, Gemini) in try/catch; return 503 with `{ error: "Our assistant is temporarily unavailable. Please call 021-32622070 or use the contact form.", code: "SERVICE_UNAVAILABLE" }` on external service failure; return 500 with `{ error: "Something went wrong. Please try again.", code: "INTERNAL_ERROR" }` for unexpected errors
- [x] T015 [P] [US1] Add `isStreaming: false` to `initialState` and `SET_STREAMING` to `ActionTypes` in `app/components/chatbot/useChatbot.js`; handle `SET_STREAMING` in `chatbotReducer` by toggling `state.isStreaming`
- [x] T016 [P] [US1] Add `APPEND_TO_LAST_MESSAGE` to `ActionTypes` in `app/components/chatbot/useChatbot.js`; handle it in `chatbotReducer` by returning state with the last message's `content` field extended by `action.payload` (the incoming text chunk)
- [x] T017 [US1] Replace the `setTimeout` block (lines 156–170) in `sendMessage` in `app/components/chatbot/useChatbot.js` with: dispatch `SET_STREAMING(true)` → fetch `POST /api/chat` with `{ message: content, history: [] }` → on non-OK response parse JSON and dispatch `ADD_MESSAGE(bot, error.error)` → on OK response read stream with `response.body.getReader()` and `TextDecoder`, dispatch `SET_TYPING(false)` + `ADD_MESSAGE(bot, '')` on first chunk, then `APPEND_TO_LAST_MESSAGE(chunk)` for each subsequent chunk → dispatch `SET_STREAMING(false)` after stream ends or on error
- [x] T018 [US1] Add `isStreaming` to the return value of `useChatbot()` in `app/components/chatbot/useChatbot.js`; verify `ChatbotInput.jsx` reads `isStreaming` (or `isTyping`) from the hook and sets the input field's `disabled` prop accordingly — update `ChatbotInput.jsx` if `disabled` is not already wired

**Checkpoint**: Open chatbot → type "What programs does DJ College offer?" → first streamed word appears within 3 seconds → full accurate response rendered → input re-enables after stream ends.

---

## Phase 4: User Story 2 — Suggested Questions (Priority: P2)

**Goal**: Clicking any of the 3 pre-set suggested questions triggers the same streaming flow and returns an accurate answer.

**Independent Test**: Click each of the 3 suggested questions in sequence; each must stream an accurate, relevant response.

### Implementation

- [ ] T019 [US2] Verify in `app/components/chatbot/SuggestedQuestions.jsx` (or `ChatbotInput.jsx`) that clicking a suggested question calls `sendMessage(question.text)` — if using a different prop (e.g., `onSend`, `onSelect`), trace through to confirm `sendMessage` in `useChatbot.js` is invoked; no code changes expected
- [ ] T020 [P] [US2] Manual test: click "What programs do you offer?" → verify streamed response covers FSc Pre-Engineering, FSc Pre-Medical, and BS programs (Chemistry, Physics, Computer Science)
- [ ] T021 [P] [US2] Manual test: click "What are the admission requirements?" → verify response mentions SECCAP portal, June 15 – July 15 timeline, required documents, and eligibility (passed Class IX)
- [ ] T022 [P] [US2] Manual test: click "How can I contact the college?" → verify response includes phone number (021-32622070), website (www.djedu.pk), and address (Dr. Ziauddin Ahmed Road)

**Checkpoint**: All 3 suggested questions produce accurate, streamed responses within 3 seconds.

---

## Phase 5: User Story 3 — Out-of-Scope Handling (Priority: P3)

**Goal**: Off-topic and harmful questions are declined gracefully with a redirect to DJ College topics.

**Independent Test**: Submit "Who is the Prime Minister of Pakistan?" → verify the bot declines and redirects, without providing the answer.

### Implementation

- [ ] T023 [US3] Review the system prompt string in `app/api/chat/route.js` (set in T012): confirm it explicitly instructs Gemini to decline off-topic questions and redirect; strengthen if needed to: `"...If the question is not about DJ College or its programs, facilities, admissions, alumni, events, or contact information, politely say you can only help with DJ College questions and suggest topics you can assist with."`
- [ ] T024 [P] [US3] Manual test: send "Who is the Prime Minister of Pakistan?" → verify bot responds with a decline message and offers to help with DJ College topics; verify it does NOT answer the off-topic question
- [ ] T025 [P] [US3] Manual test: send "Write me an essay on climate change" → verify graceful decline and redirect

**Checkpoint**: 100% of tested off-topic questions receive a graceful decline with no unrelated information provided (FR-005, SC-003).

---

## Phase 6: User Story 4 — Conversation Context (Priority: P4)

**Goal**: Follow-up questions within a session are answered with awareness of prior exchanges.

**Independent Test**: Ask "Tell me about the Chemistry department", then follow up with "What lab facilities does it have?" — verify the second answer is about Chemistry labs, not general facilities.

### Implementation

- [x] T026 [US4] Add history extraction to `sendMessage` in `app/components/chatbot/useChatbot.js`: before the fetch call, slice `state.messages` to the last 6 entries (excluding the message just added); map each to `{ role: entry.sender === 'user' ? 'user' : 'model', content: entry.content }`; store as `history` array
- [x] T027 [US4] Pass `history` in the fetch request body in `app/components/chatbot/useChatbot.js`: update `body: JSON.stringify({ message: content, history })` (replacing `history: []` from T017)
- [x] T028 [US4] Update `app/api/chat/route.js` to use history in Gemini contents array: extract `history` from parsed request body; build `contents` array as `[...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })), { role: 'user', parts: [{ text: systemPrompt + '\n\nContext:\n' + context + '\n\nQuestion: ' + message }] }]`; pass `contents` to `generateContentStream(contents)`
- [ ] T029 [US4] Manual test: ask "Tell me about the Chemistry department" → follow up "What lab facilities does it have?" → verify second response is specific to Chemistry labs (mentions microscopes, chemical analysis equipment) rather than a generic facilities list
- [ ] T030 [US4] Manual test: chain 3 follow-up questions to verify SC-007 (3 exchanges with correct contextual understanding each time)

**Checkpoint**: 3-turn contextual conversation works correctly end-to-end. Input remains disabled during streaming throughout.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, validation, and documentation.

- [x] T031 [P] Run `npm run lint` and fix any ESLint errors in `app/api/chat/route.js` and `app/components/chatbot/useChatbot.js`
- [x] T032 [P] Update `README.md` `Environment Variables` section to include `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (added in this feature, not in the original README)
- [ ] T033 Validate rate limiting: send more than 20 requests within 1 minute (use browser DevTools to rapidly submit messages); verify 429 response with user-friendly message appears in chat window
- [ ] T034 Validate error handling: temporarily set `GOOGLE_GENERATIVE_AI_API_KEY` to an invalid value in `.env.local`, restart dev server, send a message; verify chat shows friendly 503 message with phone number and contact form redirect; restore correct key
- [ ] T035 Full end-to-end validation following `specs/3-rag-chatbot-backend/quickstart.md`: fresh `.env.local` setup → `npm install` → `node scripts/ingest.js` → `npm run dev` → test all 5 quickstart questions → verify SC-001 through SC-007
- [ ] T036 [P] Verify FR-009 (no credentials in browser): open browser DevTools → Network tab → submit a chat message → inspect the `/api/chat` request payload and all response headers; confirm no `GOOGLE_*`, `UPSTASH_*`, or `RESEND_*` keys appear anywhere in client-visible traffic (SC-005)
- [x] T037 [P] Document free-tier headroom in `README.md` under a new `Free Tier Limits` subsection: Gemini 1,500 req/day, Upstash Vector 10k vectors, Upstash Redis 10k cmd/day; calculate that 200 DAU × 10 messages/day = 2,000 Gemini calls + ~4,000 Redis rate-limit commands — confirm all within limits (FR-008)
- [ ] T038 SC-002 accuracy benchmark: define and manually test 10 benchmark questions (2 per domain — programs, admissions, facilities, alumni, contact); verify each answer is factually accurate against the corresponding `app/data/` source file; record pass/fail in a checklist; target ≥9/10 correct (90%) to satisfy SC-002
- [ ] T039 [P] Run Lighthouse audit on homepage (`/`) after chatbot backend is wired: confirm Performance, SEO, and Accessibility scores remain ≥90 (constitution requirement); new server-side packages should not affect client bundle — document the scores

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user stories**
- **Phase 3 (US1)**: Depends on Phase 2 only — no dependency on US2, US3, or US4
- **Phase 4 (US2)**: Depends on Phase 3 (US1) — same `sendMessage` flow
- **Phase 5 (US3)**: Depends on Phase 3 (T012 — system prompt in route.js)
- **Phase 6 (US4)**: Depends on Phase 3 (T017 — streaming fetch in useChatbot.js)
- **Phase 7 (Polish)**: Depends on all phases complete

### Within Phase 3 (US1)

```
T008 → T009 → T010 → T011 → T012 → T013 → T014   (route.js, sequential)
T015 → T016 → T017 → T018                           (useChatbot.js, sequential)

T008–T014 and T015–T018 are PARALLEL to each other (different files)
```

### Parallel Opportunities

- T002 and T003 (Phase 1): parallel — different environments/services
- T008–T014 and T015–T018 (Phase 3): parallel — different files
- T020, T021, T022 (Phase 4): parallel — independent manual tests
- T024, T025 (Phase 5): parallel — independent manual tests
- T031 and T032 (Phase 7): parallel — different files

---

## Parallel Execution Example: Phase 3 (US1)

```
Parallel stream A (route.js):
  T008 → T009 → T010 → T011 → T012 → T013 → T014

Parallel stream B (useChatbot.js):
  T015 → T016 → T017 → T018

Merge: T019 (manual smoke test — requires both streams complete)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational ingestion (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (core streaming Q&A)
4. **STOP and VALIDATE**: type a question in the chatbot, verify streamed response
5. US1 alone is a fully functional chatbot — deploy if ready

### Incremental Delivery

1. Setup + Foundational → knowledge base ready
2. US1 → working chatbot with streaming (MVP — deploy)
3. US2 → suggested questions verified (likely free after US1)
4. US3 → out-of-scope handling tuned via system prompt
5. US4 → conversation context added
6. Polish → hardened, linted, documented

---

## Notes

- No automated tests required — manual smoke tests are defined per phase
- `[P]` tasks in Phase 3 (route.js vs useChatbot.js streams) are the primary parallelization opportunity
- US2 may require zero code changes — verify before writing any code (T019)
- US3 is controlled by the system prompt string — a one-line update (T023) may be all that's needed
- Commit after each phase checkpoint
- Stop at any checkpoint to validate independently before continuing
