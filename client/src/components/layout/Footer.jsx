import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Trophy, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-gaming-darker/90 backdrop-blur-md pt-16 pb-12 mt-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Galactic Squad"
                className="h-9 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-orbitron font-black text-lg text-white">
                GALACTIC SQUAD
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The premier next-generation browser gaming platform. Experience ultra-fast AI assistance, real-time multiplayer leaderboards, and competitive arcade glory.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-gray-300">All Neural Services Operational</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-orbitron text-xs font-bold uppercase tracking-wider text-gaming-purple mb-4">
              COMMAND MATRIX
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Galactic Home
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-white transition-colors">
                  Game Catalog
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-white transition-colors">
                  Global Leaderboards
                </Link>
              </li>
              <li>
                <a href="#teams" className="hover:text-white transition-colors">
                  Elite Squads
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Elite Squads */}
          <div>
            <h4 className="font-orbitron text-xs font-bold uppercase tracking-wider text-gaming-cyan mb-4">
              ELITE GUILDS
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>Game Over (Tactical RTS)</li>
              <li>Reaper Squad (Assassins)</li>
              <li>Martial Master (Melee Combat)</li>
              <li>Phoenix Team (Vanguard)</li>
              <li>Grim Sniper (Precision Aim)</li>
              <li>The Killers (Apex Dominion)</li>
            </ul>
          </div>

          {/* Col 4: AI & Technology */}
          <div>
            <h4 className="font-orbitron text-xs font-bold uppercase tracking-wider text-gaming-pink mb-4">
              TECH STACK
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Powered by React, Vite, Tailwind CSS, Framer Motion, Node.js Express, MongoDB, and Groq Llama 3.3 Ultra-Fast Inference.
            </p>
            <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-gaming-purple/10 border border-gaming-purple/20 text-gaming-purple text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Groq AI Enhanced</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <div>
            © {new Date().getFullYear()} Galactic Squad Gaming Hub. Built for competitive arcade supremacy.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/games" className="hover:text-white transition-colors">Privacy Protocol</Link>
            <Link to="/games" className="hover:text-white transition-colors">Terms of Battle</Link>
            <Link to="/games" className="hover:text-white transition-colors">API Docs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
