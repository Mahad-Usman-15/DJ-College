'use client';

import { useEffect, useRef, memo } from 'react';
import ChatbotMessageBubble from './ChatbotMessageBubble';
import ChatbotTypingIndicator from './ChatbotTypingIndicator';

/**
 * ChatbotMessages Component
 * Scrollable container for message history
 * Per spec FR-006, FR-012: Scrollable area with auto-scroll to newest
 * Memoized to prevent unnecessary re-renders (US4 - T029)
 * 
 * @param {Object} props
 * @param {Array<{id: string, content: string, sender: 'user' | 'bot', timestamp: string}>} props.messages - Array of message objects
 * @param {boolean} props.isTyping - Show typing indicator
 * @param {string} [props.className] - Optional additional CSS classes
 */
function ChatbotMessages({ messages, isTyping, className = '' }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div
      className={`flex max-h-[400px] flex-col gap-3 overflow-y-auto p-4 ${className}`}
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

// Memoize to prevent unnecessary re-renders (T029)
export default memo(ChatbotMessages);
