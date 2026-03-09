# Feature Specification: RAG Chatbot Backend

**Feature Branch**: `main`
**Feature Directory**: `specs/3-rag-chatbot-backend/`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Build a RAG chatbot backend for the DJ College website using Gemini 1.5 Flash and Upstash Vector, with a Next.js API route that streams responses to the existing chat UI."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ask a College Question and Get a Streamed Answer (Priority: P1)

A website visitor (prospective student, parent, or current student) opens the chatbot on the DJ College website and types a question about the college — such as admission requirements, available programs, facilities, or contact information. The chatbot immediately starts streaming a response word-by-word, providing a conversational experience without a long wait.

**Why this priority**: This is the core value of the feature. Without a working question-answer loop with streaming, the chatbot widget is non-functional.

**Independent Test**: Can be fully tested by typing any college-related question into the chat widget and verifying that a relevant, streamed response appears — delivers the complete chatbot value proposition.

**Acceptance Scenarios**:

1. **Given** the chat window is open, **When** a visitor types "What programs does DJ College offer?", **Then** the bot begins streaming a response within 3 seconds listing the available programs.
2. **Given** the chat window is open, **When** a visitor asks "How do I apply for admission?", **Then** the bot streams a response describing the SECCAP admission process, eligibility, and required documents.
3. **Given** the chat window is open, **When** a visitor asks about college contact details, **Then** the bot responds with the correct address, phone numbers, and website.
4. **Given** a question is being streamed, **When** the response is complete, **Then** the typing indicator disappears and the full message is rendered correctly.

---

### User Story 2 - Suggested Questions Return Accurate Answers (Priority: P2)

When a visitor opens the chatbot for the first time, three suggested questions are displayed. Clicking any of them submits the question and triggers the same streamed response flow as a manually typed question.

**Why this priority**: Suggested questions are the primary entry point for most users. They must work correctly to drive engagement.

**Independent Test**: Can be tested by clicking each of the three suggested questions and verifying each returns a relevant, accurate response.

**Acceptance Scenarios**:

1. **Given** the chat is freshly opened, **When** a visitor clicks "What programs do you offer?", **Then** the bot streams a response covering all intermediate and undergraduate programs.
2. **Given** the chat is freshly opened, **When** a visitor clicks "What are the admission requirements?", **Then** the bot streams a response with eligibility, documents, and timeline.
3. **Given** the chat is freshly opened, **When** a visitor clicks "How can I contact the college?", **Then** the bot streams a response with complete contact details.

---

### User Story 3 - Out-of-Scope Questions Are Handled Gracefully (Priority: P3)

A visitor asks a question unrelated to DJ College — such as general knowledge questions, political topics, or personal advice. The chatbot politely acknowledges it cannot help with that topic and redirects the user to ask about the college.

**Why this priority**: Without this, the chatbot risks providing inaccurate or inappropriate responses to off-topic queries, damaging the college's reputation.

**Independent Test**: Can be tested by submitting an off-topic question and verifying the bot declines gracefully without providing unrelated information.

**Acceptance Scenarios**:

1. **Given** the chat is open, **When** a visitor asks "Who is the Prime Minister of Pakistan?", **Then** the bot responds that it can only assist with DJ College-related questions and offers to help with college topics.
2. **Given** the chat is open, **When** a visitor sends a harmful or abusive message, **Then** the bot declines politely without engaging with the content.

---

### User Story 4 - Conversation History Is Maintained Within a Session (Priority: P4)

Within a single session, the chatbot retains the context of the conversation so follow-up questions are understood correctly (e.g., "Tell me more about that" after asking about a specific department).

**Why this priority**: Context retention significantly improves conversational quality but is not blocking for the MVP.

**Independent Test**: Can be tested by asking a follow-up question referencing a previous answer and verifying the bot responds with the correct context.

**Acceptance Scenarios**:

1. **Given** a visitor asked "Tell me about the Chemistry department", **When** they follow up with "What lab facilities does it have?", **Then** the bot responds in the context of Chemistry, not a general facilities answer.

---

### Edge Cases

