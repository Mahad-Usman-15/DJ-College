# ADR-003: Conversation Context Strategy

- **Status:** Accepted
- **Date:** 2026-03-07
- **Feature:** `3-rag-chatbot-backend`
- **Context:** The chatbot must support multi-turn conversations — a visitor asking "Tell me about Chemistry" followed by "What labs does it have?" requires the second question to be understood in the context of Chemistry. Two decisions are entangled: (1) how much history to send per request, and (2) where that history is stored. These choices affect token consumption, response quality, API contract design, and future extensibility.

## Decision

**Client-side session storage with last-6-turns context window in Gemini's native multi-turn format:**

- **Storage**: Conversation history lives in React state (`useChatbot.js`) — browser memory only. No server-side session persistence.
- **Context window**: The last 6 turns (3 user messages + 3 bot responses) are included with each API request (FR-007, SC-007).
- **Format**: Gemini's native `contents` array format — `[{ role: 'user'|'model', parts: [{ text }] }]` — sent in the request body alongside the current message.
- **Persistence boundary**: History is cleared on page refresh or `clearConversation()`. No cross-session memory.
- **History extraction**: `useChatbot.js` slices `state.messages` to the last 6 entries before each API call, maps `sender: 'user'` → `role: 'user'` and `sender: 'bot'` → `role: 'model'`.

## Consequences

### Positive

- **Zero server infrastructure**: No session store, no Redis TTL management, no server-side memory. Massively simpler backend.
- **Natural token control**: Sending only the last 6 turns keeps prompt size bounded and predictable, regardless of session length.
- **Native Gemini format**: Passing `contents[]` directly to `generateContentStream()` uses Gemini's built-in multi-turn capability — better role-distinction than injecting history as text into the system prompt.
- **Privacy by default**: No conversation data is stored server-side. Conversations are ephemeral and never leave the user's browser (beyond the in-flight API request).
- **Satisfies SC-007**: "3 follow-up questions with context" is directly satisfied by 6 turns (3 exchanges).

### Negative

- **No cross-session continuity**: A visitor who refreshes the page loses conversation context. Returning visitors start fresh. Acceptable for a college info chatbot but limiting for future use cases.
- **Context loss on long sessions**: After a long conversation, older turns beyond the 6-turn window are dropped. The model may lose context from earlier in the same session.
- **Client-side history trusted**: The server receives history from the client without verification. A malicious client could inject fabricated history turns. Acceptable for a public info chatbot with no sensitive data.
- **History grows request size**: Each request includes up to ~1,500 tokens of history. Under free-tier limits but increases per-request cost if moved to a paid plan.

## Alternatives Considered

**Alternative A: Full conversation history (no limit)**
- Pros: Perfect context retention across the entire session.
- Rejected: History grows unboundedly, eventually hitting Gemini's 1M token context window. Increases latency and token cost per request. Impractical for a serverless function with no session awareness.

**Alternative B: Server-side session storage (Redis)**
- Pros: Persistent across page refreshes; server controls history; less client-to-server payload.
- Rejected: Adds Redis session infrastructure (TTL management, session ID cookies), significantly increasing complexity. Out of scope per spec — "No server-side conversation persistence" is an explicit assumption.

**Alternative C: System prompt injection (history as text)**
- Pros: Simple — prepend history as a block of text in the system prompt.
- Rejected: Loses structured role distinction (`user` vs `model`). Gemini performs better on follow-up questions with the native `contents[]` format than with history injected as unstructured text.

**Alternative D: Last 2 turns (1 exchange only)**
- Pros: Smallest possible context window; minimal token overhead.
- Rejected: Fails SC-007 ("3 follow-up questions"). A user asking a 2-step follow-up after an initial exchange loses all context.

## References

- Feature Spec: `specs/3-rag-chatbot-backend/spec.md` — FR-007, SC-007, Assumptions
- Implementation Plan: `specs/3-rag-chatbot-backend/plan.md`
- Research: `specs/3-rag-chatbot-backend/research.md` — Decision 5
- Data Model: `specs/3-rag-chatbot-backend/data-model.md` — ConversationSession, ChatAPIRequest
- API Contract: `specs/3-rag-chatbot-backend/contracts/api-contract.md` — request `history` field
- Related ADRs: ADR-001 (RAG Pipeline), ADR-002 (Rate Limiting)
