# Quickstart: RAG Chatbot Backend

**Feature**: `3-rag-chatbot-backend`
**Date**: 2026-03-07

Get the RAG chatbot running locally in under 10 minutes.

---

## Prerequisites

- Node.js 18+
- npm
- Google AI Studio account (free)
- Upstash account (free)

---

## Step 1: Get API Keys

### Google Gemini (LLM + Embeddings)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → Create API key
3. Copy the key

### Upstash Vector (Vector Database)
1. Go to [console.upstash.com](https://console.upstash.com)
2. Create a new **Vector** index:
   - Dimensions: `768`
   - Distance metric: `Cosine`
3. Copy **REST URL** and **REST Token**

### Upstash Redis (Rate Limiting)
1. In the same Upstash console, create a new **Redis** database
2. Copy **REST URL** and **REST Token**

---

## Step 2: Configure Environment

Create `.env.local` in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

UPSTASH_VECTOR_REST_URL=https://your-vector-url.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_vector_token_here

UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

---

## Step 3: Install Dependencies

```bash
npm install @google/generative-ai @upstash/vector @upstash/ratelimit @upstash/redis
```

---

## Step 4: Ingest the Knowledge Base

Run the ingestion script **once** to embed all college data into Upstash Vector:

```bash
node scripts/ingest.js
```

Expected output:
```
Ingesting knowledge base...
✓ college-info.js  — 12 chunks
✓ admission.js     — 16 chunks
✓ facilities.js    —  9 chunks
✓ alumni.js        — 15 chunks
✓ events.js        —  3 chunks
✓ home.js          — 10 chunks
────────────────────────────────
Total: 65 chunks ingested
Done.
```

> Re-run this script whenever you update any file in `app/data/`.

---

## Step 5: Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click the chatbot widget in the bottom-right corner.

---

## Step 6: Test the Chatbot

Try these questions:
- "What programs does DJ College offer?"
- "How do I apply for admission?"
- "Tell me about Abdul Qadeer Khan"
- "What are the college facilities?"
- "Who is the Prime Minister?" ← should be declined gracefully

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Error: GOOGLE_GENERATIVE_AI_API_KEY not set` | Check `.env.local` has the correct key |
| `Error: Upstash vector fetch failed` | Verify `UPSTASH_VECTOR_REST_URL` and token are correct |
| Chatbot returns empty responses | Re-run `node scripts/ingest.js` to populate the vector DB |
| Rate limit errors during testing | Wait 1 minute, or increase limit temporarily in `app/api/chat/route.js` |
| `crypto is not defined` in ingest script | Use Node.js 18+ (`node --version` to check) |

---

## Deployment (Vercel)

1. Push to your repository
2. In Vercel project settings, add all 5 environment variables from Step 2
3. Deploy
4. Run `node scripts/ingest.js` once locally (or from any machine with the env vars) to populate production Upstash Vector

> The ingest script targets Upstash Vector directly via REST — it works from any machine with the env vars set.
