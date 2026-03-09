# Component Contracts: Chatbot Widget

**Date**: 2026-02-21 | **Feature**: Chatbot Widget UI

## Overview

This document defines the API contracts (props, events, interfaces) for all chatbot widget components. Since this is a frontend-only feature, contracts focus on component interfaces rather than backend APIs.

---

## Component Hierarchy

```
ChatbotWidget (Root/Container)
├── ChatbotTrigger
└── ChatbotWindow (conditional render)
    ├── ChatbotHeader
    ├── ChatbotMessages
    │   └── ChatbotMessageBubble (multiple)
    │       └── ChatbotTypingIndicator (conditional)
    ├── SuggestedQuestions
    └── ChatbotInput
```

---

## Component Contracts

### ChatbotTrigger

**Purpose**: Floating circular button that opens/closes the chat widget.

**Props**:
```javascript
{
  onClick: () => void,        // Trigger click handler
  isOpen: boolean,            // Current open state (for icon toggle)
  className?: string          // Optional additional CSS classes
}
```

**Events**:
- `onClick`: Fired when trigger is clicked

**UI States**:
- Default: Green circular button with chat icon
- Hover: Slightly darker green, scale transform
- Active: Pressed effect
- Focus: Visible focus ring (accessibility)

**Accessibility**:
- `aria-label`: "Open chat" or "Close chat" based on state
- `aria-expanded`: Matches isOpen state
- `tabIndex`: 0 (keyboard accessible)

---

### ChatbotWindow

**Purpose**: Main container for the chat interface.

**Props**:
```javascript
{
  isOpen: boolean,            // Controls visibility
  onClose: () => void,        // Close handler
  className?: string          // Optional additional CSS classes
}
```

**Events**:
- `onClose`: Fired when close button clicked or ESC pressed

**UI States**:
- Closed: Not rendered (or hidden with animation)
- Opening: Scale + fade animation (300ms)
- Open: Fully visible at fixed position
- Closing: Reverse animation

**Accessibility**:
- `role`: "dialog"
- `aria-modal`: true
- `aria-labelledby`: References header title
- Focus trap when open
- Close on ESC key

---

### ChatbotHeader

**Purpose**: Top bar with title, status, and action buttons.

**Props**:
```javascript
{
  title: string,              // Bot name (e.g., "DJ College Assistant")
  status: 'online' | 'typing' | 'offline',  // Status indicator
  onClose: () => void,        // Close handler
  onClear: () => void,        // Clear conversation handler
  className?: string          // Optional additional CSS classes
}
```

**Events**:
- `onClose`: Close button clicked
- `onClear`: Clear/reset button clicked

**UI Elements**:
- Title text (left)
- Status indicator dot + label (center)
- Clear button (optional, right)
- Close button (far right)

**Accessibility**:
- Status indicator has `aria-label`
- Buttons have `aria-label` attributes
- Clear button confirms before action (optional)

---

### ChatbotMessages

**Purpose**: Scrollable container for message history.

**Props**:
```javascript
{
  messages: Message[],        // Array of message objects
  isTyping: boolean,          // Show typing indicator
  className?: string          // Optional additional CSS classes
}
```

**Events**:
- None (presentational component)

**Behavior**:
- Auto-scroll to bottom on new message
- Smooth scroll animation
- Handle overflow with scrollbar
- Maintain scroll position on resize

**Accessibility**:
- `role`: "log"
- `aria-live`: "polite" (announces new messages)
- `aria-relevant`: "additions"
- Scrollable region has `tabIndex`: -1 (not directly focusable)

---

### ChatbotMessageBubble

**Purpose**: Individual message display component.

**Props**:
```javascript
{
  message: Message,           // Full message object
  className?: string          // Optional additional CSS classes
}
```

**Message Object**:
```javascript
{
  id: string,                 // Unique identifier
  content: string,            // Message text
  sender: 'user' | 'bot',     // Sender type
  timestamp: string           // ISO 8601 timestamp
}
```

**UI Variants**:
- User message: Right-aligned, emerald-50 background
- Bot message: Left-aligned, gray-50 background

**Accessibility**:
- `aria-label`: "Message from {sender} at {time}"
- Timestamp formatted for readability
- Markdown content sanitized before rendering

---

### ChatbotTypingIndicator

**Purpose**: Animated indicator showing bot is typing.

**Props**:
```javascript
{
  isVisible: boolean,         // Controls visibility
  className?: string          // Optional additional CSS classes
}
```

**Animation**:
- 3-dot pulse animation
- Continuous loop while visible
- Smooth fade in/out

**Accessibility**:
- `aria-live`: "polite"
- `aria-label`: "Bot is typing"
- Hidden from screen readers when not visible

---

### SuggestedQuestions

**Purpose**: Quick reply chips for common questions.

**Props**:
```javascript
{
  questions: SuggestedQuestion[],  // Array of question objects
  onSelect: (question: SuggestedQuestion) => void,  // Selection handler
  className?: string          // Optional additional CSS classes
}
```

**SuggestedQuestion Object**:
```javascript
{
  id: string,                 // Unique identifier
  text: string,               // Display text
  category: 'programs' | 'admissions' | 'contact'
}
```

**Events**:
- `onSelect`: Fired when a question chip is clicked

**UI States**:
- Default: Green outline variant
- Hover: Filled background
- Focus: Visible focus ring
- Active: Pressed effect

**Accessibility**:
- Each chip is a `<button>` element
- `aria-label`: Question text
- Keyboard navigable (Tab through chips)

---

### ChatbotInput

**Purpose**: Text input area with send button.

