# ADR-001: RAG Pipeline Architecture

- **Status:** Accepted
- **Date:** 2026-03-07
- **Feature:** `3-rag-chatbot-backend`
- **Context:** The DJ College chatbot needs a backend pipeline to answer natural language questions using the college's structured knowledge base (~85–100 documents across 6 JS data files). The pipeline must embed queries, retrieve relevant chunks, and stream grounded responses — all within free-tier limits on Vercel serverless. The chatbot UI is already built; only the backend needs implementation.

## Decision

**Custom RAG pipeline** using direct SDK integrations:

- **Retrieval**: `@upstash/vector` SDK — query top-5 chunks by cosine similarity against 768-dim Google embeddings
- **Embeddings**: `@google/generative-ai` SDK — `text-embedding-004` with task type `RETRIEVAL_DOCUMENT` (ingestion) and `RETRIEVAL_QUERY` (query)
- **LLM + Streaming**: `@google/generative-ai` SDK — `gemini-1.5-flash` with `generateContentStream()`, piped to a native `ReadableStream` returned from the Next.js API route
- **Chunking**: One chunk per data entry (each department, facility, alumni bio, FAQ = 1 chunk); entries serialized to plain text before embedding
- **Ingestion**: `scripts/ingest.js` — imports JS data files directly, serializes each entry to a human-readable string, embeds, and upserts into Upstash Vector. Run manually after any `app/data/` change.

## Consequences

### Positive

- **Zero framework overhead**: No LangChain.js abstraction layer — the pipeline is ~80 lines of explicit, readable code. Any engineer can trace the full request flow in one file.
- **Smaller bundle**: No LangChain dependency (~500KB+); only the official SDKs required.
- **Full control**: Chunking, prompt construction, and retrieval parameters are directly adjustable without fighting framework conventions.
- **Native streaming**: Gemini SDK's `generateContentStream()` returns an async iterable that maps directly to a `ReadableStream` — no adapter layer needed.
- **Semantic chunk integrity**: 1 chunk per entry preserves the natural unit of retrieval (a user asking about "Chemistry" gets the whole Chemistry entry, not a fragment).
- **Maintainability**: Ingestion script is a one-time runner, not a service. Simple to understand, re-run, and extend.

### Negative

- **No abstraction for future scale**: If the knowledge base grows to thousands of documents, a custom pipeline will need manual re-engineering (chunking strategy, metadata filtering, re-ranking). A framework like LangChain would provide these capabilities out of the box.
- **Prompt engineering is manual**: System prompt, context injection, and history formatting must be manually maintained. LangChain provides prompt templates and chain abstractions.
- **Re-ingestion is manual**: Any `app/data/` change requires a developer to run `node scripts/ingest.js`. No automated sync.
- **No built-in observability**: LangChain provides tracing/logging hooks; the custom pipeline has none by default.

## Alternatives Considered

**Alternative A: LangChain.js** (`@langchain/google-genai` + `@langchain/community/vectorstores/upstash`)
- Pros: Mature ecosystem, built-in chunking/retrieval/prompting, tracing via LangSmith, easier to extend.
- Rejected: Overkill for ~85 documents. Adds ~500KB dependency and significant abstraction overhead. The simple pipeline (embed → retrieve → prompt → stream) doesn't benefit from framework scaffolding at this scale.

**Alternative B: Vercel AI SDK** (`ai` + `@ai-sdk/google`)
- Pros: Excellent streaming DX for Next.js, `streamText` built-in, `useChat` hook integration.
- Rejected: Streaming benefit is subsumed by Gemini SDK's native `generateContentStream()`. The existing `useChatbot.js` hook already handles state — `useChat` would be redundant and would require replacing the custom hook.

**Alternative C: Python FastAPI microservice** (LangChain Python + ChromaDB)
- Pros: Richer Python AI ecosystem, ChromaDB runs locally.
- Rejected: Requires separate hosting (Railway/Render free tier), CORS configuration, and a split-language codebase. Complexity far outweighs benefits for this use case.

## References

- Feature Spec: `specs/3-rag-chatbot-backend/spec.md`
- Implementation Plan: `specs/3-rag-chatbot-backend/plan.md`
- Research: `specs/3-rag-chatbot-backend/research.md` — Decisions 1, 2, 4, 6
- API Contract: `specs/3-rag-chatbot-backend/contracts/api-contract.md`
- Data Model: `specs/3-rag-chatbot-backend/data-model.md`
- Related ADRs: ADR-002 (Rate Limiting), ADR-003 (Conversation Context)
