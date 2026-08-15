import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedText({ text, className = '' }) {
  return (
    <motion.span
      className={`inline-block bg-gradient-to-r from-gaming-purple via-gaming-cyan to-gaming-pink bg-clip-text text-transparent ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {text}
    </motion.span>
  );
}

export default AnimatedText;
