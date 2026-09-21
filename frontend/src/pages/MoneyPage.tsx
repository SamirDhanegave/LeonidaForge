import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import {
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Target,
  Calculator,
  ShieldAlert,
} from 'lucide-react';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const MoneyPage: React.FC = () => {
  useSEO({
    title: 'GTA 6 Money Calculator | Playtime & Heist Planner',
    description:
      'Calculate how many heist sessions and playtime hours you need to afford luxury cars, safehouses, and weapons in GTA 6.',
    canonicalPath: '/money',
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: 'Money Planner', item: '/money' },
    ],
  });

  // Preset purchase goals
  const presets = [
    { label: 'Starter Vice Safehouse', amount: 450000 },
    { label: 'Bravado Banshee GTS', amount: 685000 },
    { label: 'Offshore Shitzu Speedboat', amount: 980000 },
    { label: 'Pegassi Zorrusso Hypercar', amount: 1925000 },
    { label: 'Downtown Penthouse & Helipad', amount: 3500000 },
  ];

  // Calculator 1: Money Goal state
  const [currentCash, setCurrentCash] = useState<number>(450000);
  const [targetAmount, setTargetAmount] = useState<number>(1925000);
  const [earningsPerSession, setEarningsPerSession] = useState<number>(150000);
  const [sessionDurationMins, setSessionDurationMins] = useState<number>(45);

  // Calculator 2: Can I afford it state
  const [quickCash, setQuickCash] = useState<number>(850000);
  const [quickPrice, setQuickPrice] = useState<number>(1200000);

  // Calc 1 computations
  const moneyRemaining = Math.max(0, targetAmount - currentCash);
  const progressPercent = Math.min(
    100,
    Math.round((currentCash / Math.max(targetAmount, 1)) * 100)
  );
  const sessionsNeeded =
    moneyRemaining <= 0
      ? 0
      : Math.ceil(moneyRemaining / Math.max(earningsPerSession, 1));
  const totalMinutes = sessionsNeeded * sessionDurationMins;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Calc 2 computations
  const canAfford = quickCash >= quickPrice;
  const quickDiff = Math.abs(quickCash - quickPrice);

  const handleApplyPreset = (amt: number) => {
    setTargetAmount(amt);
  };

  return (
    <div id="money-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Semantic Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Money Planner', path: '/money' }]} />

      {/* Header */}
      <section id="money-header" className="border-b border-[#1e2434] pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c8f135]">
            Financial Traversal Engine
          </span>
          <span className="text-xs text-[#64748b]">•</span>
          <SampleDataBadge />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight mb-3">
          GTA 6 Money &amp; Affordability Planner
        </h1>
        <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl leading-relaxed">
          Estimate session requirements, calculate remaining cash deficits, and determine whether high-end
          supercars, properties, or offshore watercraft fit your current bankroll.
        </p>

        {/* Disclaimer Tag */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#141824] border border-[#232a3d] text-xs text-[#8090a8]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#c8f135]" />
          <span>These are estimates based on the values you enter. Calculations update in real time.</span>
        </div>
      </section>

      {/* Preset Quick Selectors */}
      <section className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
          Quick Target Presets
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p.amount)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                targetAmount === p.amount
                  ? 'bg-[#c8f135] text-[#090a0f] font-bold border-[#c8f135]'
                  : 'bg-[#131622] border-[#22293b] text-[#ededef] hover:border-[#c8f135]/40 hover:bg-[#181d2a]'
              }`}
            >
              {p.label} (${(p.amount / 1000).toFixed(0)}k)
            </button>
          ))}
        </div>
      </section>

      {/* Calculators Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calculator 1: Money Goal (7 Columns) */}
        <div className="lg:col-span-7 rounded-2xl border border-[#232b3d] bg-[#121520] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#1e2434] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1c2232] border border-[#283248] flex items-center justify-center text-[#c8f135]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#f8fafc]">Calculator 1: Money Goal</h2>
                <p className="text-xs text-[#8090a8]">Calculate sessions, playtime and progress</p>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentCash(450000);
                setTargetAmount(1925000);
                setEarningsPerSession(150000);
                setSessionDurationMins(45);
              }}
              className="p-1.5 rounded-lg text-xs text-[#64748b] hover:text-[#ededef] hover:bg-[#1c2232]"
              title="Reset calculator inputs"
            >
              Reset
            </button>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8090a8] flex items-center justify-between">
                <span>Current In-Game Cash</span>
                <span className="font-mono text-[#f8fafc]">${currentCash.toLocaleString()}</span>
              </label>
              <input
                type="number"
                step={50000}
                min={0}
                value={currentCash}
                onChange={(e) => setCurrentCash(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#161a26] border border-[#263148] text-sm text-[#f8fafc] font-mono focus:outline-none focus:border-[#c8f135]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8090a8] flex items-center justify-between">
                <span>Target Purchase Price</span>
                <span className="font-mono text-[#c8f135]">${targetAmount.toLocaleString()}</span>
              </label>
              <input
                type="number"
                step={50000}
                min={0}
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#161a26] border border-[#263148] text-sm text-[#f8fafc] font-mono focus:outline-none focus:border-[#c8f135]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8090a8] flex items-center justify-between">
                <span>Estimated Earnings / Session</span>
                <span className="font-mono text-[#f8fafc]">
                  ${earningsPerSession.toLocaleString()}
                </span>
              </label>
              <input
                type="number"
                step={25000}
                min={10000}
                value={earningsPerSession}
                onChange={(e) => setEarningsPerSession(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#161a26] border border-[#263148] text-sm text-[#f8fafc] font-mono focus:outline-none focus:border-[#c8f135]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8090a8] flex items-center justify-between">
                <span>Average Session Length</span>
                <span className="font-mono text-[#f8fafc]">{sessionDurationMins} Mins</span>
              </label>
              <input
                type="number"
                step={5}
                min={15}
                max={180}
                value={sessionDurationMins}
                onChange={(e) => setSessionDurationMins(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#161a26] border border-[#263148] text-sm text-[#f8fafc] font-mono focus:outline-none focus:border-[#c8f135]"
              />
            </div>
          </div>

          {/* Progress Bar Display */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8090a8]">Goal Progress:</span>
              <span className="font-mono font-bold text-[#c8f135]">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#1b202c] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#c8f135] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Goal Output Summary Cards */}
          <div className="grid grid-cols-3 gap-3 border-t border-[#1e2434] pt-4 text-center font-mono">
            <div className="p-3 rounded-xl bg-[#161a26] border border-[#222a3d]">
              <div className="text-[10px] text-[#64748b] uppercase">Remaining</div>
              <div className="text-sm sm:text-base font-bold text-[#f8fafc] mt-0.5">
                ${moneyRemaining.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#161a26] border border-[#222a3d]">
              <div className="text-[10px] text-[#64748b] uppercase">Sessions Needed</div>
              <div className="text-sm sm:text-base font-bold text-[#c8f135] mt-0.5">
                {sessionsNeeded} {sessionsNeeded === 1 ? 'run' : 'runs'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#161a26] border border-[#222a3d]">
              <div className="text-[10px] text-[#64748b] uppercase">Playtime Req.</div>
              <div className="text-sm sm:text-base font-bold text-cyan-400 mt-0.5">
                {hours > 0 ? `${hours}h ` : ''}
                {minutes}m
              </div>
            </div>
          </div>
        </div>

        {/* Calculator 2: Can I Afford It? (5 Columns) */}
        <div className="lg:col-span-5 rounded-2xl border border-[#232b3d] bg-[#121520] p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 border-b border-[#1e2434] pb-4 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#1c2232] border border-[#283248] flex items-center justify-center text-cyan-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#f8fafc]">
                  Calculator 2: Can I afford it?
                </h2>
                <p className="text-xs text-[#8090a8]">Instant purchase feasibility check</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8090a8] flex items-center justify-between">
                  <span>Available Cash Balance</span>
                  <span className="font-mono text-[#f8fafc]">${quickCash.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  step={50000}
                  value={quickCash}
                  onChange={(e) => setQuickCash(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#161a26] border border-[#263148] text-sm text-[#f8fafc] font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8090a8] flex items-center justify-between">
                  <span>Item / Vehicle Cost</span>
                  <span className="font-mono text-[#f8fafc]">${quickPrice.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  step={50000}
                  value={quickPrice}
                  onChange={(e) => setQuickPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#161a26] border border-[#263148] text-sm text-[#f8fafc] font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Real-Time Outcome Status Badge */}
          <div
            className={`mt-6 p-5 rounded-2xl border text-center space-y-2 transition-all ${
              canAfford
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-950/20 border-rose-500/40 text-rose-400'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-base font-bold">
              {canAfford ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Yes, you can afford it!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  <span>Short on funds</span>
                </>
              )}
            </div>

            <p className="text-xs text-[#cad2e0]">
              {canAfford
                ? `You will have $${quickDiff.toLocaleString()} remaining in reserve after purchase.`
                : `You still need an additional $${quickDiff.toLocaleString()} before completing this transaction.`}
            </p>
          </div>
        </div>
      </div>

      {/* Demand Discovery Feedback on Money Planner */}
    
    </div>
  );
};
