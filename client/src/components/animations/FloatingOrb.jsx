import React from 'react';
import { motion } from 'framer-motion';

export function FloatingOrb({ color = '#8b5cf6', size = 300, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.15, 1],
        x: [0, 20, -20, 0],
        y: [0, -25, 15, 0],
      }}
      transition={{
        duration: 10 + delay * 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`,
        filter: 'blur(40px)',
      }}
      className={`pointer-events-none absolute rounded-full ${className}`}
    />
  );
}

export default FloatingOrb;
