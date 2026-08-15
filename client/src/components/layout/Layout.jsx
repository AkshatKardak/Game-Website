import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ParticleBackground } from '@/components/animations/ParticleBackground';
import { AIChatbot } from '@/components/ai/AIChatbot';
import { AuthModal } from '@/components/auth/AuthModal';
import { GamePlayer } from '@/components/games/GamePlayer';

export function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-gaming-purple selection:text-white">
      {/* Background Starfield and Space Dust */}
      <ParticleBackground />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Elements */}
      <AIChatbot />
      <AuthModal />
      <GamePlayer />
    </div>
  );
}

export default Layout;
