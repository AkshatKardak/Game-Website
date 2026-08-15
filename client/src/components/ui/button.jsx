import React from 'react';
import { cn } from '@/utils/cn';

export const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gaming-purple focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer';

    const variants = {
      default:
        'bg-gaming-purple text-white shadow-lg shadow-purple-900/30 hover:bg-gaming-purple/90 hover:shadow-purple-700/50',
      neon:
        'bg-gradient-to-r from-gaming-purple via-gaming-blue to-gaming-pink text-white shadow-lg hover:opacity-95 hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]',
      outline:
        'border border-gaming-purple/40 bg-background/50 hover:bg-gaming-purple/10 hover:border-gaming-purple text-foreground',
      secondary:
        'bg-gaming-blue text-white hover:bg-gaming-blue/90 shadow-md shadow-blue-900/30',
      ghost:
        'hover:bg-gaming-purple/10 text-muted-foreground hover:text-foreground',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      link:
        'text-gaming-purple underline-offset-4 hover:underline p-0 h-auto',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-12 rounded-lg px-8 text-base font-bold',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant] || variants.default, sizes[size] || sizes.default, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
