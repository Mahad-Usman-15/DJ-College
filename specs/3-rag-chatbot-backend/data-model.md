# Data Model: RAG Chatbot Backend

**Feature**: `3-rag-chatbot-backend`
**Date**: 2026-03-07
**Phase**: 1 — Design

---

## Entities

### 1. KnowledgeChunk

A discrete unit of college information stored in the vector database.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g., `"department-chemistry"`, `"alumni-1"`) |
| `text` | `string` | Human-readable plain text representation of the entry (embedded) |
| `category` | `enum` | One of: `programs`, `admissions`, `facilities`, `alumni`, `events`, `contact`, `history`, `faq` |
| `source` | `string` | Origin data file (e.g., `"app/data/admission.js"`) |
| `metadata` | `object` | Arbitrary key-value pairs (e.g., `{ name: "Chemistry", type: "department" }`) |

**Constraints**:
- `text` must be under 2,048 tokens (Gemini embedding limit)
- `id` must be unique across all chunks
- `category` is used for optional filtered retrieval

**Source mapping** (data file → category):

| Data File | Category |
|---|---|
| `app/data/college-info.js` (identity, contact, history, FAQs) | `contact`, `history`, `admissions`, `faq` |
| `app/data/admission.js` (16 departments) | `programs` |
| `app/data/facilities.js` (9 facilities) | `facilities` |
| `app/data/alumni.js` (15 alumni) | `alumni` |
| `app/data/events.js` (3 events) | `events` |
| `app/data/home.js` (buildings, programs, aims) | `programs`, `facilities` |

**Estimated chunk count**: ~85–100 chunks total

---

### 2. ChatMessage

A single message in a conversation, held in browser memory only.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | UUID generated client-side (`crypto.randomUUID()`) |
| `content` | `string` | Message text |
| `sender` | `enum` | `"user"` or `"bot"` |
| `timestamp` | `string` | ISO 8601 (e.g., `"2026-03-07T10:30:00.000Z"`) |

**Constraints**:
- `content` for user messages: max 2,000 characters (validated in `useChatbot.js`)
- No server-side persistence — lives in React state only

---

### 3. ConversationSession

A single chat session maintained in browser memory.

| Field | Type | Description |
|---|---|---|
| `messages` | `ChatMessage[]` | Ordered list of all messages |
| `isOpen` | `boolean` | Whether chat window is visible |
| `isTyping` | `boolean` | Whether bot is currently generating |
| `inputValue` | `string` | Current text in the input field |
| `isStreaming` | `boolean` | Whether a stream is active (input disabled when true) |
| `hasOpened` | `boolean` | Whether chat has been opened at least once |

**State transitions**:
```
closed → open (toggle)
open → closed (toggle / close)
idle → streaming (sendMessage called)
streaming → idle (stream complete or error)
```

**Persistence**: Browser memory only. Cleared on page refresh or `clearConversation()`.

---

### 4. ChatAPIRequest

The payload sent from client to `/api/chat`.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `message` | `string` | Yes | 1–2000 characters |
| `history` | `HistoryTurn[]` | No | Max 6 turns (3 exchanges) |

**HistoryTurn**:

| Field | Type | Values |
|---|---|---|
| `role` | `string` | `"user"` or `"model"` |
| `content` | `string` | Prior message text |

---

### 5. ChatAPIResponse (Streaming)

The streamed response from `/api/chat`.

- **Success**: `ReadableStream` of UTF-8 text chunks (plain text, no delimiters)
- **Error**: JSON body `{ error: string, code: string }`

---

## State Transitions: useChatbot.js

```
sendMessage(content)
    │
    ├─ validate (empty / >2000 chars) → return early
    │
    ├─ ADD_MESSAGE (user)
    ├─ SET_INPUT('')
    ├─ SET_STREAMING(true)     ← input disabled, typing indicator shown
    ├─ SET_TYPING(true)
    │
    ├─ fetch POST /api/chat
    │       │
    │       ├─ stream starts
    │       │       ├─ SET_TYPING(false)
    │       │       ├─ ADD_MESSAGE (bot, empty)
    │       │       └─ APPEND_TO_LAST_MESSAGE (chunk by chunk)
    │       │
    │       ├─ stream ends
    │       │       └─ SET_STREAMING(false)   ← input re-enabled
    │       │
    │       └─ error
    │               ├─ ADD_MESSAGE (bot, error/fallback message)
    │               └─ SET_STREAMING(false)
    │
    └─ done
```

**New Action Type Required**: `APPEND_TO_LAST_MESSAGE`
- Appends a text chunk to the `content` of the last message in `state.messages`
- Used during streaming to build the bot response progressively

**New State Field Required**: `isStreaming: boolean`
- Distinct from `isTyping`: `isTyping` shows the "..." indicator before first chunk; `isStreaming` disables input for the full duration of the request

---

## Vector Index Schema (Upstash Vector)

| Property | Value |
|---|---|
| Dimensions | 768 (Google text-embedding-004) |
| Distance metric | Cosine similarity |
| Namespace | Default (single namespace) |
| Top-K retrieval | 5 most relevant chunks per query |

**Upserted record format**:
```json
{
  "id": "department-chemistry",
  "vector": [0.021, -0.134, ...],
  "metadata": {
    "text": "Department: Chemistry. Description: Master the science of matter...",
    "category": "programs",
    "source": "app/data/admission.js"
  }
}
```
