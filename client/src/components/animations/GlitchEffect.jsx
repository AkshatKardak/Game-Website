import React from 'react';

export function GlitchEffect({ text, className = '' }) {
  return (
    <span className={`relative inline-block group cursor-default ${className}`}>
      <span className="relative z-10">{text}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 text-gaming-cyan opacity-0 group-hover:opacity-75 transition-opacity translate-x-0.5 -translate-y-0.5 pointer-events-none select-none"
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 text-gaming-pink opacity-0 group-hover:opacity-75 transition-opacity -translate-x-0.5 translate-y-0.5 pointer-events-none select-none"
      >
        {text}
      </span>
    </span>
  );
}

export default GlitchEffect;
