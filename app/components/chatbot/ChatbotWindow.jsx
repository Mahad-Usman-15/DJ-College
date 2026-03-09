'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

/**
 * ChatbotWindow Component
 * Main container for the chat interface with animations
 * Per spec FR-002, FR-002a, FR-017: Positioned above trigger, max-width 380-420px
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility
 * @param {() => void} props.onClose - Close handler
 * @param {React.ReactNode} props.children - Child components
 * @param {string} [props.className] - Optional additional CSS classes
 */
export default function ChatbotWindow({ isOpen, onClose, children, className = '' }) {
  const containerRef = useRef(null);

  // Close on ESC key (FR-014)
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

  // Focus trap for accessibility (FR-015)
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
          className={`fixed bottom-20 right-5 z-[9999] w-[380px] max-w-[calc(100vw-2.5rem)] max-h-[500px] rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden md:max-w-[420px] ${className}`}
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
