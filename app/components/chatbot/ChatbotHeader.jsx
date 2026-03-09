'use client';

import { X, Trash2 } from 'lucide-react';

/**
 * ChatbotHeader Component
 * Top bar with title, status indicator, and action buttons
 * Per spec FR-003, FR-021: Bot name, status, close/clear buttons
 * 
 * @param {Object} props
 * @param {string} props.title - Bot name (e.g., "DJ College Assistant")
 * @param {'online' | 'typing' | 'offline'} [props.status] - Status indicator
 * @param {() => void} props.onClose - Close handler
 * @param {() => void} props.onClear - Clear conversation handler
 * @param {string} [props.className] - Optional additional CSS classes
 */
export default function ChatbotHeader({ 
  title = 'DJ College Assistant', 
  status = 'online', 
  onClose, 
  onClear,
  className = '' 
}) {
  return (
    <div className={`flex items-center justify-between border-b border-gray-200 bg-emerald-600 px-4 py-3 text-white ${className}`}>
      <div className="flex items-center gap-3">
        <div>
          <h2 id="chatbot-title" className="font-semibold text-base">
            {title}
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
          className="rounded p-1.5 text-emerald-100 hover:bg-emerald-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          aria-label="Clear conversation"
          title="Clear conversation"
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          onClick={onClose}
          className="rounded p-1.5 text-emerald-100 hover:bg-emerald-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          aria-label="Close chat"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
