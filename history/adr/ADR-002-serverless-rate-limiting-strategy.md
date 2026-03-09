# ADR-002: Serverless Rate Limiting Strategy

- **Status:** Accepted
- **Date:** 2026-03-07
- **Feature:** `3-rag-chatbot-backend`
- **Context:** The `/api/chat` endpoint is public (no authentication) and calls external paid-quota APIs (Google Gemini, Upstash Vector). A single visitor or bot sending hundreds of requests per minute could exhaust the free-tier daily quotas (Gemini: 1,500 req/day; Vector: 10,000 operations/day) for all other users. The deployment target is Vercel serverless — each function invocation is a stateless, isolated process, making in-memory solutions unreliable.

## Decision

**`@upstash/ratelimit` with Upstash Redis using a sliding window algorithm:**

- **Rate limit**: 20 requests per minute per IP address (FR-011)
- **Identification**: Client IP extracted from `x-forwarded-for` header (Vercel injects this)
- **Algorithm**: Sliding window — prevents burst abuse at window boundaries; fairer than fixed window
- **Backend**: Upstash Redis (same provider as Vector DB, free tier: 10,000 commands/day)
- **Package**: `@upstash/ratelimit` + `@upstash/redis`
- **Placement**: First check in the route handler — rate limit before any embedding or LLM call
- **Response on exceed**: HTTP 429 with `Retry-After` header and user-friendly message

## Consequences

### Positive

- **Serverless-safe**: Upstash Redis is an HTTP-based, serverless-native store — no persistent connection required, compatible with Vercel cold starts.
- **Accurate across instances**: Rate limit state is shared in Redis, not per-function-instance — enforces limits correctly even under concurrent invocations.
- **Protects free-tier quotas**: 20 req/min per IP prevents any single visitor from exhausting Gemini or Upstash Vector daily quotas.
- **Same provider ecosystem**: No new vendor; Upstash Redis uses the same console and billing as Upstash Vector.
- **Minimal code**: `@upstash/ratelimit` requires ~5 lines to configure and apply.
- **Standard HTTP response**: 429 with `Retry-After` is the correct RFC-compliant response that browser clients can handle gracefully.

### Negative

- **Additional Redis dependency**: Requires a second Upstash resource (Redis) alongside Vector. One more set of credentials to manage.
- **Redis commands consume quota**: Each rate limit check uses ~2 Redis commands. At 200 DAU × 10 messages = ~4,000 commands/day — well within the 10,000 free-tier limit, but worth monitoring.
- **IP-based only**: Shared IPs (e.g., university campus, NAT) could unfairly limit multiple distinct users. Not an issue at college-website scale but worth noting for future growth.

## Alternatives Considered

**Alternative A: In-memory Map per function instance**
- Pros: Zero dependencies, instant.
- Rejected: Stateless serverless functions reset memory on every cold start and run as multiple concurrent instances. Rate limit state is not shared — a user could hit 20 req/min on each of N instances simultaneously.

**Alternative B: Next.js Middleware with edge runtime**
- Pros: Runs before the route handler, could use edge-compatible stores.
- Rejected: Same statelessness problem without a backing store. Edge Middleware with Upstash Redis is functionally equivalent to the chosen approach but adds middleware file complexity.

**Alternative C: No rate limiting (rely on external service limits)**
- Pros: Zero implementation effort.
- Rejected: External services enforce limits globally (not per-user), so one abusive user could block all others. Violates FR-011 and SC-004.

**Alternative D: Fixed window algorithm**
- Pros: Simpler to reason about.
- Rejected: Allows burst of 40 requests at a window boundary (20 at end of window + 20 at start of next). Sliding window prevents this.

## References

- Feature Spec: `specs/3-rag-chatbot-backend/spec.md` — FR-011, SC-004
- Implementation Plan: `specs/3-rag-chatbot-backend/plan.md`
- Research: `specs/3-rag-chatbot-backend/research.md` — Decision 3
- API Contract: `specs/3-rag-chatbot-backend/contracts/api-contract.md` — 429 error response
- Related ADRs: ADR-001 (RAG Pipeline), ADR-003 (Conversation Context)
