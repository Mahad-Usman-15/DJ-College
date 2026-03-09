'use client';

import ReactMarkdown from 'react-markdown';
import { formatTimestamp } from './useChatbot';
import { memo } from 'react';

/**
 * ChatbotMessageBubble Component
 * Individual message display with markdown support
 * Per spec FR-007, FR-008, FR-020: Distinct styling, timestamp, markdown formatting
 * Memoized to prevent unnecessary re-renders (US4 - T028)
 * 
 * @param {Object} props
 * @param {{id: string, content: string, sender: 'user' | 'bot', timestamp: string}} props.message - Message object
 * @param {string} [props.className] - Optional additional CSS classes
 */
function ChatbotMessageBubble({ message, className = '' }) {
  const isUser = message.sender === 'user';
  
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}
      aria-label={`Message from ${isUser ? 'you' : 'DJ College Assistant'} at ${formatTimestamp(message.timestamp)}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? 'bg-emerald-50 text-gray-900 rounded-br-sm'
            : 'bg-gray-50 text-gray-900 rounded-bl-sm'
        }`}
      >
        <div className="text-sm prose prose-sm max-w-none break-words">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <span className={`mt-1 block text-xs ${
          isUser ? 'text-emerald-700' : 'text-gray-500'
        }`}>
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders (T028)
export default memo(ChatbotMessageBubble);
