import React from 'react';
import { cn } from '@/utils/cn';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-white/5 border border-white/5',
        className
      )}
      {...props}
    />
  );
}

export default Skeleton;