**Props**:
```javascript
{
  value: string,              // Current input value
  onChange: (value: string) => void,  // Change handler
  onSend: () => void,         // Send handler
  isDisabled: boolean,        // Disabled state
  className?: string          // Optional additional CSS classes
}
```

**Events**:
- `onChange`: Input value changes
- `onSend`: Send button clicked OR Enter pressed
- `onKeyDown`: For handling Enter/ESC keys

**Behavior**:
- Auto-resize textarea (1-5 rows)
- Send button disabled when empty
- Enter sends, Shift+Enter creates newline
- Clear input after send

**Accessibility**:
- `aria-label`: "Type your message"
- `aria-disabled`: Matches isDisabled state
- Send button has `aria-label`: "Send message"
- Focus ring visible on input and button

---

## Event Flow Diagrams

### Open Chat Flow

```
User clicks trigger
    ↓
ChatbotTrigger.onClick()
    ↓
Parent component sets isOpen: true
    ↓
ChatbotWindow renders with animation
    ↓
ChatbotHeader displays title + status
ChatbotMessages shows welcome message
SuggestedQuestions displays chips
ChatbotInput focuses (auto-focus optional)
```

### Send Message Flow

```
User types in ChatbotInput
    ↓
onChange updates parent state
    ↓
User clicks Send OR presses Enter
    ↓
onSend called
    ↓
Validate input (not empty, < 2000 chars)
    ↓
Create message object with UUID + timestamp
    ↓
Dispatch ADD_MESSAGE action
    ↓
Set isTyping: true
    ↓
(typing delay simulation - future: API call)
    ↓
Create bot response message
    ↓
Dispatch ADD_MESSAGE action
    ↓
Set isTyping: false
    ↓
Auto-scroll to bottom
```

### Close Chat Flow

```
User clicks close button OR presses ESC
    ↓
ChatbotHeader.onClose() or keydown event
    ↓
onClose called
    ↓
Parent component sets isOpen: false
    ↓
ChatbotWindow animates closed
    ↓
Focus returns to ChatbotTrigger (accessibility)
```

---

## State Management Contract

### Reducer Actions

```javascript
// Action Types
const ChatbotActionTypes = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_TYPING: 'SET_TYPING',
  SET_INPUT: 'SET_INPUT',
  CLEAR_CONVERSATION: 'CLEAR_CONVERSATION'
};

// Action Creators
const openChat = () => ({ type: 'OPEN' });
const closeChat = () => ({ type: 'CLOSE' });
const addMessage = (message) => ({ type: 'ADD_MESSAGE', payload: message });
const setTyping = (isTyping) => ({ type: 'SET_TYPING', payload: isTyping });
const setInput = (value) => ({ type: 'SET_INPUT', payload: value });
const clearConversation = () => ({ type: 'CLEAR_CONVERSATION' });
```

### Dispatch Usage in Components

```javascript
// Example: ChatbotInput component
const handleSend = () => {
  const validation = validateMessage(inputValue);
  if (!validation.valid) return;
  
  dispatch(addMessage({
    id: crypto.randomUUID(),
    content: validation.content,
    sender: 'user',
    timestamp: new Date().toISOString()
  }));
  
  dispatch(setTyping(true));
  dispatch(setInput(''));
  
  // Simulate bot response (replace with actual logic later)
  setTimeout(() => {
    dispatch(addMessage({
      id: crypto.randomUUID(),
      content: "Thank you for your message. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }));
    dispatch(setTyping(false));
  }, 1500);
};
```

---

## Error Handling

### Input Validation Errors

```javascript
const ValidationError = {
  EMPTY: 'Message cannot be empty',
  TOO_LONG: 'Message exceeds 2000 characters',
  INVALID_CHARS: 'Message contains invalid characters'
};
```

### Component Error Boundaries

- Wrap ChatbotWindow in ErrorBoundary component
- Display fallback UI on error
- Log errors to console (future: error tracking service)

---

## Performance Considerations

### Memoization Strategy

```javascript
// Memoize message list to prevent unnecessary re-renders
const ChatbotMessages = React.memo(({ messages, isTyping }) => {
  // component implementation
});

// Memoize individual message bubbles
const ChatbotMessageBubble = React.memo(({ message }) => {
  // component implementation
});

// Use useCallback for event handlers
const handleSend = useCallback(() => {
  // handler implementation
}, [inputValue, dispatch]);
```

### Scroll Optimization

- Use CSS `scroll-behavior: smooth` for native performance
- Limit scroll triggers to new message events only
- Consider `IntersectionObserver` for very long conversations (future)

---

## Testing Contracts

### Unit Test Requirements

Each component must have tests for:

1. **Rendering**: Component renders with required props
2. **Interaction**: Click/type events fire correct handlers
3. **Accessibility**: ARIA attributes present and correct
4. **Edge Cases**: Empty states, disabled states, long content

### Integration Test Requirements

1. Open → Send message → Receive response → Close flow
2. Keyboard navigation (Tab, Enter, ESC)
3. Screen reader compatibility
4. Mobile responsive behavior

---

## Future API Integration Points

These contracts are designed to easily integrate with backend APIs in future phases:

### Potential API Endpoints (Future)

```javascript
// POST /api/chatbot/message
// Request: { message: string, sessionId: string }
// Response: { response: string, conversationId: string }

// GET /api/chatbot/suggestions
// Response: { questions: SuggestedQuestion[] }

// POST /api/chatbot/transcript
// Request: { conversationId: string }
// Response: { transcript: string }
```

### Adapter Pattern for Future Integration

```javascript
// Create service layer for easy API swap
const chatbotService = {
  sendMessage: async (message) => {
    // Currently: returns mock response
    // Future: POST to API
  },
  getSuggestions: async () => {
    // Currently: returns static array
    // Future: GET from API
  }
};
```
