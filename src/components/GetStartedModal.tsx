import React, { useState } from 'react';
import { X, Check, Zap, Sparkles } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [subscribedPlan, setSubscribedPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const plans = [
    {
      name: 'Essential',
      badge: 'Most Popular',
      price: billingCycle === 'annual' ? '$12.95' : '$14.95',
      period: '/mo',
      description: 'Distraction-free trading and investing, with more charts, intervals and indicators.',
      features: [
        '5 indicators per chart',
        '2 charts in one window',
        '20 server-side price alerts',
        'Ad-free experience',
        'Volume profile indicators'
      ],
      cta: 'Start 30-Day Free Trial',
      highlighted: false
    },
    {
      name: 'Plus',
      badge: 'Best Value',
      price: billingCycle === 'annual' ? '$24.95' : '$29.95',
      period: '/mo',
      description: 'Intraday technical analysis for day traders looking to take things to the next level.',
      features: [
        '10 indicators per chart',
        '4 charts in one layout',
        '100 server-side alerts',
        '10 saved chart layouts',
        'Custom intraday intervals',
        'Bar replay on intraday bars'
      ],
      cta: 'Start 30-Day Free Trial',
      highlighted: true
    },
    {
      name: 'Premium',
      badge: 'Institutional Grade',
      price: billingCycle === 'annual' ? '$49.95' : '$59.95',
      period: '/mo',
      description: 'Highest precision and maximum data to capture all possible market opportunities.',
      features: [
        '25 indicators per chart',
        '8 charts in one layout',
        '400 priority price alerts',
        'Unlimited saved chart layouts',
        'Second-based intervals',
        'Alerts that do not expire'
      ],
      cta: 'Start 30-Day Free Trial',
      highlighted: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-[#e0e3eb] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#f0f3fa] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2962FF]">
              30-Day Free Trial
            </span>
            <h3 className="text-2xl font-bold text-[#131722] mt-0.5">
              Supercharge your trading with Pro tools
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#6a6d78] hover:text-[#131722] rounded-full hover:bg-[#f0f3fa] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Billing Switch */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-[#131722]' : 'text-[#6a6d78]'}`}>
              Monthly billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
              className="w-12 h-6 bg-[#2962FF] rounded-full p-1 transition cursor-pointer relative"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-[#131722]' : 'text-[#6a6d78]'}`}>
              <span>Annual billing</span>
              <span className="bg-[#e6f7f2] text-[#089981] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                Save 16%
              </span>
            </span>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isSelected = subscribedPlan === plan.name;

              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                    plan.highlighted
                      ? 'border-[#2962FF] bg-[#f8faff] shadow-md ring-2 ring-[#2962FF]/20 relative'
                      : 'border-[#e0e3eb] bg-white hover:border-[#2962FF]/50'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2962FF] text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-lg font-bold text-[#131722]">{plan.name}</h4>
                      {!plan.highlighted && (
                        <span className="text-[10px] text-[#6a6d78] font-semibold bg-[#f0f3fa] px-2 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-3xl font-extrabold text-[#131722] tabular-nums">{plan.price}</span>
                      <span className="text-xs text-[#6a6d78]">{plan.period}</span>
                    </div>

                    <p className="text-xs text-[#6a6d78] mb-4 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="space-y-2 border-t border-[#e0e3eb]/60 pt-4 mb-6">
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#131722]">
                          <Check className="w-3.5 h-3.5 text-[#089981] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSubscribedPlan(plan.name);
                      setTimeout(() => onClose(), 1500);
                    }}
                    className={`w-full py-2.5 rounded-full text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-[#089981] text-white'
                        : plan.highlighted
                        ? 'bg-[#2962FF] hover:bg-[#1e53e5] text-white'
                        : 'bg-[#131722] hover:bg-black text-white'
                    }`}
                  >
                    {isSelected ? 'Trial Activated!' : plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="text-center text-xs text-[#6a6d78]">
            No commitment. Cancel anytime during your 30-day trial with 1-click in account settings.
          </div>

        </div>

      </div>
    </div>
  );
};
