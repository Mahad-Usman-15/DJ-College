---
id: "003"
title: "RAG Chatbot Backend Plan"
stage: plan
date: "2026-03-07"
surface: agent
model: claude-sonnet-4-6
feature: 3-rag-chatbot-backend
branch: main
user: Techno
command: /sp.plan
labels: ["rag", "chatbot", "plan", "gemini", "upstash", "streaming"]
links:
  spec: specs/3-rag-chatbot-backend/spec.md
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - specs/3-rag-chatbot-backend/plan.md
  - specs/3-rag-chatbot-backend/research.md
  - specs/3-rag-chatbot-backend/data-model.md
  - specs/3-rag-chatbot-backend/quickstart.md
  - specs/3-rag-chatbot-backend/contracts/api-contract.md
tests: []
---

## Prompt

```text
/sp.plan (no args — applied to active feature: 3-rag-chatbot-backend)
```

## Response

Generated full implementation plan for RAG chatbot backend.

**Phase 0 (Research)** — 6 decisions resolved:
- RAG framework: Custom pipeline (no LangChain.js)
- Streaming: Native ReadableStream + Gemini SDK
- Rate limiting: @upstash/ratelimit sliding window
- Chunking: 1 chunk per data entry
- History: Gemini contents[] array, last 6 turns
- Ingestion: Direct JS import + text serialization

**Phase 1 (Design)** — 5 artifacts generated:
- plan.md (this plan)
- research.md (6 decisions with rationale + alternatives)
- data-model.md (5 entities, state transitions, vector schema)
- contracts/api-contract.md (POST /api/chat full contract, all error codes)
- quickstart.md (step-by-step developer setup guide)

**Constitution check**: All 10 principles pass. No violations.

**3 source files to create/modify**: scripts/ingest.js (new), app/api/chat/route.js (new), app/components/chatbot/useChatbot.js (modify sendMessage).

## Outcome

Plan complete. All design artifacts ready. Ready for `/sp.adr` then `/sp.tasks`.
