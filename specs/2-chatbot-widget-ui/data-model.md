# Data Model: Chatbot Widget

**Date**: 2026-02-21 | **Feature**: Chatbot Widget UI

## Overview

This document defines the data structures and state management for the chatbot widget. Since this is a frontend-only feature, the data model focuses on component state and in-memory data structures.

---

## Core Entities

### Message

A single unit of communication within the chatbot conversation.

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (crypto.randomUUID()) |
| `content` | string | Yes | Message text content (supports markdown) |
| `sender` | 'user' \| 'bot' | Yes | Sender type identifier |
| `timestamp` | string | Yes | ISO 8601 formatted timestamp |
| `status` | 'sent' \| 'delivered' \| 'read' | No | Message delivery status (optional, for future use) |

**Example**:
```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  content: "What programs do you offer?",
  sender: "user",
  timestamp: "2026-02-21T10:30:00.000Z"
}
```

**Validation Rules**:
- `id`: Must be unique within conversation session
- `content`: 1-2000 characters, trimmed whitespace
- `sender`: Must be exactly 'user' or 'bot'
- `timestamp`: Valid ISO 8601 format

---

### ChatbotState

Represents the complete state of the chatbot widget.

**Fields**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `isOpen` | boolean | false | Whether chat window is open |
| `messages` | Message[] | [] | Array of conversation messages |
| `isTyping` | boolean | false | Whether bot is currently "typing" |
| `inputValue` | string | '' | Current text in input field |
| `hasOpened` | boolean | false | Whether user has opened chat at least once |

**State Transitions**:
```
Initial State:
  isOpen: false
  messages: []
  isTyping: false
  inputValue: ''
  hasOpened: false

→ User clicks trigger:
  isOpen: true
  hasOpened: true (if first time)
  messages: [welcomeMessage] (if first time)

→ User types:
  inputValue: "user input"

→ User sends:
  messages: [...messages, newUserMessage]
  inputValue: ''
  isTyping: true

→ Bot responds:
  messages: [...messages, newBotMessage]
  isTyping: false
```

---

### SuggestedQuestion

Predefined question chips displayed in welcome state.

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `text` | string | Yes | Display text for the chip |
| `category` | 'programs' \| 'admissions' \| 'contact' | Yes | Question category |

**Default Questions** (from spec FR-005a):
```javascript
[
  { id: "q1", text: "What programs do you offer?", category: "programs" },
  { id: "q2", text: "What are the admission requirements?", category: "admissions" },
  { id: "q3", text: "How can I contact the college?", category: "contact" }
]
```

---

## Component State Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ChatbotWidget (Root)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ isOpen: boolean                                       │  │
│  │ messages: Message[]                                   │  │
│  │ isTyping: boolean                                     │  │
│  │ hasOpened: boolean                                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│         ┌────────────────┼────────────────┐                 │
│         ▼                ▼                ▼                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Trigger   │  │   Window    │  │   Header    │         │
│  │  (closed)   │  │   (open)    │  │  (title,    │         │
│  │             │  │             │  │   close)    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                          │                                   │
│         ┌────────────────┼────────────────┐                 │
│         ▼                ▼                ▼                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Messages   │  │    Input    │  │  Suggested  │         │
│  │  (scroll)   │  │  (textarea) │  │  Questions  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## State Management Strategy

### Primary Approach: useReducer

Use `useReducer` for complex state transitions to ensure predictable state updates.

```javascript
const chatbotReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN':
      return { 
        ...state, 
        isOpen: true, 
        hasOpened: true,
        messages: state.messages.length === 0 ? [WELCOME_MESSAGE] : state.messages
      };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    case 'SET_INPUT':
      return { ...state, inputValue: action.payload };
    case 'CLEAR_CONVERSATION':
      return { ...state, messages: [], hasOpened: false };
    default:
      return state;
  }
};
```

### Component-Level State: useState

Use `useState` for simple, isolated component state:
- Input field value (can be lifted to reducer if needed)
- Hover states
- Focus states

---

## Data Flow

### Message Flow

```
User Action          State Change           UI Update
────────────         ─────────────          ───────────
Click trigger   →    isOpen: true      →   Window renders
Type message    →    inputValue: "..." →   Input updates
Click send      →    ADD_MESSAGE       →   Message bubble appears
                     isTyping: true    →   Typing indicator shows
Bot response    →    ADD_MESSAGE       →   Bot message appears
                     isTyping: false   →   Typing indicator hides
New message     →    (auto-scroll)     →   Scroll to bottom
```

---

## Validation Rules

### Message Content Validation
```javascript
const validateMessage = (content) => {
  const trimmed = content.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (trimmed.length > 2000) {
    return { valid: false, error: 'Message exceeds 2000 characters' };
  }
  
  return { valid: true, content: trimmed };
};
```

### Timestamp Formatting
```javascript
const formatTimestamp = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};
```

---

## Type Definitions (JSDoc)

```javascript
/**
 * @typedef {Object} Message
 * @property {string} id - Unique identifier
 * @property {string} content - Message text
 * @property {'user' | 'bot'} sender - Sender type
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {'sent' | 'delivered' | 'read'} [status] - Delivery status
 */

/**
 * @typedef {Object} SuggestedQuestion
 * @property {string} id - Unique identifier
 * @property {string} text - Display text
 * @property {'programs' | 'admissions' | 'contact'} category - Question category
 */

/**
 * @typedef {Object} ChatbotState
 * @property {boolean} isOpen - Window open state
 * @property {Message[]} messages - Conversation messages
 * @property {boolean} isTyping - Bot typing indicator
 * @property {string} inputValue - Current input value
 * @property {boolean} hasOpened - Whether opened at least once
 */
```

---

## Edge Cases Handling

### 1. Empty Message Prevention
- Validate before adding to state
- Disable send button when input is empty

### 2. Long Message Handling
- CSS text wrapping with `break-words`
- Visual character counter (optional enhancement)

### 3. Rapid Message Sending
- Queue messages in order
- Prevent duplicate sends with debouncing

### 4. Scroll Performance
- Use `scrollIntoView({ behavior: 'smooth' })`
- Limit re-renders with `React.memo` on message components

### 5. State Persistence (Optional)
- Session-based persistence using `sessionStorage`
- Clear on page refresh (no localStorage per spec)

---

## Future Extensions (Out of Scope)

These are noted for potential future phases but are NOT part of current implementation:

- Message reactions (emoji responses)
- Message editing/deletion
- File attachments
- Voice messages
- Multi-language support
- Conversation export/transcript
- Analytics tracking
