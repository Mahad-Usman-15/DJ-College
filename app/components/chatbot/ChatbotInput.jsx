'use client';

import { Send } from 'lucide-react';
import { useState, useCallback } from 'react';

/**
 * ChatbotInput Component
 * Text input area with auto-resizing textarea and send button
 * Per spec FR-010, FR-011: Auto-resizing, disabled when empty, green send button
 * 
 * @param {Object} props
 * @param {string} props.value - Current input value
 * @param {(value: string) => void} props.onChange - Change handler
 * @param {() => void} props.onSend - Send handler
 * @param {boolean} [props.isDisabled] - Disabled state
 * @param {string} [props.className] - Optional additional CSS classes
 */
export default function ChatbotInput({ value, onChange, onSend, isDisabled = false, className = '' }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleSend = useCallback(() => {
    const trimmed = value?.trim();
    if (!trimmed) return;
    
    onSend(trimmed);
  }, [value, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`border-t border-gray-200 p-4 ${className}`}>
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isDisabled}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-gray-300 px-3 text-black py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-100"
          aria-label="Type your message"
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          disabled={!value?.trim() || isDisabled}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
          type="button"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
