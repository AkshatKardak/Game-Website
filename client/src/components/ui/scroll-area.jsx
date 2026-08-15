import React from 'react';
import { cn } from '@/utils/cn';

export const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative overflow-y-auto overflow-x-hidden', className)}
    {...props}
  >
    {children}
  </div>
));
ScrollArea.displayName = 'ScrollArea';

export default ScrollArea;
