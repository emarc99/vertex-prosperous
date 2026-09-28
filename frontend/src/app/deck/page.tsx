import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ShieldCheck, Zap, Layers, RefreshCw, CheckCircle2, XCircle, Database, Lock } from 'lucide-react';

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

      {/* Slide 3: KEY ARCHITECTURAL DIFFERENTIATOR — WHY NO AMMs OR UNISWAP */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-black/15 pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#20a864] mb-2">04 / Execution Architecture</p>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-[-.05em]">
              Why we rejected AMMs & Uniswap.
            </h2>
          </div>
          <p className="max-w-md text-sm text-black/65">
            Tokenized equities require institutional NAV accuracy. Relying on crypto AMMs breaks corporate actions and extracts toxic slippage from retail users.
          </p>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card A: The AMM Pitfall */}
          <div className="rounded-2xl border border-red-200 bg-red-50/40 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 px-3 py-1 rounded-full">
                  Legacy AMM Model (Uniswap x · y = k)
                </span>
                <XCircle size={22} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-black mb-4">Why AMMs Fail for RWA Stocks</h3>
              <ul className="space-y-4 text-sm text-black/75">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-red-500 mt-0.5">✕</span>
                  <span><strong>High Slippage & Thin Liquidity:</strong> On-chain equity token pools have shallow depth, penalizing small retail DCA streams with massive price impact.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-red-500 mt-0.5">✕</span>
                  <span><strong>Predatory MEV Sandwiching:</strong> Automated DCA transactions on public AMMs are predictable targets for searcher bots to extract value.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-red-500 mt-0.5">✕</span>
                  <span><strong>Incompatible with Corporate Splits:</strong> When TSLA splits 3-for-1, an AMM pool cannot adjust reserves without causing catastrophic balance distortion.</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-red-200 text-xs text-red-700 font-medium">
              Result: Unpredictable pricing, capital leakage, and broken accounting.
            </div>
          </div>

          {/* Card B: NovaWealth's Solution */}
          <div className="rounded-2xl border border-[#20d477]/40 bg-[#171817] text-white p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#20d477] bg-[#20d477]/15 px-3 py-1 rounded-full border border-[#20d477]/30">
                  NovaWealth Peer-to-Pool Model
                </span>
                <CheckCircle2 size={22} className="text-[#20d477]" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Oracle-Priced Direct Settlement</h3>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#20d477] mt-0.5">✓</span>
                  <span><strong>Chainlink AggregatorV3 (8 Decimals):</strong> Precise real-time market NAV execution with <em>zero price impact</em> and <em>zero AMM slippage</em>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#20d477] mt-0.5">✓</span>
                  <span><strong>Native ERC-8056 Support:</strong> Dynamic scaling via <code className="text-[#20d477] text-xs">uiMultiplier()</code> calculates stock splits onchain without modifying reserve supplies.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#20d477] mt-0.5">✓</span>
                  <span><strong>Regulated Primary Desk Routing:</strong> Swaps route through institutional liquidity providers (<code className="text-[#20d477] text-xs">liquiditySource</code>) backed 1:1 by real custodial shares.</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-[#20d477] font-medium flex items-center justify-between">
              <span>Result: Institutional accuracy with zero MEV exploitation.</span>
              <span className="font-mono text-[11px] text-white/40">StockTokenAdapter.sol</span>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 4: Mathematical Safeguards & Instant T+0 Liquidity */}
      <section className="bg-white border-y border-black/10 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#20a864] mb-2">05 / Protocol Invariants</p>
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

      {/* Slide 5: Market Opportunity & Traction */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[1fr_1.5fr] lg:px-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#20a864]">Market Opportunity</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
            Built for retail adoption.
          </h2>
          <p className="mt-4 text-black/65 text-base">
            While previous hackathons built institutional prime-broker tools, NovaWealth is designed from the ground up for the everyday consumer seeking automated equity accumulation.
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
            <p className="text-5xl font-semibold tracking-[-.06em]">10/10</p>
            <p className="mt-3 text-sm text-black/60">Verified passing smart contract tests on Robinhood Chain Testnet (46630).</p>
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
