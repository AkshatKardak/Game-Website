import React from 'react';
import { cn } from '@/utils/cn';

export const Avatar = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gaming-purple/40 bg-gaming-card',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Avatar.displayName = 'Avatar';

export const AvatarImage = React.forwardRef(({ className, src, alt, ...props }, ref) => (
  <img
    ref={ref}
    src={src}
    alt={alt || 'Avatar'}
    className={cn('aspect-square h-full w-full object-cover', className)}
    onError={(e) => {
      e.currentTarget.src = '/images/team-logo-1.png';
    }}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

export const AvatarFallback = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted font-bold text-xs uppercase text-gaming-purple',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
AvatarFallback.displayName = 'AvatarFallback';
