import React from 'react';
import { cn } from '@/utils/cn';

export const Progress = React.forwardRef(({ className, value = 0, indicatorColor, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative h-3 w-full overflow-hidden rounded-full bg-black/50 border border-white/10',
      className
    )}
    {...props}
  >
    <div
      className={cn(
        'h-full w-full flex-1 transition-all duration-500 ease-out bg-gradient-to-r from-gaming-purple to-gaming-cyan',
        indicatorColor
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
));
Progress.displayName = 'Progress';

export default Progress;
