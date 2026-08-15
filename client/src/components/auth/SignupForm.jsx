import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, UserPlus, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function SignupForm({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ username, email, password });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
          CALLSIGN / USERNAME
        </label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. StarLord_99"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1.5 font-orbitron">
          PILOT EMAIL
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="starlord@galacticsquad.com"
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
          placeholder="At least 6 characters"
          required
        />
      </div>

      <div className="p-3 rounded-xl bg-gaming-purple/10 border border-gaming-purple/20 text-xs text-gaming-purple flex items-center gap-2">
        <Zap className="w-4 h-4 shrink-0 text-gaming-cyan" />
        <span>Instantly unlocks <strong>+50 Welcome XP</strong> and <strong>Galactic Recruit Badge</strong>!</span>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-gradient-to-r from-gaming-purple via-gaming-blue to-gaming-pink hover:opacity-90 font-orbitron text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)] text-white"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        {loading ? 'ENLISTING PILOT...' : 'ENLIST IN SQUAD'}
      </Button>

      <div className="text-center text-xs text-muted-foreground pt-2">
        Already registered in the fleet?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-gaming-purple hover:underline font-semibold"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}

export default SignupForm;