- What happens when the knowledge base contains no relevant information for a question?
- How does the system handle very long questions (over 2,000 characters)?
- What if the AI service is temporarily unavailable — does the user see a clear error message?
- What happens if the user submits multiple messages rapidly before a response is complete?
- How does the system handle questions in Urdu or mixed Urdu/English?
- What if the streaming connection drops mid-response?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST accept natural language questions submitted through the existing chat widget without requiring any changes to the chat UI.
- **FR-001a**: The chat input MUST be disabled while a response is streaming and re-enabled automatically once the response is complete, preventing multiple simultaneous requests.
- **FR-002**: The system MUST retrieve relevant information exclusively from the DJ College knowledge base before generating a response — no general internet knowledge or hallucinated facts.
- **FR-003**: The system MUST stream responses progressively to the chat UI so the visitor sees words appearing in real time rather than waiting for the full response.
- **FR-004**: The system MUST cover all college knowledge domains: programs, departments, admissions process, facilities, alumni, events, contact information, college history, and fee structure guidance.
- **FR-005**: The system MUST decline to answer questions outside the scope of DJ College and redirect the user to relevant college topics.
- **FR-006**: When the backend is unavailable or a request fails, the system MUST display a friendly message in the chat window directing the visitor to the college's contact details (phone number and contact form) as an alternative — e.g., "Our assistant is temporarily unavailable. Please call 021-32622070 or use the contact form."
- **FR-007**: The system MUST maintain the conversation history within a session so follow-up questions can be answered in context. A maximum of the last 6 turns (3 user messages + 3 bot responses) MUST be included as context with each new request.
- **FR-008**: The system MUST operate within free-tier usage limits of all external services — no paid plan required for normal college website traffic levels.
- **FR-009**: The system MUST NOT expose API keys or credentials to the browser at any point.
- **FR-010**: The system MUST respond with the first streamed content within 3 seconds of a question being submitted under normal conditions.
- **FR-011**: The system MUST enforce a rate limit of 20 requests per minute per IP address. Requests exceeding this limit MUST receive a clear, user-friendly message informing the visitor to wait before trying again.
- **FR-012**: When vector retrieval returns no sufficiently relevant chunks for an on-topic question, the system MUST respond with a message acknowledging it cannot find specific information on that topic and directing the visitor to contact the college directly (phone or contact form) for assistance.

### Key Entities

- **Knowledge Chunk**: A discrete unit of college information (e.g., a department description, a facility overview, an FAQ answer, an alumni bio). Has a text content, a category (programs / admissions / facilities / alumni / events / contact / history), and a source reference.
- **User Message**: A natural language question submitted by a visitor. Has text content, a session ID, and a timestamp.
- **Bot Response**: A streamed answer generated from retrieved knowledge chunks. Grounded in one or more knowledge chunks; delivered progressively.
- **Conversation Session**: A single continuous chat session. Contains an ordered list of user messages and bot responses. Persists in browser memory only (not stored server-side).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors receive the first streamed word within 3 seconds of submitting a question under normal load.
- **SC-002**: 90% or more of questions about college programs, admissions, facilities, alumni, and contact details receive factually accurate, relevant answers verifiable against the knowledge base.
- **SC-003**: 100% of out-of-scope questions receive a graceful decline response — zero cases of the bot providing unrelated or fabricated information.
- **SC-004**: The chatbot remains fully functional within free-tier usage limits at typical college website traffic (under 200 daily active users).
- **SC-005**: Zero instances of API credentials appearing in browser network traffic or client-side code.
- **SC-006**: The chat UI requires zero modifications to integrate with the backend — the existing widget works as-is with only the API endpoint wired in.
- **SC-007**: Users can ask at least 3 follow-up questions in a single session with correct contextual understanding in each response.

---

## Clarifications

### Session 2026-03-07

- Q: Should the chatbot API enforce rate limiting per visitor to protect free-tier quotas? → A: Yes — rate limit per IP address, 20 requests per minute. Requests over the limit receive a user-friendly wait message.
- Q: When a visitor submits a new message while a response is still streaming, what should happen? → A: Disable the input field while streaming; re-enable automatically when the response is complete.
- Q: How many prior conversation turns should be sent as context with each new question? → A: Last 6 turns (3 exchanges — 3 user messages + 3 bot responses).
- Q: What should the error message do when the AI service is down? → A: Show a friendly message redirecting the visitor to the college phone number (021-32622070) and contact form.
- Q: How should re-ingestion be triggered when knowledge base data files are updated? → A: Manual — developer runs `node scripts/ingest.js` after data file changes; process documented in README.

---

## Assumptions

- The existing chatbot UI (`app/components/chatbot/`) is complete and production-ready. Only `useChatbot.js` needs its `sendMessage` placeholder replaced with a real API call.
- The college knowledge base is sourced entirely from the structured data files in `app/data/` (6 files: `college-info.js`, `admission.js`, `facilities.js`, `alumni.js`, `events.js`, `home.js`). No external document parsing is required.
- The knowledge base is small enough (under 100 documents) that a single ingestion run is sufficient. Re-ingestion is triggered manually by a developer running `node scripts/ingest.js` after any change to files in `app/data/`. This process must be documented in the README.
- All required external services (AI provider, vector database) offer adequate free-tier quotas for a college website audience.
- The deployment target supports server-side streaming responses (Vercel is confirmed compatible).
- Conversation history is session-only (browser memory). No server-side conversation persistence is required for this feature.
- The chatbot is English-language only for this version. Urdu support is out of scope.

---

## Out of Scope

- Admin interface for managing the knowledge base
- Conversation logging or analytics
- Multi-language support (Urdu)
- User authentication for the chatbot
- Persistent conversation history across sessions
- Integration with external live data (e.g., real-time admission status, live timetable)
- Voice input or output
