import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Lightbulb, Bell } from 'lucide-react';
import Logo from '../components/orari/Logo';
import { Button } from '../components/orari/Button';

/** Figma `Landing.tsx` — centered column; px-6 py-12; feature grid gap-6 md:grid-cols-3 */
export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered calendar that adapts to your routine',
    },
    {
      icon: Lightbulb,
      title: 'Smart Suggestions',
      description: 'Get intelligent time slot recommendations',
    },
    {
      icon: Bell,
      title: 'Never Miss a Thing',
      description: 'Timely alerts for what matters most',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-orari-background px-6 py-12">
      <div className="flex w-full max-w-5xl flex-col items-center">
        <div className="mb-12 flex flex-col items-center space-y-4 text-center">
          <Logo variant="full" size="large" />
          <p className="text-[15px] text-orari-text-secondary">Your schedule, simplified.</p>
        </div>

        <div className="mb-16 flex w-full max-w-xs flex-col items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            type="button"
            className="w-full bg-gradient-to-br from-[#3AAFA9] to-[#6EC6E6] hover:opacity-90"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[15px] text-orari-text-secondary transition-colors hover:text-orari-primary"
          >
            Log In
          </button>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="space-y-3 rounded-xl bg-orari-surface p-6 text-center shadow-orari-card"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-orari-primary-light">
                  <Icon className="h-6 w-6 text-orari-primary" />
                </div>
                <h3 className="text-[15px] font-semibold text-orari-text-primary">{feature.title}</h3>
                <p className="text-[13px] leading-relaxed text-orari-text-secondary">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
