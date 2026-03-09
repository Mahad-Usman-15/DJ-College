'use client';

import { MessageCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ChatbotTrigger Component
 * Floating circular button that opens/closes the chat widget
 * Per spec FR-001, FR-001a: Fixed position bottom-right (20px, 20px)
 * 
 * @param {Object} props
 * @param {() => void} props.onClick - Trigger click handler
 * @param {boolean} props.isOpen - Current open state (for icon toggle)
 * @param {string} [props.className] - Optional additional CSS classes
 */
export default function ChatbotTrigger({ onClick, isOpen, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed bottom-5 right-5 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors ${className}`}
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
