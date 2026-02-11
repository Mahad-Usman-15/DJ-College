'use client';

import { motion } from 'framer-motion';

const text = "D.J. Sindh Government Science College";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-emerald-900">
      <h1 className="text-white text-[clamp(20px,4vw,40px)] font-bold tracking-wide flex flex-wrap justify-center">
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.03,
              duration: 0.4,
            }}
            className="whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
      </h1>
    </div>
  );
}
