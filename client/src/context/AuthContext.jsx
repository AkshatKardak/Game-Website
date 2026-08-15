import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  useEffect(() => {
    const token = localStorage.getItem('galactic_token');
    if (token) {
      authService
        .getMe()
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          localStorage.removeItem('galactic_token');
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    triggerCelebration();
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
  };

  const addXP = (earnedXP, newLevel, leveledUp = false, newAchievements = []) => {
    if (!user) return;
    setUser((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + earnedXP,
      level: newLevel || prev.level,
      achievements: newAchievements.length > 0 ? [...prev.achievements, ...newAchievements] : prev.achievements,
    }));

    if (leveledUp || (newAchievements && newAchievements.length > 0)) {
      triggerCelebration();
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#3b82f6', '#ec4899', '#06b6d4', '#fbbf24'],
    });
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUserState,
        addXP,
        triggerCelebration,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
