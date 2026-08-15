import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Trophy,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  Search,
  Shield,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { getLevelProgress } from '@/utils/helpers';

export function Navbar() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const levelInfo = user ? getLevelProgress(user.xp || 0, user.level || 1) : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gaming-dark/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="/images/logo.png"
              alt="Galactic Squad"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="hidden absolute -inset-1 rounded-full bg-gaming-purple/30 blur-sm group-hover:block -z-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gaming-purple via-gaming-cyan to-white">
              GALACTIC SQUAD
            </span>
            <span className="text-[9px] uppercase tracking-widest text-gaming-cyan font-semibold">
              NEXT-GEN GAMING PORTAL
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link
            to="/"
            className="text-gray-300 hover:text-gaming-purple transition-colors flex items-center gap-1.5"
          >
            Home
          </Link>
          <Link
            to="/games"
            className="text-gray-300 hover:text-gaming-purple transition-colors flex items-center gap-1.5"
          >
            <Gamepad2 className="w-4 h-4 text-gaming-purple" />
            Games
          </Link>
          <Link
            to="/leaderboard"
            className="text-gray-300 hover:text-gaming-purple transition-colors flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Leaderboard
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="text-gaming-cyan hover:text-cyan-300 transition-colors flex items-center gap-1.5 font-orbitron text-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* User Stats / Auth Action */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              {/* XP & Level Status Pill */}
              <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-3.5 py-1.5 rounded-full">
                <div className="flex items-center gap-1.5">
                  <Badge variant="default" className="font-orbitron text-[10px] h-5 bg-gaming-purple">
                    LVL {user.level || 1}
                  </Badge>
                </div>
                <div className="w-24">
                  <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5 font-orbitron">
                    <span>XP</span>
                    <span>{levelInfo?.percent || 0}%</span>
                  </div>
                  <Progress value={levelInfo?.percent || 0} className="h-1.5 bg-white/10" />
                </div>
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-gaming-purple/40 hover:border-gaming-purple transition-colors bg-gaming-card"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.username?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-gaming-dark/95 border border-white/15 p-2 shadow-2xl backdrop-blur-xl z-50"
                    >
                      <div className="p-3 border-b border-white/10 mb-1">
                        <div className="font-bold text-sm text-white font-orbitron">{user.username}</div>
                        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-amber-400 font-semibold">
                            🔥 {user.streak || 1} Day Streak
                          </span>
                          <span className="text-[10px] text-gaming-cyan">
                            ⭐ {user.totalScore?.toLocaleString() || 0} pts
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/profile/${user._id || 'me'}`}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-200 hover:bg-gaming-purple/20 hover:text-white rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-gaming-purple" />
                        My Battle Profile
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-200 hover:bg-gaming-purple/20 hover:text-white rounded-xl transition-colors"
                        >
                          <Shield className="w-4 h-4 text-gaming-cyan" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openAuthModal('login')}
                className="text-sm font-semibold hover:text-white"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => openAuthModal('signup')}
                className="bg-gaming-purple hover:bg-gaming-purple/90 text-white font-orbitron text-xs px-5 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Join Squad
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-gray-300 hover:bg-white/5"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-gaming-dark/95 p-4 space-y-4"
          >
            <div className="flex flex-col space-y-3 font-semibold text-sm">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-200"
              >
                Home
              </Link>
              <Link
                to="/games"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-200"
              >
                Games Catalog
              </Link>
              <Link
                to="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-200"
              >
                Leaderboard
              </Link>
              {isAuthenticated && user && (
                <Link
                  to={`/profile/${user._id || 'me'}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-200"
                >
                  My Profile (Level {user.level || 1})
                </Link>
              )}
            </div>

            <div className="pt-2 border-t border-white/10">
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="bg-gaming-purple"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('signup');
                    }}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
