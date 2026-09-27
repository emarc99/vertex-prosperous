'use client';

import { Navigation } from '@/components/nav';
import { TrendingUp, ArrowRight, Activity, ShieldCheck, Clock, Zap, ExternalLink, RefreshCw, Database, Radio } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import deployedInfo from '@/contracts/deployed.json';

const VAULT_ABI = [
  "function totalAssets() external view returns (uint256)",
  "function totalPrincipalDeposited() external view returns (uint256)",
  "function accruedYield() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

export default function Dashboard() {
  // Mode toggle: 'live' queries Robinhood Chain Testnet contracts directly; 'demo' shows simulated portfolio
  const [dataSource, setDataSource] = useState<'live' | 'demo'>('live');

  // Real On-Chain Contract State (queried directly from Robinhood Chain RPC)
  const [onchainData, setOnchainData] = useState<{
    accruedYield: number;
    totalPrincipal: number;
    totalAssets: number;
    userShares: number;
    loading: boolean;
    lastUpdated: string;
  }>({
    accruedYield: 0.0,
    totalPrincipal: 0.0,
    totalAssets: 0.0,
    userShares: 0.0,
    loading: true,
    lastUpdated: 'Fetching on-chain data...'
  });

  // Simulated Demo Portfolio State
  const [demoYield, setDemoYield] = useState<number>(34.20);
  const demoPrincipal = 8200.0;
  const demoEquities = 4250.0;

  // 1. Fetch Real On-Chain Data from Robinhood Chain Testnet (46630)
  const fetchOnchainData = async () => {
    setOnchainData(prev => ({ ...prev, loading: true }));
    try {
      const provider = new ethers.JsonRpcProvider(deployedInfo.rpcUrl);
      const vault = new ethers.Contract(deployedInfo.contracts.NovaVault, VAULT_ABI, provider);

      const [rawAccrued, rawPrincipal, rawAssets] = await Promise.all([
        vault.accruedYield().catch(() => BigInt(0)),
        vault.totalPrincipalDeposited().catch(() => BigInt(0)),
        vault.totalAssets().catch(() => BigInt(0)),
      ]);

      const accrued = parseFloat(ethers.formatUnits(rawAccrued, 6));
      const principal = parseFloat(ethers.formatUnits(rawPrincipal, 6));
      const assets = parseFloat(ethers.formatUnits(rawAssets, 6));

      // Check if user has connected address in localStorage
      let userShares = 0.0;
      if (typeof window !== 'undefined') {
        const storedAddr = localStorage.getItem('nova_user_address');
        if (storedAddr && ethers.isAddress(storedAddr)) {
          const rawUserShares = await vault.balanceOf(storedAddr).catch(() => BigInt(0));
          userShares = parseFloat(ethers.formatUnits(rawUserShares, 6));
        }
      }

      setOnchainData({
        accruedYield: accrued,
        totalPrincipal: principal,
        totalAssets: assets,
        userShares,
        loading: false,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    } catch (err: any) {
      console.warn("Could not query Robinhood RPC, using cached state:", err.message);
      setOnchainData(prev => ({ ...prev, loading: false, lastUpdated: 'Network query error' }));
    }
  };

  useEffect(() => {
    fetchOnchainData();
    const interval = setInterval(fetchOnchainData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // 2. Demo APY Compounding Ticker (Only active when dataSource === 'demo')
  useEffect(() => {
    if (dataSource !== 'demo') return;
    const timer = setInterval(() => {
      setDemoYield((prev) => prev + 0.000022); // simulates 8.45% APY continuous compounding
    }, 1000);
    return () => clearInterval(timer);
  }, [dataSource]);

  // Derived display values depending on selected mode
  const isLive = dataSource === 'live';
  const displayYield = isLive ? onchainData.accruedYield : demoYield;
  const displayPrincipal = isLive ? onchainData.totalPrincipal : demoPrincipal;
  const displayEquities = isLive ? 0.0 : demoEquities;
  const displayTotalWealth = isLive
    ? onchainData.totalAssets
    : (demoPrincipal + demoEquities + demoYield);

  return (
    <>
      <Navigation />
      <main className="lg:ml-64 min-h-screen bg-background pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl">
          {/* Header & Source Mode Toggle */}
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
                Autonomous wealth layer activating idle USDG savings into Robinhood Stock Tokens.
              </p>
            </div>

            {/* Source Toggle: Live On-Chain vs Demo Simulation */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-card border border-border rounded-lg p-1">
                <button
                  onClick={() => setDataSource('live')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    isLive
                      ? 'bg-accent text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Radio size={13} className={isLive ? 'animate-pulse' : ''} />
                  <span>Live On-Chain RPC</span>
                </button>
                <button
                  onClick={() => setDataSource('demo')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    !isLive
                      ? 'bg-secondary border border-accent/40 text-accent shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TrendingUp size={13} />
                  <span>Demo APY Projection</span>
                </button>
              </div>

              {isLive && (
                <button
                  onClick={fetchOnchainData}
                  disabled={onchainData.loading}
                  title="Refresh onchain contract data"
                  className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-accent transition-colors"
                >
                  <RefreshCw size={14} className={onchainData.loading ? 'animate-spin text-accent' : ''} />
                </button>
              )}
            </div>
          </div>

          {/* Mode Explanatory Notice */}
          <div className="mb-6 p-3 rounded-lg border text-xs flex flex-wrap items-center justify-between gap-3 bg-card border-border">
            <div className="flex items-center gap-2">
              {isLive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
                  <span className="text-foreground font-medium">
                    Connected directly to live NovaVault smart contract:
                  </span>
                  <a
                    href={`${deployedInfo.blockExplorer}/address/${deployedInfo.contracts.NovaVault}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-accent hover:underline flex items-center gap-1"
                  >
                    {deployedInfo.contracts.NovaVault.slice(0, 6)}...{deployedInfo.contracts.NovaVault.slice(-4)} <ExternalLink size={11} />
                  </a>
                </>
              ) : (
                <>
                  <Zap size={14} className="text-accent flex-shrink-0" />
                  <span className="text-foreground font-medium">
                    Demo Mode Active: Simulating continuous 8.45% APY compounding on a sample $8,200 USDG portfolio.
                  </span>
                </>
              )}
            </div>

            <span className="text-[11px] text-muted-foreground">
              {isLive ? `Last synced: ${onchainData.lastUpdated}` : 'Compounding: +$0.000022 / sec'}
            </span>
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
                  ${displayTotalWealth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-accent font-medium">
                  {isLive ? "Onchain assets in vault" : "+$145.20 this week (8.45% APY)"}
                </p>
              </div>
            </div>

            {/* USDG Vault Principal */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground font-medium mb-4">
                Smart Cash Principal (USDG)
              </p>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">
                  ${displayPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isLive ? "NovaVault.totalPrincipalDeposited" : "100% Principal Protected • T+0 Liquid"}
                </p>
              </div>
            </div>

            {/* Equity Holdings */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground font-medium mb-4">
                Robinhood Stock Tokens
              </p>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-accent">
                  ${displayEquities.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  5 RWA Assets (TSLA, AMZN, AMD, NFLX, PLTR)
                </p>
              </div>
            </div>

            {/* Accrued Yield */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground font-medium">
                  Accrued Yield {isLive ? "(Live On-Chain)" : "(Projected)"}
                </p>
                {isLive && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                    REAL
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground font-mono">
                  ${isLive ? displayYield.toFixed(2) : displayYield.toFixed(4)}
                </p>
                <p className="text-xs text-accent font-medium flex items-center gap-1">
                  {isLive ? (
                    displayYield > 0 ? "Ready for autonomous DCA" : "Deposit in Smart Vault to accrue yield"
                  ) : (
                    <span>Auto-streaming into TSLA / AMZN</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* If onchain yield is 0, give quick action to deposit or inject testnet yield */}
          {isLive && onchainData.accruedYield === 0 && (
            <div className="mb-8 p-4 rounded-xl bg-secondary/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <Database size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Want to see on-chain yield accrue live?</p>
                  <p className="text-xs text-muted-foreground">
                    Visit the Smart Vault tab to deposit testnet USDG or inject simulated yield with 1 click.
                  </p>
                </div>
              </div>
              <Link
                href="/vault"
                className="px-4 py-2 rounded-lg bg-accent text-primary-foreground text-xs font-bold hover:bg-accent/90 transition-colors w-fit flex items-center gap-1.5 flex-shrink-0"
              >
                Go to Smart Vault <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Yield Flow Architecture Visualizer */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Yield Flow Architecture
                </h2>
                <p className="text-sm text-muted-foreground">
                  How Paxos USDG lending interest streams into Robinhood Stock Tokens with zero principal risk
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Activity size={20} className="text-accent animate-pulse" />
              </div>
            </div>

            {/* Visual Step-by-Step */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div className="bg-secondary/70 border border-border p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground font-medium">Step 1: Cash Savings</p>
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

            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-accent" />
                <span>Zero Principal Risk: Only yield above deposit capital is eligible for DCA streaming.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-accent" />
                <span>15% T+0 Liquidity Buffer Active</span>
              </div>
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
