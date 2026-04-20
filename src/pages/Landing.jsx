import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Lightbulb, Bell } from 'lucide-react';
import { OrariBrandLockup } from '../components/orari/OrariBrandLockup';
import { Button } from '../components/orari/Button';

function FeatureCard({ feature, dense = false }) {
  const Icon = feature.icon;
  return (
    <div
      className={`w-[min(78vw,18rem)] shrink-0 rounded-xl bg-orari-surface text-center shadow-orari-card ${
        dense ? 'space-y-2 p-3.5' : 'space-y-3 p-5'
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-center rounded-lg bg-orari-primary-light ${
          dense ? 'h-9 w-9' : 'h-11 w-11'
        }`}
      >
        <Icon className={`text-orari-primary ${dense ? 'h-4 w-4' : 'h-5 w-5'}`} />
      </div>
      <h3 className={`font-semibold text-orari-text-primary ${dense ? 'text-[13px]' : 'text-[15px]'}`}>{feature.title}</h3>
      <p className={`leading-relaxed text-orari-text-secondary ${dense ? 'text-[11px]' : 'text-[12px]'}`}>
        {feature.description}
      </p>
    </div>
  );
}

/** Startup — mobile: no-scroll column; branding hub + flex-1 marquee + anchored CTAs */
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

  const marqueeItems = [...features, ...features];

  return (
    <div className="fixed inset-0 z-0 flex flex-col overflow-hidden bg-[#ffffff] lg:static lg:z-auto lg:min-h-screen lg:overflow-visible lg:bg-orari-background">
      {/* Mobile — full #fff viewport (incl. safe areas); orari-landing-root enables short-height brand scaling */}
      <div className="orari-landing-root flex min-h-0 flex-1 flex-col overflow-hidden bg-[#ffffff] py-4 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] lg:hidden">
        <div className="flex min-h-0 flex-1 flex-col justify-between px-3">
          <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-1 overflow-hidden">
            <OrariBrandLockup compact />
            <div className="flex min-h-0 w-full flex-col justify-center overflow-hidden py-0.5">
              <div className="flex min-h-0 w-full items-center justify-center overflow-hidden">
                <div className="orari-landing-marquee-track">
                  {marqueeItems.map((feature, index) => (
                    <FeatureCard key={`${feature.title}-${index}`} feature={feature} dense />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-xs shrink-0 flex-col gap-2 self-center bg-[#ffffff] pb-1 pt-2">
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
              className="py-1.5 text-[15px] text-orari-text-secondary transition-colors hover:text-orari-primary"
            >
              Log In
            </button>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden min-h-screen flex-col items-center justify-center px-6 py-12 lg:flex">
        <div className="flex w-full max-w-5xl flex-col items-center">
          <div className="mb-12 flex w-full flex-col items-center justify-center text-center">
            <OrariBrandLockup />
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

          <div className="grid w-full grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
