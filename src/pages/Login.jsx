import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';
import Logo from '../components/orari/Logo';
import { Button } from '../components/orari/Button';

/** Figma `Login.tsx` — card shadow-orari-card, p-8, max-w-md, form space-y-5 */
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEmailValid && isPasswordValid) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-orari-background px-6 py-12">
      <div className="w-full max-w-md rounded-xl bg-orari-surface p-8 shadow-orari-card">
        <div className="mb-8 flex justify-center">
          <Logo variant="full" size="medium" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="mb-2 block text-[13px] text-orari-text-secondary">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-[15px] text-orari-text-primary transition-all focus:outline-none focus:ring-2 ${
                  emailTouched && !isEmailValid
                    ? 'border-orari-danger focus:ring-orari-danger/20'
                    : emailTouched && isEmailValid
                      ? 'border-orari-accent focus:ring-orari-primary/20'
                      : 'border-orari-border focus:ring-orari-primary/20'
                }`}
                required
              />
              {emailTouched && isEmailValid && (
                <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orari-accent" />
              )}
            </div>
            {emailTouched && !isEmailValid && email.length > 0 && (
              <div className="mt-1 flex items-center gap-1 text-[13px] text-orari-danger">
                <AlertCircle className="h-4 w-4" />
                <span>Please enter a valid email</span>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="mb-2 block text-[13px] text-orari-text-secondary">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-[15px] text-orari-text-primary transition-all focus:outline-none focus:ring-2 ${
                  passwordTouched && !isPasswordValid
                    ? 'border-orari-danger focus:ring-orari-danger/20'
                    : passwordTouched && isPasswordValid
                      ? 'border-orari-accent focus:ring-orari-primary/20'
                      : 'border-orari-border focus:ring-orari-primary/20'
                }`}
                required
              />
              {passwordTouched && isPasswordValid && (
                <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orari-accent" />
              )}
            </div>
            {passwordTouched && !isPasswordValid && password.length > 0 && (
              <div className="mt-1 flex items-center gap-1 text-[13px] text-orari-danger">
                <AlertCircle className="h-4 w-4" />
                <span>Password must be at least 6 characters</span>
              </div>
            )}
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Log In
          </Button>

          <button type="button" className="text-[13px] text-orari-text-secondary transition-colors hover:text-orari-primary">
            Forgot Password?
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-orari-border" />
          <span className="text-[13px] text-orari-text-secondary">or</span>
          <div className="h-px flex-1 bg-orari-border" />
        </div>

        <Button variant="secondary" size="lg" type="button" className="w-full" onClick={() => navigate('/dashboard')}>
          Continue with Google
        </Button>

        <div className="mt-6 text-center">
          <span className="text-[13px] text-orari-text-secondary">
            Don&apos;t have an account?{' '}
            <button type="button" onClick={() => navigate('/signup')} className="font-medium text-orari-primary hover:underline">
              Sign Up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
