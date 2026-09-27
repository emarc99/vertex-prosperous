'use client';

import { Navigation } from '@/components/nav';
import { TrendingUp, ArrowRight, Activity, ShieldCheck, Clock, Zap, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import deployedInfo from '@/contracts/deployed.json';

export default function Dashboard() {
  const [totalYield, setTotalYield] = useState<number>(34.20);
  const [walletBalance, setWalletBalance] = useState<{ usdg: number; nvUSDG: number }>({
    usdg: 100.0,
    nvUSDG: 8200.0,
  });

  // Ticking yield simulation based on 8.45% APY
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalYield((prev) => prev + 0.000022);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navigation />
      <main className="lg:ml-64 min-h-screen bg-background pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Dashboard
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                  Robinhood Chain (46630)
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your wealth at a glance. Idle cash transformed into active growth.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground">
                <Clock size={13} className="text-accent" />
                <span>Instant T+0 Liquidity Buffer Active</span>
              </div>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Wealth */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm text-muted-foreground font-medium">
                  Total Wealth
                </p>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp size={20} className="text-accent" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">
                  ${(walletBalance.nvUSDG + 4250 + totalYield).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-accent font-medium flex items-center gap-1">
                  <span>+$145.20 this week (8.45% APY)</span>
                </p>
              </div>
            </div>

            {/* USDG Balance */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground font-medium mb-4">
                Smart Cash (nvUSDG Vault)
              </p>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">
                  ${walletBalance.nvUSDG.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  100% Principal Protected • T+0 Liquid
                </p>
              </div>
            </div>

            {/* Equity Holdings */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground font-medium mb-4">
                Robinhood Stock Tokens
              </p>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-accent">$4,250.00</p>
                <p className="text-xs text-muted-foreground">
                  5 RWA Assets (TSLA, AMZN, AMD, NFLX, PLTR)
                </p>
              </div>
            </div>

            {/* This Month Yield */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground font-medium mb-4">
                Accrued Yield (Live)
              </p>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground font-mono">
                  ${totalYield.toFixed(4)}
                </p>
                <p className="text-xs text-accent font-medium flex items-center gap-1">
                  <Zap size={12} /> Auto-streaming into TSLA / AMZN
                </p>
              </div>
            </div>
          </div>

          {/* Yield to Equity Flow Animation Card */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Yield Flow Architecture
                </h2>
                <p className="text-sm text-muted-foreground">
                  Watch your Paxos USDG yield continuously stream into Robinhood Stock Tokens
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Activity size={20} className="text-accent animate-pulse" />
              </div>
            </div>

            {/* Flow Visual */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div className="bg-secondary/70 border border-border p-4 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground font-medium">Step 1: Lending Yield</p>
                  <p className="text-sm font-bold text-foreground mt-1">NovaVault (nvUSDG)</p>
                  <p className="text-[11px] text-accent mt-0.5">8.45% APY on Morpho Blue</p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                    <span>Accrued Yield Only</span>
                    <ArrowRight size={14} />
                  </div>
                </div>

                <div className="bg-secondary/70 border border-border p-4 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground font-medium">Step 2: Autonomous DCA</p>
                  <p className="text-sm font-bold text-accent mt-1">YieldStreamer.sol</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">ERC-4337 Session Key Bot</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-accent" />
                <span>Your USDG principal is 100% safe. Only harvested yield streams into equities.</span>
              </div>
              <a
                href={`${deployedInfo.blockExplorer}/address/${deployedInfo.contracts.NovaVault}`}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline flex items-center gap-1 font-medium"
              >
                View NovaVault on Explorer <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/vault"
              className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 hover:bg-secondary/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground text-lg">Smart Vault</h3>
                <ArrowRight
                  size={20}
                  className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-transform"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Deposit Paxos USDG, earn 8.45% APY, and withdraw instantly with T+0 guaranteed liquidity.
              </p>
            </Link>

            <Link
              href="/stream"
              className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 hover:bg-secondary/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground text-lg">Equity Studio</h3>
                <ArrowRight
                  size={20}
                  className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-transform"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Configure your auto-DCA basket across Robinhood Stock Tokens (TSLA, AMZN, AMD, NFLX, PLTR).
              </p>
            </Link>

            <Link
              href="/copilot"
              className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 hover:bg-secondary/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground text-lg">AI Wealth Copilot</h3>
                <ArrowRight
                  size={20}
                  className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-transform"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Chat with your autonomous wealth advisor. Query portfolio yield, rebalance, and inspect telemetry.
              </p>
            </Link>

            <Link
              href="/auth"
              className="bg-accent text-primary-foreground border border-accent rounded-lg p-6 hover:bg-accent/90 transition-all group cursor-pointer shadow-lg shadow-accent/15"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">Biometric Passkey</h3>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm font-medium opacity-90">
                1-click FaceID / TouchID session key authorization with zero seed phrases and gas sponsorship.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
