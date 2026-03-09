# Quickstart Guide: Chatbot Widget Implementation

**Date**: 2026-02-21 | **Feature**: Chatbot Widget UI

## Overview

This guide provides step-by-step instructions for implementing the green-themed chatbot widget. Follow these steps in order to build the feature according to the specification.

---

## Prerequisites

Ensure you have the following before starting:

- ✅ Node.js installed (version compatible with Next.js 15.5.12)
- ✅ Existing DJ College Next.js project set up
- ✅ Tailwind CSS configured
- ✅ Framer Motion installed (`npm install framer-motion`)
- ✅ Lucide React installed (`npm install lucide-react`)

---

## Step 1: Create Component Directory Structure

```bash
# Navigate to project root
cd dj-college

# Create chatbot components directory
mkdir app\components\chatbot
```

Create the following files in `app/components/chatbot/`:

```
app/components/chatbot/
├── ChatbotTrigger.jsx
├── ChatbotWindow.jsx
├── ChatbotHeader.jsx
├── ChatbotMessages.jsx
├── ChatbotMessageBubble.jsx
├── ChatbotTypingIndicator.jsx
├── SuggestedQuestions.jsx
├── ChatbotInput.jsx
├── ChatbotWidget.jsx (main container)
├── useChatbot.js (custom hook)
└── index.js (exports)
```

---

## Step 2: Define Color Tokens (globals.css)

Add these CSS variables to `app/globals.css` if not already present:

```css
:root {
  /* Emerald Palette - Chatbot Widget */
  --chatbot-primary: #059669;        /* emerald-600 */
  --chatbot-primary-hover: #047857;  /* emerald-700 */
  --chatbot-primary-light: #ecfdf5;  /* emerald-50 */
  --chatbot-outline: #6ee7b7;        /* emerald-300 */
  
  /* Neutral Colors */
  --chatbot-bg: #ffffff;
  --chatbot-border: #e5e7eb;
  --chatbot-text: #111827;
  --chatbot-text-secondary: #6b7280;
}
```

---

## Step 3: Implement Components (In Order)

### 3.1 ChatbotTrigger.jsx

```javascript
'use client';

import { MessageCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatbotTrigger({ onClick, isOpen }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      aria-expanded={isOpen}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
    </motion.button>
  );
}
```

### 3.2 useChatbot.js (State Management Hook)

```javascript
'use client';

import { useReducer, useCallback } from 'react';

const WELCOME_MESSAGE = {
  id: 'welcome',
  content: 'Welcome to D.J. Sindh Government Science College. How can I assist you today?',
  sender: 'bot',
  timestamp: new Date().toISOString()
};

const SUGGESTED_QUESTIONS = [
  { id: 'q1', text: 'What programs do you offer?', category: 'programs' },
  { id: 'q2', text: 'What are the admission requirements?', category: 'admissions' },
  { id: 'q3', text: 'How can I contact the college?', category: 'contact' }
];

const initialState = {
  isOpen: false,
  messages: [],
  isTyping: false,
  inputValue: '',
  hasOpened: false
};

function chatbotReducer(state, action) {
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
}

export function useChatbot() {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);

  const toggle = useCallback(() => {
    dispatch({ type: state.isOpen ? 'CLOSE' : 'OPEN' });
  }, [state.isOpen]);

  const sendMessage = useCallback((content) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    // Add user message
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: crypto.randomUUID(),
        content: trimmed,
        sender: 'user',
        timestamp: new Date().toISOString()
      }
    });

    // Simulate bot typing
    dispatch({ type: 'SET_TYPING', payload: true });

    // Simulate bot response (replace with actual logic later)
    setTimeout(() => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: crypto.randomUUID(),
          content: 'Thank you for your message. Our team will get back to you soon.',
          sender: 'bot',
          timestamp: new Date().toISOString()
        }
      });
      dispatch({ type: 'SET_TYPING', payload: false });
    }, 1500);
  }, []);

  const clearConversation = useCallback(() => {
    dispatch({ type: 'CLEAR_CONVERSATION' });
  }, []);

  return {
    ...state,
    toggle,
    sendMessage,
    clearConversation,
    suggestedQuestions: SUGGESTED_QUESTIONS
  };
}
```

### 3.3 ChatbotWindow.jsx

