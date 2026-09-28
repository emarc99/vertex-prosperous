import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ShieldCheck, Zap, Layers, RefreshCw, CheckCircle2, Database, Lock, TrendingUp, Sparkles, Timer, Gauge, Coins } from 'lucide-react';

export default function DeckPage() {
  return (
    <main className="min-h-screen bg-[#f1f0eb] text-[#171817]">
      {/* Top Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-black/10 px-5 py-6 lg:px-10">
        <Link href="/" className="text-xl font-bold tracking-[-.05em] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#20d477]" />
          Nova<span className="text-[#20a864]">Wealth</span>
        </Link>
        <div className="flex items-center gap-5 text-xs font-semibold uppercase tracking-[.14em]">
          <span className="hidden text-black/45 sm:block">Executive Pitch & Architecture • 2026</span>
          <Link href="/dashboard" className="px-3.5 py-1.5 rounded-full bg-[#171817] text-white hover:bg-black/80 transition-colors">
            Launch App
          </Link>
        </div>
      </header>

      {/* Slide 1: Hero */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 lg:px-10 lg:pb-24 lg:pt-28">
        <div className="flex items-center gap-2 mb-6">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#20d477]/20 text-[#15803d] border border-[#20d477]/40">
            Robinhood Chain • Paxos USDG • Arbitrum
          </span>
        </div>
        <h1 className="max-w-5xl text-6xl font-semibold leading-[.9] tracking-[-.075em] sm:text-8xl lg:text-[8.5rem]">
          Money is<br /><span className="text-[#20a864]">in motion.</span>
        </h1>
        <div className="mt-12 flex max-w-3xl items-end justify-between gap-8 border-t border-black/15 pt-6">
          <p className="text-lg leading-7 text-black/70 font-normal">
            NovaWealth is the autonomous consumer wealth copilot bridging idle cash savings and tokenized US equities with <strong className="text-black font-semibold">zero risk to initial capital</strong> and <strong className="text-black font-semibold">instant T+0 liquidity</strong>.
          </p>
          <span className="hidden text-6xl font-light text-black/15 sm:block">01</span>
        </div>
      </section>

      {/* Slide 2: The Core Thesis */}
      <section className="grid border-y border-black/10 lg:grid-cols-3">
        <div className="bg-[#d8e7a8] p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-black/60">01 / The Market Dilemma</p>
            <h2 className="mt-16 text-3xl font-semibold tracking-tight text-black">Cash is sitting still.</h2>
            <p className="mt-4 leading-7 text-black/75">
              Billions in tokenized stablecoins sit idle in cash equivalents. Retail investors are trapped between zero yield or risking their savings principal on volatile stock swings.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-black/10 text-xs font-semibold uppercase tracking-wider text-black/50">
            Friction: Capital Inefficiency
          </div>
        </div>

        <div className="bg-[#a4c1c5] p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-black/60">02 / The Mechanism</p>
            <h2 className="mt-16 text-3xl font-semibold tracking-tight text-black">Yield becomes momentum.</h2>
            <p className="mt-4 leading-7 text-black/75">
              Deposited Paxos USDG earns 8.45% APY on Morpho Blue. Our smart vault isolates accrued interest and streams it into Robinhood Stock Tokens via autonomous DCA.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-black/10 text-xs font-semibold uppercase tracking-wider text-black/50">
            Invariant: 100% Principal Protected
          </div>
        </div>

        <div className="bg-[#202420] p-8 text-white lg:p-12 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#20d477]">03 / The Experience</p>
            <h2 className="mt-16 text-3xl font-semibold tracking-tight">A calmer way to invest.</h2>
            <p className="mt-4 leading-7 text-white/70">
              1-click Biometric Passkeys (ERC-4337) and scoped session keys let the Copilot build an equity portfolio in the background with zero seed phrases and zero manual popups.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-white/10 text-xs font-semibold uppercase tracking-wider text-[#20d477]/80">
            UX: Zero Popups, Zero Seed Phrases
          </div>
        </div>
      </section>

      {/* Slide 3: Visual Execution Architecture */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-black/15 pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#20a864] mb-2">04 / Execution Architecture</p>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-[-.05em]">
              Peer-to-Pool Settlement Engine
            </h2>
          </div>
          <p className="max-w-md text-sm text-black/65">
            How NovaWealth routes autonomous DCA flows with institutional NAV pricing, zero slippage, and on-chain corporate action scaling.
          </p>
        </div>

        {/* Visual Pipeline Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Node 1 */}
          <div className="rounded-2xl bg-white border border-black/10 p-7 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#20d477]/5 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                  01
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-black/5 text-black/70">
                  NovaVault.sol
                </span>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Yield Harvest Isolator</h3>
              <p className="text-xs text-black/60 mb-4 leading-relaxed">
                Captures baseline 8.45% APY from Morpho Blue lending pools while maintaining a 15% instant T+0 liquidity buffer.
              </p>
              <div className="p-3 rounded-lg bg-[#f8f7f3] border border-black/5 text-[11px] font-mono text-black/80 space-y-1">
                <div className="flex justify-between">
                  <span className="text-black/50">Deposit Asset:</span>
                  <span className="font-semibold text-black">Paxos USDG (6 dec)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Principal Guard:</span>
                  <span className="font-semibold text-[#15803d]">Assets - Principal &gt; 0</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-black/5 text-[11px] text-black/50 flex items-center justify-between">
              <span>Siphons accrued yield only</span>
              <ArrowRight size={14} className="text-black/30" />
            </div>
          </div>

          {/* Node 2 */}
          <div className="rounded-2xl bg-white border border-black/10 p-7 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#20d477]/10 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-[#20a864] text-white text-xs font-mono font-bold flex items-center justify-center">
                  02
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#20d477]/15 text-[#15803d]">
                  StockTokenAdapter.sol
                </span>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Oracle & Multiplier Engine</h3>
              <p className="text-xs text-black/60 mb-4 leading-relaxed">
                Calculates fair-value unit conversion using 8-decimal Chainlink price feeds with Robinhood's native ERC-8056 stock split multiplier.
              </p>
              <div className="p-3 rounded-lg bg-[#f8f7f3] border border-black/5 text-[11px] font-mono text-black/80 space-y-1">
                <div className="flex justify-between">
                  <span className="text-black/50">Price Feeds:</span>
                  <span className="font-semibold text-black">Chainlink AggregatorV3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Corporate Actions:</span>
                  <span className="font-semibold text-[#15803d]">ERC-8056 uiMultiplier()</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-black/5 text-[11px] text-black/50 flex items-center justify-between">
              <span>0% AMM slippage • Exact NAV</span>
              <ArrowRight size={14} className="text-black/30" />
            </div>
          </div>

          {/* Node 3 */}
          <div className="rounded-2xl bg-[#171817] text-white p-7 flex flex-col justify-between shadow-lg relative overflow-hidden border border-black">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#20d477]/15 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-[#20d477] text-black text-xs font-mono font-bold flex items-center justify-center">
                  03
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#20d477]/20 text-[#20d477]">
                  YieldStreamer.sol
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Autonomous DCA Streamer</h3>
              <p className="text-xs text-white/70 mb-4 leading-relaxed">
                Delegated session key bot executes batch allocations across the user's custom equity basket backed by real custodial shares.
              </p>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-white/90 space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/50">Execution Mode:</span>
                  <span className="font-semibold text-[#20d477]">ERC-4337 Session Key</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Target RWAs:</span>
                  <span className="font-semibold text-white">TSLA, AMZN, AMD, NFLX, PLTR</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-white/10 text-[11px] text-[#20d477] flex items-center justify-between">
              <span>Non-custodial direct delivery</span>
              <CheckCircle2 size={14} className="text-[#20d477]" />
            </div>
          </div>
        </div>

        {/* Visual Highlights Banner */}
        <div className="rounded-2xl bg-[#202420] text-white p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#20d477] animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#20d477]">
                Architectural Invariant
              </p>
            </div>
            <h4 className="text-2xl font-bold">
              Direct Peer-to-Pool vs Fragmented Liquidity
            </h4>
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              By using Chainlink oracle pricing and routing swaps directly through regulated broker-dealer liquidity desks (<code className="text-[#20d477] text-xs">liquiditySource</code>), NovaWealth eliminates AMM price slippage, prevents MEV sandwich exploitation, and accurately tracks stock splits.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-shrink-0 text-center">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xl font-bold font-mono text-[#20d477]">0%</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider mt-1">AMM Slippage</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xl font-bold font-mono text-[#20d477]">8 Dec</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider mt-1">Oracle Precision</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
              <p className="text-xl font-bold font-mono text-[#20d477]">ERC-8056</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider mt-1">Split Scaling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 4: CAPITAL VELOCITY & INSTANT YIELD ROUTING (NEW) */}
      <section className="bg-[#e9e7e0] border-y border-black/10 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-black/15 pb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#20a864] mb-2">05 / Capital Velocity</p>
              <h2 className="text-4xl lg:text-5xl font-semibold tracking-[-.05em]">
                Eliminating TradFi &ldquo;Cash Drag&rdquo;
              </h2>
            </div>
            <p className="max-w-md text-sm text-black/65">
              Why native on-chain execution beats traditional brokerages: 100% continuous yield generation meets single-block atomic equity settlement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* TradFi Card */}
            <div className="rounded-2xl border border-black/15 bg-white/80 p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-black/60 bg-black/5 px-3 py-1 rounded-full font-mono">
                    TradFi Brokerage Model
                  </span>
                  <Timer size={20} className="text-black/40" />
                </div>
                <h3 className="text-2xl font-semibold text-black mb-3">Pre-Funding Friction</h3>
                <p className="text-sm text-black/75 mb-6 leading-relaxed">
                  In traditional finance brokerages, running an automated DCA script or trigger-order requires keeping capital <strong>idle and unproductive</strong> in your account to ensure execution upon price triggers.
                </p>
                <div className="space-y-3 border-t border-black/10 pt-4 text-xs text-black/70">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span><strong>Dead Capital Drag:</strong> Uninvested cash loses purchasing power to inflation.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span><strong>Fragmented Settlement:</strong> Banking (ACH) and clearing (DTCC) take T+1 to T+2.</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-black/10 text-xs font-mono text-black/50">
                Capital Velocity: Impaired by idle reserves
              </div>
            </div>

            {/* NovaWealth Card */}
            <div className="rounded-2xl border border-[#20d477]/50 bg-[#171817] text-white p-8 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#20d477] bg-[#20d477]/15 px-3 py-1 rounded-full font-mono border border-[#20d477]/30">
                    NovaWealth On-Chain Engine
                  </span>
                  <Gauge size={20} className="text-[#20d477]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Instant Yield Routing</h3>
                <p className="text-sm text-white/80 mb-6 leading-relaxed">
                  Capital is <strong>never idle for a single block</strong>. 100% of deposited USDG generates 8.45% APY in Morpho Blue until the exact transaction the copilot atomically harvests yield and settles stock tokens.
                </p>
                <div className="space-y-3 border-t border-white/10 pt-4 text-xs text-white/85">
                  <div className="flex items-center gap-2">
                    <span className="text-[#20d477] font-bold">✓</span>
                    <span><strong>Uninterrupted Compounding:</strong> Principal stays in the lending vault 24/7.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#20d477] font-bold">✓</span>
                    <span><strong>Single-Block Atomicity:</strong> Pull, oracle valuation, and token delivery happen in 1 tx.</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-[#20d477] flex items-center justify-between">
                <span>Capital Velocity: 100% Max Efficiency</span>
                <span className="text-white/40">Robinhood Chain Native</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 5: Mathematical Safeguards & Instant T+0 Liquidity */}
      <section className="bg-white border-y border-black/10 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#20a864] mb-2">06 / Protocol Invariants</p>
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-[-.05em] mb-12">
            Engineered for consumer trust.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-black/10 bg-[#f8f7f3]">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-4">
                <ShieldCheck size={20} className="text-[#20d477]" />
              </div>
              <h4 className="text-lg font-bold mb-2">Zero-Principal-Risk Invariant</h4>
              <p className="text-xs font-mono bg-white p-2 rounded border border-black/10 text-black/80 mb-3">
                Yield = max(0, totalAssets - totalPrincipal)
              </p>
              <p className="text-sm text-black/70">
                The smart contract makes it mathematically impossible for the DCA streamer to touch original deposit capital. If yield is $0, the stream pauses automatically.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-black/10 bg-[#f8f7f3]">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-4">
                <Zap size={20} className="text-[#20d477]" />
              </div>
              <h4 className="text-lg font-bold mb-2">Instant T+0 Liquidity Buffer</h4>
              <p className="text-xs font-mono bg-white p-2 rounded border border-black/10 text-black/80 mb-3">
                15% Liquid Buffer / 85% Morpho Pool
              </p>
              <p className="text-sm text-black/70">
                Solves the classic RWA dilemma where funds take 30–180 days to redeem. Users can withdraw cash instantly 24/7/365 with zero settlement delay.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-black/10 bg-[#f8f7f3]">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-4">
                <Lock size={20} className="text-[#20d477]" />
              </div>
              <h4 className="text-lg font-bold mb-2">Scoped ERC-4337 Session Keys</h4>
              <p className="text-xs font-mono bg-white p-2 rounded border border-black/10 text-black/80 mb-3">
                Daily Spend Caps & Non-Custodial
              </p>
              <p className="text-sm text-black/70">
                The user delegates daily spending limits to the Nova autonomous bot. The bot executes DCA yield batches on-chain without requesting repetitive transaction signatures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 6: Market Opportunity & Traction */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[1fr_1.5fr] lg:px-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#20a864]">Market Opportunity</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
            Built for retail adoption.
          </h2>
          <p className="mt-4 text-black/65 text-base">
            While previous hackathons built institutional hedge-fund tools, NovaWealth is designed from the ground up for the everyday consumer seeking automated equity accumulation.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="border-t border-black/15 pt-5">
            <p className="text-5xl font-semibold tracking-[-.06em]">28.6M</p>
            <p className="mt-3 text-sm text-black/60">Retail investors on Robinhood primed for automated stablecoin-to-equity DCA.</p>
          </div>
          <div className="border-t border-black/15 pt-5">
            <p className="text-5xl font-semibold tracking-[-.06em]">8.45%</p>
            <p className="mt-3 text-sm text-black/60">Baseline Morpho Blue lending APY converting idle savings into stock tokens.</p>
          </div>
          <div className="border-t border-black/15 pt-5">
            <p className="text-5xl font-semibold tracking-[-.06em]">T+0</p>
            <p className="mt-3 text-sm text-black/60">Instant liquidity fronting eliminating multi-day RWA lockup delays.</p>
          </div>
          <div className="border-t border-black/15 pt-5">
            <p className="text-5xl font-semibold tracking-[-.06em]">$0 Risk</p>
            <p className="mt-3 text-sm text-black/60">Savings principal mathematically isolated from stock volatility.</p>
          </div>

          <div className="col-span-full mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full bg-[#171817] px-6 py-3 text-sm font-semibold text-white hover:bg-black/80 transition-all shadow-md"
            >
              Launch Live Dashboard <ArrowUpRight className="ml-2" size={16} />
            </Link>
            <Link
              href="/vault"
              className="inline-flex items-center rounded-full border border-black/20 bg-transparent px-6 py-3 text-sm font-semibold text-black hover:bg-black/5 transition-all"
            >
              Test Smart Vault & Yield Injector <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 px-5 py-8 text-xs text-black/50 lg:px-10">
        <span>NovaWealth • Built for the Arbitrum Open House Singapore Buildathon</span>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold text-black hover:text-[#20a864]">Dashboard</Link>
          <Link href="/vault" className="font-semibold text-black hover:text-[#20a864]">Smart Vault</Link>
          <Link href="/stream" className="font-semibold text-black hover:text-[#20a864]">Equity Studio</Link>
          <Link href="/" className="font-semibold text-black hover:text-[#20a864] flex items-center gap-1">
            Home <ArrowRight size={13} />
          </Link>
        </div>
      </footer>
    </main>
  );
}
