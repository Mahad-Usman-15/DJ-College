'use client';

import { motion } from 'framer-motion';

/**
 * ChatbotTypingIndicator Component
 * Animated 3-dot typing indicator
 * Per spec FR-009: 3-dot or pulse style animation
 * 
 * @param {Object} props
 * @param {boolean} [props.isVisible] - Controls visibility
 * @param {string} [props.className] - Optional additional CSS classes
 */
export default function ChatbotTypingIndicator({ isVisible = true, className = '' }) {
  if (!isVisible) return null;

  return (
    <div
      className={`flex justify-start ${className}`}
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
