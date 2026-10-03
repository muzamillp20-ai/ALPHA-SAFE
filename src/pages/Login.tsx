import { useState, useEffect } from 'react';
import { useStore, addActivity } from '../store';

export default function Login() {
  const { dispatch } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number; duration: number }[]>([]);

  // Generate background particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (isSignUp && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = {
        id: crypto.randomUUID(),
        email: email.trim(),
        name: isSignUp ? name.trim() : email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'LOGIN', payload: user });
      addActivity(dispatch, 'auth', isSignUp ? 'Account created' : 'Signed in');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        
        {/* Floating particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: 'var(--accent)',
              opacity: 0.3,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}

        {/* Radial gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.03] blur-3xl animate-pulse-slow" style={{ background: 'var(--accent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.02] blur-3xl animate-pulse-slow" style={{ background: 'var(--accent)', animationDelay: '2s' }} />
      </div>

      {/* Left Panel - Brand */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>α</div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mt-8" style={{ color: 'var(--text-primary)' }}>
            ALPHA SAFE
          </h1>
          <p className="text-lg mt-2 font-light" style={{ color: 'var(--text-secondary)' }}>
            Stay ahead of the threat.
          </p>
        </div>

        {/* Signal Flow Visualization */}
        <div className="relative z-10 flex flex-col items-start gap-6">
          {['SIGNAL', 'ANALYZE', 'UNDERSTAND', 'PROTECT'].map((step, i) => (
            <div key={step} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 200}ms` }}>
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center text-xs font-mono" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="text-sm font-medium tracking-wider" style={{ color: 'var(--text-secondary)' }}>{step}</div>
              </div>
              {i < 3 && (
                <div className="absolute left-5 ml-10 w-px h-6" style={{ background: 'var(--border)', marginTop: '2.5rem' }} />
              )}
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Personal Cyber Safety Intelligence
          </p>
        </div>
      </div>

      {/* Right Panel - Auth */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="lg:hidden mb-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>α</div>
              <span className="text-lg font-bold">ALPHA SAFE</span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Personal Cyber Safety Intelligence</p>
          </div>

          <h2 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'Start your cyber safety journey.' : 'Sign in to your Alpha Safe account.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-[var(--accent)]"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-[var(--accent)]"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border text-sm outline-none transition-colors focus:border-[var(--accent)]"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  placeholder="••••••••"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '◉' : '◎'}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <button type="button" className="text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(255,91,110,0.1)', color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}
            >
              {loading ? '...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-xs hover:underline"
              style={{ color: 'var(--text-muted)' }}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
