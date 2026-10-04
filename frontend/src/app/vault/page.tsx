'use client';

import { Navigation } from '@/components/nav';
import { Wallet, TrendingUp, Lock, Clock, ArrowUpRight, ArrowDownLeft, Sparkles, Droplets, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ethers } from 'ethers';
import deployedInfo from '@/contracts/deployed.json';

const VAULT_ABI = [
  "function deposit(uint256 assets, address receiver) external returns (uint256)",
  "function withdraw(uint256 assets, address receiver, address owner) external returns (uint256)",
  "function injectYield(uint256 amount) external",
  "function totalAssets() external view returns (uint256)",
  "function totalPrincipalDeposited() external view returns (uint256)",
  "function accruedYield() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
];

export default function VaultPage() {
  const [tab, setTab] = useState<'deposit' | 'withdraw' | 'yield'>('deposit');
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [userBalance, setUserBalance] = useState({
    shares: 8200.0,
    accruedYield: 34.20,
    usdgWallet: 100.0
  });

  const handleAction = async () => {
    setLoading(true);
    setStatusMsg(null);

    try {
      const numAmount = parseFloat(amount || "0");
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }

      if (typeof window !== "undefined" && (window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const userAddr = await signer.getAddress();

        const vault = new ethers.Contract(deployedInfo.contracts.NovaVault, VAULT_ABI, signer);
        const usdg = new ethers.Contract(deployedInfo.contracts.USDG, ERC20_ABI, signer);
        const parsedAmount = ethers.parseUnits(amount, 6);

        if (tab === 'deposit') {
          setStatusMsg({ text: "Approving USDG spend..." });
          const appTx = await usdg.approve(deployedInfo.contracts.NovaVault, parsedAmount);
          await appTx.wait(1);

          setStatusMsg({ text: "Depositing into NovaVault..." });
          const depTx = await vault.deposit(parsedAmount, userAddr);
          await depTx.wait(1);

          setUserBalance(prev => ({
            ...prev,
            shares: prev.shares + numAmount,
            usdgWallet: Math.max(0, prev.usdgWallet - numAmount)
          }));
          setStatusMsg({ text: `✓ Successfully deposited $${numAmount} USDG into NovaVault! Tx: ${depTx.hash.slice(0, 10)}...` });
        } else if (tab === 'withdraw') {
          setStatusMsg({ text: "Redeeming USDG at T+0..." });
          const withTx = await vault.withdraw(parsedAmount, userAddr, userAddr);
          await withTx.wait(1);

          setUserBalance(prev => ({
            ...prev,
            shares: Math.max(0, prev.shares - numAmount),
            usdgWallet: prev.usdgWallet + numAmount
          }));
          setStatusMsg({ text: `✓ Successfully redeemed $${numAmount} USDG instantly at T+0!` });
        } else if (tab === 'yield') {
          setStatusMsg({ text: "Injecting simulated lending yield..." });
          const appTx = await usdg.approve(deployedInfo.contracts.NovaVault, parsedAmount);
          await appTx.wait(1);
          const injTx = await vault.injectYield(parsedAmount);
          await injTx.wait(1);

          setUserBalance(prev => ({ ...prev, accruedYield: prev.accruedYield + numAmount }));
          setStatusMsg({ text: `✓ Injected $${numAmount} USDG yield into vault buffer! Ready for auto-DCA.` });
        }
      } else {
        // Graceful state simulation
        if (tab === 'deposit') {
          setUserBalance(prev => ({
            ...prev,
            shares: prev.shares + numAmount,
            usdgWallet: Math.max(0, prev.usdgWallet - numAmount)
          }));
          setStatusMsg({ text: `✓ Simulated deposit of $${numAmount} USDG into NovaVault.` });
        } else if (tab === 'withdraw') {
          setUserBalance(prev => ({
            ...prev,
            shares: Math.max(0, prev.shares - numAmount),
            usdgWallet: prev.usdgWallet + numAmount
          }));
          setStatusMsg({ text: `✓ Simulated T+0 instant redemption of $${numAmount} USDG.` });
        } else {
          setUserBalance(prev => ({ ...prev, accruedYield: prev.accruedYield + numAmount }));
          setStatusMsg({ text: `✓ Simulated yield harvest of $${numAmount} USDG!` });
        }
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ text: err.reason || err.message || "Transaction cancelled", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="lg:ml-64 min-h-screen bg-background pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Smart Cash Vault
              </h1>
              <p className="text-muted-foreground text-sm">
                High-yield Paxos USDG deposits (ERC-4626) with instant T+0 liquidity on Robinhood Chain
              </p>
            </div>

            <a
              href="https://faucet.paxos.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors w-fit"
            >
              <Droplets size={14} /> Get Testnet USDG Faucet <ExternalLink size={12} />
            </a>
          </div>

          {/* Vault Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground font-medium mb-3">
                Your Vault Principal
              </p>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">
                  ${userBalance.shares.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userBalance.shares.toLocaleString()} nvUSDG Shares (1:1)
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm text-muted-foreground font-medium">Lending APY</p>
                <TrendingUp size={18} className="text-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-accent">8.45%</p>
                <p className="text-xs text-muted-foreground">
                  MetaMorpho Standard Rail
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground font-medium mb-3">
                Accrued Yield
              </p>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">
                  ${userBalance.accruedYield.toFixed(2)}
                </p>
                <p className="text-xs text-accent font-medium">
                  Autonomous DCA Stream Ready
                </p>
              </div>
            </div>
          </div>

          {/* Main Deposit/Withdraw Card */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border">
              <button
                onClick={() => setTab('deposit')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === 'deposit'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ArrowUpRight size={16} />
                  Deposit USDG
                </span>
              </button>
              <button
                onClick={() => setTab('withdraw')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === 'withdraw'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ArrowDownLeft size={16} />
                  Withdraw (T+0)
                </span>
              </button>
              <button
                onClick={() => setTab('yield')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === 'yield'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={16} />
                  Yield Simulator
                </span>
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-foreground">
                    {tab === 'deposit' ? 'Deposit Amount (USDG)' : tab === 'withdraw' ? 'Withdraw Amount (USDG)' : 'Simulate External Yield Inflow (USDG)'}
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Wallet: ${userBalance.usdgWallet} USDG
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent font-medium"
                  />
                  <button
                    onClick={() => setAmount(tab === 'withdraw' ? userBalance.shares.toString() : userBalance.usdgWallet.toString())}
                    className="px-4 py-3 bg-secondary border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {statusMsg && (
                <div className={`p-3 rounded-lg text-xs font-medium border ${
                  statusMsg.isError
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-accent/10 border-accent/30 text-accent'
                }`}>
                  {statusMsg.text}
                </div>
              )}

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 py-4 px-4 bg-secondary/50 rounded-lg border border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {tab === 'deposit' ? 'Shares Received' : tab === 'withdraw' ? 'Redemption Settlement' : 'Yield Added to Buffer'}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {amount || '0'} {tab === 'deposit' ? 'nvUSDG' : 'USDG'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Liquidity Settlement
                  </p>
                  <p className="text-lg font-bold text-accent">T+0 Instant (0s Delay)</p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleAction}
                disabled={loading}
                className="w-full bg-accent text-primary-foreground py-3.5 rounded-lg font-bold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                <span>
                  {loading
                    ? "Submitting Transaction..."
                    : tab === 'deposit'
                      ? 'Deposit Paxos USDG'
                      : tab === 'withdraw'
                        ? 'Withdraw USDG Instantly (T+0)'
                        : 'Inject 25 USDG Yield Batch'}
                </span>
              </button>

              <p className="text-xs text-muted-foreground text-center">
                100% Principal Protection Invariant: YieldStreamer cannot touch deposit principal under any condition.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Lock size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Principal-Safe Invariant
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your USDG deposit remains untouched. Only accrued yield above initial capital is harvested for equities.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Instant T+0 Redemptions
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    15% onchain liquidity buffer guarantees instant cash redemptions without waiting for lending cycles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
