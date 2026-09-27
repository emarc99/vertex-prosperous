'use client';

import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck, Sparkles, TrendingUp, WalletCards, Zap, Droplets } from 'lucide-react';
import deployedInfo from '../contracts/deployed.json';

const features = [
  {
    icon: WalletCards,
    title: 'Smart Cash (Paxos USDG)',
    text: 'Deposit Paxos USDG into our ERC-4626 vault with 8.45% APY on Morpho Blue and guaranteed T+0 instant liquidity on Robinhood Chain.'
  },
  {
    icon: TrendingUp,
    title: 'Invest from the Upside',
    text: 'Harvested yield automatically streams via DCA into Robinhood Stock Tokens (TSLA, AMZN, AMD, NFLX, PLTR). Your principal is 100% safeguarded.'
  },
  {
    icon: ShieldCheck,
    title: 'Biometric Passkeys (ERC-4337)',
    text: 'Zero seed phrases, 100% gas-sponsored transactions, and scoped session keys that let the autonomous copilot trade without signature popups.'
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      {/* Top Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-10">
        <Link href="/" className="text-xl font-bold tracking-[-0.04em] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          Nova<span className="text-accent">Wealth</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
          <Link href="/vault" className="transition-colors hover:text-foreground">Smart Vault</Link>
          <Link href="/stream" className="transition-colors hover:text-foreground">Equity Studio</Link>
          <Link href="/copilot" className="transition-colors hover:text-foreground">AI Copilot</Link>
          <Link href="/deck" className="transition-colors hover:text-foreground">Briefing Deck</Link>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://faucet.paxos.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-accent border border-accent/30 rounded-full hover:bg-accent/10"
          >
            <Droplets size={13} /> USDG Faucet
          </a>
          <Link
            href="/dashboard"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Launch App <ArrowRight className="ml-1 inline" size={15} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-12 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pb-36 lg:pt-20">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-medium text-accent">
            <Sparkles size={13} /> Robinhood Chain • Autonomous RWA Copilot
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[.96] tracking-[-0.065em] sm:text-7xl lg:text-[6.2rem]">
            Make your money <span className="text-accent">move.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
            NovaWealth activates idle stablecoin savings with Morpho Blue yields, instant T+0 liquidity, and automated zero-risk DCA into Robinhood Stock Tokens.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
            >
              Open Dashboard <ArrowRight className="ml-2 inline" size={16} />
            </Link>
            <Link
              href="/vault"
              className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold hover:border-accent/60 bg-card"
            >
              Explore Smart Vault
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground flex items-center gap-2">
            <Check size={14} className="text-accent" /> 100% Principal Protected • Live on Robinhood Chain Testnet (46630)
          </p>
        </div>

        {/* Hero Interactive Card */}
        <div className="relative mx-auto w-full max-w-[440px] lg:justify-self-end">
          <div className="absolute -inset-10 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-border bg-card p-6 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-sm font-semibold text-foreground">Your Portfolio in Motion</span>
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent border border-accent/30 animate-pulse">
                LIVE ONCHAIN
              </span>
            </div>
            <div className="py-8">
              <p className="text-xs uppercase tracking-[.18em] text-muted-foreground font-medium">Total Wealth</p>
              <p className="mt-2 text-5xl font-bold tracking-[-.06em] text-foreground">
                $10,250<span className="text-lg text-muted-foreground">.00</span>
              </p>
              <p className="mt-2 text-sm font-medium text-accent flex items-center gap-1">
                <TrendingUp size={15} /> +$250.00 accrued yield streamed
              </p>
            </div>

            {/* Sparkline Visual */}
            <div className="flex h-24 items-end gap-2 border-b border-border pb-3">
              {[32, 45, 38, 62, 54, 78, 68, 90, 84, 100].map((height, index) => (
                <div key={index} className="flex-1 rounded-t-sm bg-accent/20" style={{ height: `${height}%` }}>
                  <div className="h-1/2 w-full rounded-t-sm bg-accent" />
                </div>
              ))}
            </div>

            {/* Mini breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-5">
              <div className="rounded-xl bg-secondary p-3">
                <p className="text-[11px] text-muted-foreground">Cash Principal</p>
                <p className="mt-1 font-semibold text-foreground">$10,000.00 USDG</p>
              </div>
              <div className="rounded-xl bg-secondary p-3">
                <p className="text-[11px] text-muted-foreground">RWA Equities</p>
                <p className="mt-1 font-semibold text-accent">TSLA, AMZN, AMD</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-px bg-border px-5 lg:grid-cols-3 lg:px-10">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-background px-6 py-12 lg:px-8">
              <Icon className="mb-6 text-accent" size={24} />
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="mx-auto grid max-w-7xl gap-10 px-5 py-24 lg:grid-cols-[.7fr_1.3fr] lg:px-10">
        <div>
          <p className="text-sm font-semibold text-accent uppercase tracking-wider">A Clearer Path Forward</p>
          <h2 className="mt-3 max-w-md text-4xl font-semibold tracking-[-.05em] sm:text-5xl text-foreground">
            One system. Every next move.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            NovaWealth eliminates the friction between DeFi yield and tokenized equities.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { step: '01', title: 'Deposit USDG', desc: 'Move idle stablecoins into NovaVault to earn 8.45% baseline lending yield with T+0 instant redemptions.' },
            { step: '02', title: 'Set Target Basket', desc: 'Choose your desired Robinhood Stock Token allocations (TSLA, AMZN, AMD, NFLX, PLTR).' },
            { step: '03', title: 'Automated Stream', desc: 'Yield streams automatically into equities via scoped session keys. Zero risk to your principal.' }
          ].map((item) => (
            <div key={item.step} className="border-t border-border pt-5">
              <span className="text-xs font-mono font-bold text-accent">{item.step}</span>
              <h3 className="mt-6 font-semibold text-foreground text-lg">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-8 lg:px-10 bg-card/20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 NovaWealth • Built for the Arbitrum Open House Singapore Buildathon</span>
          <div className="flex items-center gap-4">
            <span>Robinhood Chain (46630)</span>
            <span>Paxos USDG</span>
            <Link href="/deck" className="hover:text-foreground">Briefing Deck</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
