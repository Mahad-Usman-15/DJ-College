---
id: "008"
title: "RAG Chatbot Core Implementation"
stage: green
date: "2026-03-08"
surface: agent
model: claude-sonnet-4-6
feature: 3-rag-chatbot-backend
branch: main
user: Techno
command: /sp.implement
labels: ["rag", "chatbot", "implementation", "streaming", "ingest"]
links:
  spec: specs/3-rag-chatbot-backend/spec.md
  ticket: "null"
  adr: history/adr/ADR-001-rag-pipeline-architecture.md
  pr: "null"
files:
  - scripts/ingest.js
  - app/api/chat/route.js
  - app/components/chatbot/useChatbot.js
  - app/components/chatbot/ChatbotWidget.jsx
  - specs/3-rag-chatbot-backend/tasks.md
tests: []
---

## Prompt

```text
/sp.implement (resumed from previous session — model selection question resolved, proceeding with implementation)
```

## Response

Executed Phases 1, 2, 3, 4 (code portions), 6, and T031 (lint) of the implementation plan.

### Files Created / Modified

1. **scripts/ingest.js** (T004–T006): CJS script with async main(). Loads .env.local manually, imports 4 data files via dynamic import(), defines alumni and events data inline (image imports excluded). Serializes 71 chunks across 6 categories, embeds each with Google text-embedding-004 (RETRIEVAL_DOCUMENT), upserts to Upstash Vector with {id, vector, metadata: {text, category, source}}.

2. **app/api/chat/route.js** (T008–T014 + T028): Next.js App Router POST handler. Rate limiting via @upstash/ratelimit (sliding window, 20/min/IP). Request validation (1–2000 chars). Embeds query with text-embedding-004 (RETRIEVAL_QUERY). Queries Upstash Vector (topK=5). SYSTEM_PROMPT constant + buildPrompt() helper. Builds Gemini contents[] with history (last 6 turns). Streams response via ReadableStream + TextEncoder. 503 error fallback with contact redirect.

3. **app/components/chatbot/useChatbot.js** (T015–T018, T026–T027): Added isStreaming state, SET_STREAMING and APPEND_TO_LAST_MESSAGE action types, streaming fetch replacing setTimeout, history extraction (last 6 messages → Gemini format), returns isStreaming.

4. **app/components/chatbot/ChatbotWidget.jsx** (T018): Destructures isStreaming from hook, passes isDisabled={isTyping || isStreaming} to ChatbotInput.

### Tasks Completed

T001, T004–T006, T008–T018, T026–T028, T031 — all marked [x] in tasks.md.

### Remaining Manual Tasks

T002–T003 (env vars + Upstash setup), T007 (run ingest), T019–T025 (manual smoke tests), T029–T030 (context tests), T032–T039 (polish).

## Outcome

Core RAG pipeline fully implemented. npm run lint passes (0 errors). Ready for T002–T003 (Upstash + env vars) then T007 (node scripts/ingest.js).
