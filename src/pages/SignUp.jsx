import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/orari/Logo';
import { Button } from '../components/orari/Button';

/** Figma `SignUp.tsx` — space-y-6 form; password strength bar h-1 rounded-full */
export default function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return { strength: 0, color: 'bg-orari-border', label: '' };
    if (pwd.length < 6) return { strength: 33, color: 'bg-orari-danger', label: 'Weak' };
    if (pwd.length < 10) return { strength: 66, color: 'bg-orari-warning', label: 'Good' };
    return { strength: 100, color: 'bg-orari-accent', label: 'Strong' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-orari-background px-6 py-12">
      <div className="w-full max-w-md rounded-xl bg-orari-surface p-8 shadow-orari-card">
        <div className="mb-8 flex justify-center">
          <Logo variant="full" size="medium" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-[13px] text-orari-text-secondary">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-[13px] text-orari-text-secondary">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-orari-text-secondary">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
            />
            {password.length > 0 && (
              <div className="mt-2">
                <div className="h-1 w-full overflow-hidden rounded-full bg-orari-border">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-orari-text-secondary">{passwordStrength.label}</p>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[13px] text-orari-text-secondary">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-orari-border bg-white px-4 py-3 text-[15px] text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-[13px] text-orari-text-secondary">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')} className="font-medium text-orari-primary hover:underline">
              Log In
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
