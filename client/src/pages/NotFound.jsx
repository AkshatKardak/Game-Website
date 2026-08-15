import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center min-h-[70vh]">
      <Compass className="w-20 h-20 text-gaming-purple mb-6 animate-spin-slow" />
      <h1 className="text-6xl sm:text-8xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-gaming-purple via-gaming-cyan to-pink-500 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
        LOST IN DEEP SPACE
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        The hyperspace coordinates you navigated to do not exist in this sector. Re-align thrusters back to home base.
      </p>
      <Link to="/">
        <Button size="lg" className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron">
          <ArrowLeft className="w-4 h-4 mr-2" />
          WARP BACK HOME
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
