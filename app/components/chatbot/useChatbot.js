'use client';

import { useReducer, useCallback } from 'react';

/**
 * Welcome message displayed when chat is first opened
 * Per spec FR-004a: Professional institutional greeting
 */
const WELCOME_MESSAGE = {
  id: 'welcome',
  content: 'Welcome to D.J. Sindh Government Science College. How can I assist you today?',
  sender: 'bot',
  timestamp: new Date().toISOString()
};

/**
 * Suggested questions per spec FR-005a
 * Balanced mix: programs, admissions, contact
 */
const SUGGESTED_QUESTIONS = [
  { id: 'q1', text: 'What programs do you offer?', category: 'programs' },
  { id: 'q2', text: 'What are the admission requirements?', category: 'admissions' },
  { id: 'q3', text: 'How can I contact the college?', category: 'contact' }
];

/**
 * Initial state for chatbot
 */
const initialState = {
  isOpen: false,
  messages: [],
  isTyping: false,
  isStreaming: false,
  inputValue: '',
  hasOpened: false
};

/**
 * Chatbot reducer action types
 */
const ActionTypes = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_TYPING: 'SET_TYPING',
  SET_INPUT: 'SET_INPUT',
  CLEAR_CONVERSATION: 'CLEAR_CONVERSATION',
  SET_STREAMING: 'SET_STREAMING',
  APPEND_TO_LAST_MESSAGE: 'APPEND_TO_LAST_MESSAGE'
};

/**
 * Chatbot reducer for state management
 * Handles all state transitions per data-model.md
 */
function chatbotReducer(state, action) {
  switch (action.type) {
    case ActionTypes.OPEN:
      return {
        ...state,
        isOpen: true,
        hasOpened: true,
        messages: state.messages.length === 0 ? [WELCOME_MESSAGE] : state.messages
      };
    case ActionTypes.CLOSE:
      return { ...state, isOpen: false };
    case ActionTypes.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case ActionTypes.SET_TYPING:
      return { ...state, isTyping: action.payload };
    case ActionTypes.SET_INPUT:
      return { ...state, inputValue: action.payload };
    case ActionTypes.CLEAR_CONVERSATION:
      return { ...state, messages: [], hasOpened: false };
    case ActionTypes.SET_STREAMING:
      return { ...state, isStreaming: action.payload };
    case ActionTypes.APPEND_TO_LAST_MESSAGE: {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (last && last.sender === 'bot') {
        msgs[msgs.length - 1] = { ...last, content: last.content + action.payload };
      }
      return { ...state, messages: msgs };
    }
    default:
      return state;
  }
}

/**
 * Validates message content before sending
 * @param {string} content - Message content to validate
 * @returns {{ valid: boolean, content?: string, error?: string }}
 */
function validateMessage(content) {
  const trimmed = content?.trim();

  if (!trimmed) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (trimmed.length > 2000) {
    return { valid: false, error: 'Message exceeds 2000 characters' };
  }

  return { valid: true, content: trimmed };
}

/**
 * Formats timestamp for display
 * @param {string} isoString - ISO 8601 timestamp
 * @returns {string} Formatted time (e.g., "10:30 AM")
 */
export function formatTimestamp(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * useChatbot custom hook
 * Manages all chatbot state and actions
 * @returns {Object} Chatbot state and actions
 */
export function useChatbot() {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);

  /**
   * Toggle chat window open/close
   */
  const toggle = useCallback(() => {
    dispatch({ type: state.isOpen ? ActionTypes.CLOSE : ActionTypes.OPEN });
  }, [state.isOpen]);

  /**
   * Close chat window
   */
  const close = useCallback(() => {
    dispatch({ type: ActionTypes.CLOSE });
  }, []);

  /**
   * Send a message and stream the bot response from /api/chat
   * Implements FR-001a (input disabled during stream), FR-003 (streaming),
   * FR-006 (error fallback), FR-007 (conversation history — last 6 turns).
   * @param {string} content - Message content to send
   */
  const sendMessage = useCallback(async (content) => {
    const validation = validateMessage(content);
    if (!validation.valid || state.isStreaming) return;

    // Add user message
    dispatch({
      type: ActionTypes.ADD_MESSAGE,
      payload: {
        id: crypto.randomUUID(),
        content: validation.content,
        sender: 'user',
        timestamp: new Date().toISOString()
      }
    });

    dispatch({ type: ActionTypes.SET_INPUT, payload: '' });
    dispatch({ type: ActionTypes.SET_TYPING, payload: true });
    dispatch({ type: ActionTypes.SET_STREAMING, payload: true });

    // T026: Build history from last 6 messages (FR-007: last 6 turns = 3 exchanges)
    // Exclude the static welcome message (id='welcome') — Gemini requires user-first turns
    const history = state.messages
      .filter(m => m.id !== 'welcome')
      .slice(-6)
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.content
      }));

    try {
      // T027: Pass history in fetch body
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: validation.content, history })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        dispatch({ type: ActionTypes.SET_TYPING, payload: false });
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          payload: {
            id: crypto.randomUUID(),
            content: errorData.error || 'Something went wrong. Please try again.',
            sender: 'bot',
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let isFirst = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        if (isFirst) {
          // First chunk: hide typing indicator, add initial bot message
          dispatch({ type: ActionTypes.SET_TYPING, payload: false });
          dispatch({
            type: ActionTypes.ADD_MESSAGE,
            payload: {
              id: crypto.randomUUID(),
              content: chunk,
              sender: 'bot',
              timestamp: new Date().toISOString()
            }
          });
          isFirst = false;
        } else {
          // Subsequent chunks: append to the last bot message
          dispatch({ type: ActionTypes.APPEND_TO_LAST_MESSAGE, payload: chunk });
        }
      }
    } catch {
      // FR-006: Friendly fallback on network or service failure
      dispatch({ type: ActionTypes.SET_TYPING, payload: false });
      dispatch({
        type: ActionTypes.ADD_MESSAGE,
        payload: {
          id: crypto.randomUUID(),
          content: 'Our assistant is temporarily unavailable. Please call 021-32622070 or use the contact form.',
          sender: 'bot',
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      dispatch({ type: ActionTypes.SET_STREAMING, payload: false });
    }
  }, [state.messages, state.isStreaming]);

  /**
   * Clear entire conversation
   */
  const clearConversation = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_CONVERSATION });
  }, []);

  /**
   * Update input value
   * @param {string} value - New input value
   */
  const setInput = useCallback((value) => {
    dispatch({ type: ActionTypes.SET_INPUT, payload: value });
  }, []);

  return {
    ...state,
    toggle,
    close,
    sendMessage,
    clearConversation,
    setInput,
    suggestedQuestions: SUGGESTED_QUESTIONS
  };
}
