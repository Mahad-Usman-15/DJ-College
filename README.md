# DJ Sindh Government Science College — Official Website

## Overview

The official website for **D.J. Sindh Government Science College** (DJ Science College), a public college founded in 1887 and affiliated with the University of Karachi. Located at Dr. Ziauddin Ahmed Road, Pakistan Chowk, Saddar Town, Karachi, Sindh, Pakistan.

Built with Next.js 15, the site features a fully responsive design, smooth animations, and an AI-powered RAG chatbot that answers questions about the college.

---

## Features

- Responsive layout (mobile, tablet, desktop)
- Scroll-triggered animations via Framer Motion
- Functional contact form with email integration (Resend)
- AI-powered RAG chatbot (Gemini 1.5 Flash + Upstash Vector)
- Academic programs, facilities, alumni, events, and admission pages
- SEO-optimized with Open Graph, Twitter Cards, and sitemap

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5.12 (App Router) |
| Language | JavaScript / JSX |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React, React Icons |
| Email | Resend |
| Chatbot LLM | Google Gemini 2.5 Flash |
| Chatbot Embeddings | Google text-embedding-004 |
| Vector Database | Upstash Vector |
| Rate Limiting | Upstash Redis + @upstash/ratelimit |
| Fonts | Geist (Google Fonts) |

---

## Project Structure

```
dj-college/
├── app/
│   ├── api/
│   │   ├── chat/             # RAG chatbot API route
│   │   └── contact/          # Contact form email route
│   ├── components/
│   │   ├── chatbot/          # Chatbot UI components (11 files)
│   │   ├── header/           # Navbar
│   │   └── footer/           # Footer
│   ├── data/                 # Structured knowledge base (RAG sources)
│   │   ├── college-info.js   # Identity, history, contact, admissions, FAQs
│   │   ├── admission.js      # 16 departments with descriptions
│   │   ├── facilities.js     # 9 facilities with detailed descriptions
│   │   ├── alumni.js         # 15 distinguished alumni
│   │   ├── events.js         # College events
│   │   └── home.js           # Buildings, academic programs, aims
│   ├── admission/            # Admission page
│   ├── alumni/               # Alumni page
│   ├── contact/              # Contact page
│   ├── events/               # Events page
│   ├── facilities/           # Facilities page
│   ├── globals.css
│   ├── layout.js
│   ├── loading.jsx
│   ├── not-found.jsx
│   └── page.js               # Homepage
├── scripts/
│   └── ingest.js             # One-time RAG ingestion script
├── images/                   # Static image assets
├── specs/                    # Feature specs and plans
├── history/                  # Prompt History Records and ADRs
├── next.config.mjs
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repository-url>
cd dj-college
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Resend (contact form)
RESEND_API_KEY=your_resend_api_key

# Google AI Studio (chatbot LLM + embeddings) — get from https://aistudio.google.com
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Upstash Vector (chatbot vector database) — dimensions: 768, metric: Cosine
UPSTASH_VECTOR_REST_URL=your_upstash_vector_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_vector_token

# Upstash Redis (rate limiting) — any Upstash Redis database
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Ingest Knowledge Base (RAG)

Run once after setting up environment variables to embed and store all college data:

```bash
node scripts/ingest.js
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `node scripts/ingest.js` | Ingest knowledge base into Upstash Vector |

---

## Pages and Routes

| Route | Description |
|---|---|
| `/` | Home — welcome, facilities overview, programs, aims |
| `/admission` | Admission info and all 16 departments |
| `/alumni` | 15 distinguished alumni showcase |
| `/facilities` | 9 college facilities with descriptions |
| `/events` | College events (PTM, National Games, Fire Drill) |
| `/contact` | Contact form and location |

---

## RAG Chatbot Architecture

```
User message
    ↓
Rate limit check  →  Upstash Redis (20 req/min/IP)
    ↓
Next.js API Route  /api/chat
    ↓
Embed query  →  Google text-embedding-004 (RETRIEVAL_QUERY)
    ↓
Vector search  →  Upstash Vector (top-5 relevant chunks)
    ↓
Build prompt  →  SYSTEM_PROMPT + context + conversation history
    ↓
LLM response  →  Google Gemini 1.5 Flash (streaming)
    ↓
ReadableStream  →  Chat UI (word-by-word)
```

**Knowledge base sources** (`app/data/`):
- `college-info.js` — identity, history, contact, admissions, FAQs
- `admission.js` — 16 departments
- `facilities.js` — 9 facilities
- `alumni.js` — 15 alumni
- `events.js` — college events
- `home.js` — buildings, programs, aims

---

## Free Tier Limits

All external services operate within free-tier quotas at typical college website traffic:

| Service | Free Tier Limit | Expected Usage (200 DAU, ~5 msg/session) |
|---|---|---|
| Google Gemini 1.5 Flash | 1,500 req/day | ~1,000 (500 embed + 500 generate) |
| Google text-embedding-004 | 1,500 req/day | ~500 (query embeddings only at runtime) |
| Upstash Vector | 10,000 vectors | ~71 (knowledge base chunks) |
| Upstash Redis | 10,000 cmd/day | ~2,000 (2 commands per rate-limit check) |

Re-ingestion (adding vectors) only happens when data files change — run `node scripts/ingest.js` manually after any `app/data/` file update.

---

## Contact Information

- **Address**: Dr. Ziauddin Ahmed Road, Pakistan Chowk, Saddar Town, Karachi, Pakistan
- **Phone**: 021-32622070 / 0300-8885650
- **Website**: [www.djedu.pk](https://www.djedu.pk)
- **Admissions Portal**: [seccap.dgcs.gos.pk](https://seccap.dgcs.gos.pk)
- **Facebook**: [facebook.com/djcollegeofficial](https://www.facebook.com/djcollegeofficial/)

---

## License

Proprietary — D.J. Sindh Government Science College. Not licensed for public distribution.
