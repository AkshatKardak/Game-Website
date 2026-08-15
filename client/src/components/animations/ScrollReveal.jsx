import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function ScrollReveal({ children, className = '', delay = 0, threshold = 0.15 }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
