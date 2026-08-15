import React from 'react';
import { cn } from '@/utils/cn';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default:
      'border-transparent bg-gaming-purple text-white shadow hover:bg-gaming-purple/80',
    secondary:
      'border-transparent bg-gaming-blue/20 text-blue-400 border border-blue-500/30',
    accent:
      'border-transparent bg-gaming-cyan/20 text-cyan-300 border border-cyan-500/30',
    pink:
      'border-transparent bg-gaming-pink/20 text-pink-400 border border-pink-500/30',
    gold:
      'border-transparent bg-amber-500/20 text-amber-300 border border-amber-500/40',
    destructive:
      'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
    outline: 'text-foreground border border-white/20',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Badge;
