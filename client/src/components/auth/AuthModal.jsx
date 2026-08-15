import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useAuth } from '@/context/AuthContext';

export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, setAuthModalMode } = useAuth();

  return (
    <Dialog open={authModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent onClose={closeAuthModal} className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {authModalMode === 'login' ? 'PILOT ACCESS GATEWAY' : 'ENLIST NEW SQUAD MEMBER'}
          </DialogTitle>
          <DialogDescription className="text-center text-xs">
            {authModalMode === 'login'
              ? 'Enter your security clearance to access leaderboard tracking and games'
              : 'Join thousands of commanders across the quadrant'}
          </DialogDescription>
        </DialogHeader>

        {authModalMode === 'login' ? (
          <LoginForm onSwitchToSignup={() => setAuthModalMode('signup')} />
        ) : (
          <SignupForm onSwitchToLogin={() => setAuthModalMode('login')} />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
