import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrariBrandLockup } from '../components/orari/OrariBrandLockup';
import { Button } from '../components/orari/Button';

const inputClass =
  'w-full rounded-lg border border-orari-border bg-white text-orari-text-primary focus:outline-none focus:ring-2 focus:ring-orari-primary/20';

/** Figma `SignUp.tsx` — desktop card; mobile: 100dvh, no page scroll, CTAs anchored bottom */
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

  const formFields = (
    <>
      <div>
        <label className="mb-1 block text-[12px] text-orari-text-secondary lg:mb-2 lg:text-[13px]">Full Name</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`${inputClass} px-3 py-2 text-[14px] lg:px-4 lg:py-3 lg:text-[15px]`}
        />
      </div>
      <div>
        <label className="mb-1 block text-[12px] text-orari-text-secondary lg:mb-2 lg:text-[13px]">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputClass} px-3 py-2 text-[14px] lg:px-4 lg:py-3 lg:text-[15px]`}
        />
      </div>
      <div>
        <label className="mb-1 block text-[12px] text-orari-text-secondary lg:mb-2 lg:text-[13px]">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputClass} px-3 py-2 text-[14px] lg:px-4 lg:py-3 lg:text-[15px]`}
        />
        {password.length > 0 && (
          <div className="mt-1.5 lg:mt-2">
            <div className="h-1 w-full overflow-hidden rounded-full bg-orari-border">
              <div
                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                style={{ width: `${passwordStrength.strength}%` }}
              />
            </div>
            <p className="mt-0.5 text-[10px] text-orari-text-secondary lg:mt-1 lg:text-[11px]">{passwordStrength.label}</p>
          </div>
        )}
      </div>
      <div>
        <label className="mb-1 block text-[12px] text-orari-text-secondary lg:mb-2 lg:text-[13px]">Confirm Password</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`${inputClass} px-3 py-2 text-[14px] lg:px-4 lg:py-3 lg:text-[15px]`}
        />
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-0 flex flex-col overflow-hidden bg-[#ffffff] lg:static lg:z-auto lg:min-h-screen lg:overflow-visible lg:bg-orari-background">
      <div className="orari-signup-root flex min-h-0 flex-1 flex-col overflow-hidden bg-[#ffffff] px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] lg:hidden">
        <div className="flex min-h-0 flex-1 flex-col justify-between py-3">
          <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden">
            <OrariBrandLockup compact logoVariant="onBackground" />
            <form
              id="orari-signup-form"
              onSubmit={handleSubmit}
              className="mt-2 flex min-h-0 flex-1 flex-col space-y-2 overflow-y-auto overscroll-contain pb-1"
            >
              {formFields}
            </form>
          </div>
          <div className="shrink-0 space-y-2 bg-[#ffffff] pt-2">
            <Button
              type="submit"
              form="orari-signup-form"
              variant="primary"
              size="lg"
              className="w-full"
            >
              Create Account
            </Button>
            <div className="text-center">
              <span className="text-[12px] text-orari-text-secondary">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-medium text-orari-primary hover:underline"
                >
                  Log In
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden min-h-screen flex-1 items-center justify-center bg-orari-background px-6 py-12 lg:flex">
        <div className="w-full max-w-md rounded-xl bg-orari-surface p-8 shadow-orari-card">
          <div className="mb-10 flex w-full flex-col items-center justify-center pt-1">
            <OrariBrandLockup logoVariant="onBackground" />
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
    </div>
  );
}