```javascript
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function ChatbotWindow({ isOpen, onClose, children }) {
  const containerRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Focus trap (simplified)
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          className="fixed bottom-20 right-5 z-50 w-[380px] max-w-[calc(100vw-2.5rem)] rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden md:max-w-[420px]"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 3.4 ChatbotHeader.jsx

```javascript
'use client';

import { X, Trash2 } from 'lucide-react';

export default function ChatbotHeader({ onClose, onClear, status = 'online' }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-emerald-600 px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <div>
          <h2 id="chatbot-title" className="font-semibold text-base">
            DJ College Assistant
          </h2>
          <div className="flex items-center gap-1.5">
            <span className={`inline-block h-2 w-2 rounded-full ${
              status === 'typing' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
            }`} />
            <span className="text-xs text-emerald-100">
              {status === 'typing' ? 'Typing...' : 'Online'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="rounded p-1.5 text-emerald-100 hover:bg-emerald-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Clear conversation"
          title="Clear conversation"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          onClick={onClose}
          className="rounded p-1.5 text-emerald-100 hover:bg-emerald-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
```

### 3.5 ChatbotMessages.jsx

```javascript
'use client';

import { useEffect, useRef } from 'react';
import ChatbotMessageBubble from './ChatbotMessageBubble';
import ChatbotTypingIndicator from './ChatbotTypingIndicator';

export default function ChatbotMessages({ messages, isTyping }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div
      className="flex max-h-[400px] flex-col gap-3 overflow-y-auto p-4"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {messages.map((message) => (
        <ChatbotMessageBubble key={message.id} message={message} />
      ))}
      
      {isTyping && <ChatbotTypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
```

### 3.6 ChatbotMessageBubble.jsx

```javascript
'use client';

export default function ChatbotMessageBubble({ message }) {
  const isUser = message.sender === 'user';
  
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      aria-label={`Message from ${isUser ? 'you' : 'DJ College Assistant'} at ${formatTime(message.timestamp)}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? 'bg-emerald-50 text-gray-900 rounded-br-sm'
            : 'bg-gray-50 text-gray-900 rounded-bl-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <span className={`mt-1 block text-xs ${
          isUser ? 'text-emerald-700' : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
```

### 3.7 ChatbotTypingIndicator.jsx

```javascript
'use client';

import { motion } from 'framer-motion';

export default function ChatbotTypingIndicator({ isVisible = true }) {
  if (!isVisible) return null;

  return (
    <div
      className="flex justify-start"
      aria-live="polite"
      aria-label="Bot is typing"
    >
      <div className="rounded-2xl bg-gray-50 px-4 py-3 rounded-bl-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-2 w-2 rounded-full bg-gray-400"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: dot * 0.15
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 3.8 SuggestedQuestions.jsx

```javascript
'use client';

export default function SuggestedQuestions({ questions, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3">
      {questions.map((question) => (
        <button
          key={question.id}
          onClick={() => onSelect(question)}
          className="rounded-full border border-emerald-300 px-3 py-1.5 text-sm text-emerald-700 transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          aria-label={`Ask: ${question.text}`}
        >
          {question.text}
        </button>
      ))}
    </div>
  );
}
```

### 3.9 ChatbotInput.jsx

```javascript
'use client';

import { Send } from 'lucide-react';
import { useState, useCallback } from 'react';

export default function ChatbotInput({ onSend, isDisabled = false }) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    
    onSend(trimmed);
    setValue('');
  }, [value, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isDisabled}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-100"
          aria-label="Type your message"
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isDisabled}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
```

### 3.10 ChatbotWidget.jsx (Main Container)

```javascript
'use client';

import ChatbotTrigger from './ChatbotTrigger';
import ChatbotWindow from './ChatbotWindow';
import ChatbotHeader from './ChatbotHeader';
import ChatbotMessages from './ChatbotMessages';
import SuggestedQuestions from './SuggestedQuestions';
import ChatbotInput from './ChatbotInput';
import { useChatbot } from './useChatbot';

export default function ChatbotWidget() {
  const {
    isOpen,
    messages,
    isTyping,
    toggle,
    sendMessage,
    clearConversation,
    suggestedQuestions
  } = useChatbot();

  const handleQuestionSelect = (question) => {
    sendMessage(question.text);
  };

  const showWelcome = messages.length === 1 && messages[0].id === 'welcome';

  return (
    <>
      <ChatbotTrigger onClick={toggle} isOpen={isOpen} />
      
      <ChatbotWindow isOpen={isOpen} onClose={toggle}>
        <ChatbotHeader
          onClose={toggle}
          onClear={clearConversation}
          status={isTyping ? 'typing' : 'online'}
        />
        
        <ChatbotMessages messages={messages} isTyping={isTyping} />
        
        {showWelcome && (
          <SuggestedQuestions
            questions={suggestedQuestions}
            onSelect={handleQuestionSelect}
          />
        )}
        
        <ChatbotInput onSend={sendMessage} />
      </ChatbotWindow>
    </>
  );
}
```

### 3.11 index.js (Barrel Exports)

```javascript
export { default as ChatbotWidget } from './ChatbotWidget';
export { default as ChatbotTrigger } from './ChatbotTrigger';
export { default as ChatbotWindow } from './ChatbotWindow';
export { default as ChatbotHeader } from './ChatbotHeader';
export { default as ChatbotMessages } from './ChatbotMessages';
export { default as ChatbotMessageBubble } from './ChatbotMessageBubble';
export { default as ChatbotTypingIndicator } from './ChatbotTypingIndicator';
export { default as SuggestedQuestions } from './SuggestedQuestions';
export { default as ChatbotInput } from './ChatbotInput';
export { useChatbot } from './useChatbot';
```

---

## Step 4: Integrate into Root Layout

Add the chatbot widget to `app/layout.js`:

```javascript
import { ChatbotWidget } from '@/app/components/chatbot';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}
```

---

## Step 5: Add Mobile Responsive Styles

Update `app/globals.css` to include mobile-specific styles:

```css
/* Chatbot Mobile Responsive */
@media (max-width: 767px) {
  [role="dialog"][aria-labelledby="chatbot-title"] {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    height: 100vh !important;
    max-height: 100vh !important;
    border-radius: 0 !important;
  }
  
  [role="dialog"][aria-labelledby="chatbot-title"] [class*="max-h-"] {
    max-height: calc(100vh - 200px) !important;
  }
}
```

---

## Step 6: Test the Implementation

### Manual Testing Checklist

- [ ] Trigger button visible in bottom-right corner
- [ ] Trigger button fixed position (stays when scrolling)
- [ ] Click trigger opens chat with animation
- [ ] Welcome message displays on first open
- [ ] Suggested questions chips appear and are clickable
- [ ] Clicking suggested question sends message
- [ ] Typing in input enables send button
- [ ] Send button disabled when input empty
- [ ] Enter sends message, Shift+Enter creates newline
- [ ] Messages appear with correct styling (user right, bot left)
- [ ] Timestamps display correctly
- [ ] Typing indicator shows after sending
- [ ] Auto-scroll to newest message works
- [ ] Close button closes chat
- [ ] ESC key closes chat
- [ ] Clear conversation button works
- [ ] Mobile: Full-screen mode activates
- [ ] Focus rings visible on keyboard navigation
- [ ] Color contrast meets WCAG AA

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and test the chatbot widget.

---

## Step 7: Run Linting

```bash
npm run lint
```

Fix any ESLint errors or warnings.

---

## Troubleshooting

### Issue: Trigger button not visible
- Check z-index conflicts with other elements
- Verify Tailwind CSS is processing the component file

### Issue: Animations not smooth
- Ensure Framer Motion is properly installed
- Check browser DevTools for performance warnings

### Issue: Mobile styles not applying
- Verify media query syntax in globals.css
- Test with actual mobile device or DevTools device emulation

### Issue: Focus trap not working
- Review focusable element selectors in ChatbotWindow
- Consider using a focus trap library for production

---

## Next Steps

After completing implementation:

1. Write unit tests with Jest + React Testing Library
2. Add integration tests for full conversation flow
3. Consider adding session persistence (optional)
4. Plan backend integration for actual bot responses
5. Add analytics tracking (if needed)

---

## References

- [Feature Specification](./spec.md)
- [Data Model](./data-model.md)
- [Component Contracts](./contracts/component-contracts.md)
- [Research Document](./research.md)
