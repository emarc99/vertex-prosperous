import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export default function DeckPage() {
  return (
    <main className="min-h-screen bg-[#f1f0eb] text-[#171817]">
      <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-black/10 px-5 py-6 lg:px-10">
        <Link href="/" className="text-xl font-bold tracking-[-.05em]">
          Nova<span className="text-[#20d477]">Wealth</span>
        </Link>
        <div className="flex items-center gap-5 text-xs font-semibold uppercase tracking-[.14em]">
          <span className="hidden text-black/45 sm:block">Investor Briefing • 2026</span>
          <Link href="/" className="hover:text-[#20a864]">Back to site</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-24 lg:px-10 lg:pb-32 lg:pt-36">
        <p className="mb-7 text-xs font-bold uppercase tracking-[.18em] text-[#20a864]">The wealth layer for modern money</p>
        <h1 className="max-w-5xl text-6xl font-semibold leading-[.9] tracking-[-.075em] sm:text-8xl lg:text-[9.5rem]">
          Money is<br/><span className="text-[#20a864]">in motion.</span>
        </h1>
        <div className="mt-12 flex max-w-2xl items-end justify-between gap-8 border-t border-black/15 pt-6">
          <p className="text-lg leading-7 text-black/65">
            NovaWealth turns passive cash into an intelligent, compounding system for the next generation of investors on Robinhood Chain.
          </p>
          <span className="hidden text-6xl font-light text-black/15 sm:block">01</span>
        </div>
      </section>

      <section className="grid border-y border-black/10 lg:grid-cols-3">
        <div className="bg-[#d8e7a8] p-8 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-widest">01 / The gap</p>
          <h2 className="mt-28 text-3xl font-semibold tracking-tight">Cash is sitting still.</h2>
          <p className="mt-4 leading-7 text-black/65">
            Billions in stablecoins sit idle onchain earning sub-optimal returns, while retail investors face unnecessary risk to their savings principal.
          </p>
        </div>
        <div className="bg-[#a4c1c5] p-8 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-widest">02 / The answer</p>
          <h2 className="mt-28 text-3xl font-semibold tracking-tight">Yield becomes momentum.</h2>
          <p className="mt-4 leading-7 text-black/65">
            Our Smart Vault protects principal while harvested yield automatically streams into tokenized Robinhood Stock Tokens via autonomous DCA.
          </p>
        </div>
        <div className="bg-[#202420] p-8 text-white lg:p-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#20d477]">03 / The unlock</p>
          <h2 className="mt-28 text-3xl font-semibold tracking-tight">A calmer way to grow.</h2>
          <p className="mt-4 leading-7 text-white/60">
            Clear defaults, intelligent automation, and a copilot that makes every next move feel effortless and safe.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[1fr_1.5fr] lg:px-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#20a864]">Why now</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
            The next generation wants more from money.
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="border-t border-black/15 pt-5">
            <p className="text-5xl font-semibold tracking-[-.06em]">$5T+</p>
            <p className="mt-3 text-sm text-black/60">Cash held by US households in low-yield accounts.</p>
          </div>
          <div className="border-t border-black/15 pt-5">
            <p className="text-5xl font-semibold tracking-[-.06em]">1 system</p>
            <p className="mt-3 text-sm text-black/60">The simple mental model people have been waiting for.</p>
          </div>
          <Link
            href="/dashboard"
            className="col-span-full mt-8 inline-flex w-fit items-center rounded-full bg-[#171817] px-6 py-3 text-sm font-semibold text-white hover:bg-black/80"
          >
            Explore the Product <ArrowUpRight className="ml-2" size={16}/>
          </Link>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 px-5 py-8 text-xs text-black/50 lg:px-10">
        <span>NovaWealth • Built for the Arbitrum Open House Singapore Buildathon</span>
        <Link href="/" className="font-semibold text-black hover:text-[#20a864] flex items-center gap-1">
          Back to Home <ArrowRight size={13}/>
        </Link>
      </footer>
    </main>
  );
}
