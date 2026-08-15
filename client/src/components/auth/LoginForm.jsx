import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function LoginForm({ onSwitchToSignup }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/20 border border-destructive/40 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1.5 font-orbitron">
          PILOT EMAIL
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="commander@galacticsquad.com"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1.5 font-orbitron">
          ACCESS CODE (PASSWORD)
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)]"
      >
        <LogIn className="w-4 h-4 mr-2" />
        {loading ? 'AUTHENTICATING...' : 'ENTER THE SQUAD'}
      </Button>

      {/* Demo Credentials Quick Click */}
      <div className="pt-3 border-t border-white/10">
        <div className="text-[10px] text-muted-foreground text-center mb-2 uppercase font-semibold">
          Quick Demo Logins
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleDemoLogin('admin@galacticsquad.com', 'admin123')}
            className="p-2 rounded-lg bg-white/5 hover:bg-gaming-purple/20 border border-white/10 text-gray-300 transition-colors text-left"
          >
            <div className="font-bold text-gaming-cyan">Admin Demo</div>
            <div className="text-[10px] text-muted-foreground">GalacticCommander</div>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('reaper@galacticsquad.com', 'player123')}
            className="p-2 rounded-lg bg-white/5 hover:bg-gaming-purple/20 border border-white/10 text-gray-300 transition-colors text-left"
          >
            <div className="font-bold text-gaming-pink">Player Demo</div>
            <div className="text-[10px] text-muted-foreground">CyberReaper</div>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground pt-2">
        Need to enlist a new battle tag?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-gaming-purple hover:underline font-semibold"
        >
          Create Account
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
