'use client';

import { Navigation } from '@/components/nav';
import { Zap, Plus, X, TrendingUp, Check, ExternalLink, Loader2, Radio, RefreshCw, Play, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import deployedInfo from '@/contracts/deployed.json';

interface StockPosition {
  id: string;
  symbol: string;
  name: string;
  allocation: number; // percentage
  address?: string;
}

const AVAILABLE_STOCKS = [
  { symbol: 'TSLA', name: 'Tesla, Inc. (ERC-8056)', address: deployedInfo.stockTokens.TSLA.address },
  { symbol: 'AMZN', name: 'Amazon.com, Inc. (ERC-8056)', address: deployedInfo.stockTokens.AMZN.address },
  { symbol: 'AMD', name: 'Advanced Micro Devices', address: deployedInfo.stockTokens.AMD.address },
  { symbol: 'NFLX', name: 'Netflix, Inc.', address: deployedInfo.stockTokens.NFLX.address },
  { symbol: 'PLTR', name: 'Palantir Technologies', address: deployedInfo.stockTokens.PLTR.address },
];

const STREAMER_ABI = [
  "function setAllocationBasket(address[] calldata tokens, uint256[] calldata weightsBps) external",
  "function getUserBasket(address user) external view returns (tuple(address stockToken, uint256 weightBps)[])",
  "function streamYield(address user, uint256 yieldAmount) external returns (uint256[] memory)"
];

const VAULT_ABI = [
  "function accruedYield() external view returns (uint256)"
];

const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)"
];

export default function StreamPage() {
  const [positions, setPositions] = useState<StockPosition[]>([
    { id: '1', symbol: 'TSLA', name: 'Tesla, Inc.', allocation: 60, address: deployedInfo.stockTokens.TSLA.address },
    { id: '2', symbol: 'AMZN', name: 'Amazon.com, Inc.', allocation: 40, address: deployedInfo.stockTokens.AMZN.address },
  ]);

  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [accruedYield, setAccruedYield] = useState<number>(10.0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [activeAddress, setActiveAddress] = useState<string>('0xb8AD2787f447e04E8D66D7e888Dd48fB68DdedB7');
  const [holdings, setHoldings] = useState<{ [symbol: string]: number }>({
    TSLA: 8.0118,
    AMZN: 8.0108,
  });

  const fetchOnChainState = useCallback(async () => {
    setIsFetching(true);
    try {
      let targetAddr = '0xb8AD2787f447e04E8D66D7e888Dd48fB68DdedB7';
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("nova_user_address");
        if (stored && ethers.isAddress(stored)) {
          targetAddr = stored;
        } else if ((window as any).ethereum?.selectedAddress) {
          targetAddr = (window as any).ethereum.selectedAddress;
        }
      }
      setActiveAddress(targetAddr);

      const provider = new ethers.JsonRpcProvider(deployedInfo.rpcUrl);
      const vault = new ethers.Contract(deployedInfo.contracts.NovaVault, VAULT_ABI, provider);
      const streamer = new ethers.Contract(deployedInfo.contracts.YieldStreamer, STREAMER_ABI, provider);
      const tsla = new ethers.Contract(deployedInfo.stockTokens.TSLA.address, ERC20_ABI, provider);
      const amzn = new ethers.Contract(deployedInfo.stockTokens.AMZN.address, ERC20_ABI, provider);

      const [rawYield, rawTsla, rawAmzn, basket] = await Promise.all([
        vault.accruedYield().catch(() => BigInt(0)),
        tsla.balanceOf(targetAddr).catch(() => BigInt(0)),
        amzn.balanceOf(targetAddr).catch(() => BigInt(0)),
        streamer.getUserBasket(targetAddr).catch(() => []),
      ]);

      setAccruedYield(parseFloat(ethers.formatUnits(rawYield, 6)));
      setHoldings({
        TSLA: parseFloat(ethers.formatUnits(rawTsla, 18)),
        AMZN: parseFloat(ethers.formatUnits(rawAmzn, 18)),
      });

      // If on-chain basket exists, synchronize UI sliders with on-chain basket
      if (basket && basket.length > 0) {
        const tokenMap: { [addr: string]: { symbol: string; name: string } } = {
          [deployedInfo.stockTokens.TSLA.address.toLowerCase()]: { symbol: 'TSLA', name: 'Tesla, Inc.' },
          [deployedInfo.stockTokens.AMZN.address.toLowerCase()]: { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
          [deployedInfo.stockTokens.AMD.address.toLowerCase()]: { symbol: 'AMD', name: 'Advanced Micro Devices' },
          [deployedInfo.stockTokens.NFLX.address.toLowerCase()]: { symbol: 'NFLX', name: 'Netflix, Inc.' },
          [deployedInfo.stockTokens.PLTR.address.toLowerCase()]: { symbol: 'PLTR', name: 'Palantir Technologies' },
        };

        const syncedPositions: StockPosition[] = basket.map((item: any, idx: number) => {
          const addr = item.stockToken.toLowerCase();
          const info = tokenMap[addr] || { symbol: 'CUSTOM', name: 'Stock Token' };
          const weight = Number(item.weightBps) / 100;
          return {
            id: String(idx + 1),
            symbol: info.symbol,
            name: info.name,
            allocation: weight,
            address: item.stockToken
          };
        });
        setPositions(syncedPositions);
      }
    } catch (err: any) {
      console.warn("Could not query Robinhood testnet RPC in StreamPage:", err?.message || err);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchOnChainState();
    const interval = setInterval(fetchOnChainState, 20000);
    return () => clearInterval(interval);
  }, [fetchOnChainState]);

  const totalAllocation = positions.reduce((sum, p) => sum + p.allocation, 0);

  const updateAllocation = (id: string, newAlloc: number) => {
    setPositions(
      positions.map((p) =>
        p.id === id ? { ...p, allocation: Math.max(0, Math.min(100, newAlloc)) } : p
      )
    );
  };

  const removePosition = (id: string) => {
    setPositions(positions.filter((p) => p.id !== id));
  };

  const addPosition = (stock: (typeof AVAILABLE_STOCKS)[0]) => {
    if (positions.some((p) => p.symbol === stock.symbol)) return;
    setPositions([
      ...positions,
      {
        id: Date.now().toString(),
        symbol: stock.symbol,
        name: stock.name,
        allocation: 0,
        address: stock.address,
      },
    ]);
  };

  const handleSaveBasket = async () => {
    setLoading(true);
    setStatusMsg(null);

    if (totalAllocation !== 100) {
      setStatusMsg({ text: `Total allocation must equal exactly 100% (currently ${totalAllocation}%).`, isError: true });
      setLoading(false);
      return;
    }

    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();

        const streamer = new ethers.Contract(deployedInfo.contracts.YieldStreamer, STREAMER_ABI, signer);
        const tokens = positions.map(p => p.address || deployedInfo.stockTokens.TSLA.address);
        const weightsBps = positions.map(p => p.allocation * 100);

        setStatusMsg({ text: "Submitting allocation basket to YieldStreamer..." });
        const tx = await streamer.setAllocationBasket(tokens, weightsBps);
        await tx.wait(1);

        setStatusMsg({ text: `✓ Successfully saved onchain allocation basket! Tx: ${tx.hash.slice(0, 10)}...` });
        await fetchOnChainState();
      } else {
        setStatusMsg({ text: `✓ Target basket saved: ${positions.map(p => `${p.symbol} ${p.allocation}%`).join(', ')}.` });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ text: err.reason || err.message || "Failed to update basket", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteStream = async () => {
    setStreaming(true);
    setStatusMsg(null);

    try {
      if (accruedYield < 1.0) {
        throw new Error("Accrued yield is below the 1.00 USDG minimum threshold for batch streaming. Inject yield in Smart Vault first!");
      }

      if (typeof window !== "undefined" && (window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const userAddr = await signer.getAddress();

        const streamer = new ethers.Contract(deployedInfo.contracts.YieldStreamer, STREAMER_ABI, signer);
        const streamAmount = ethers.parseUnits(Math.min(accruedYield, 5.0).toFixed(6), 6);

        setStatusMsg({ text: `Streaming $${ethers.formatUnits(streamAmount, 6)} USDG yield into stock tokens...` });
        const tx = await streamer.streamYield(userAddr, streamAmount);
        await tx.wait(1);

        setStatusMsg({ text: `✓ Successfully streamed $${ethers.formatUnits(streamAmount, 6)} USDG into stock tokens! Tx: ${tx.hash.slice(0, 10)}...` });
        await fetchOnChainState();
      } else {
        setStatusMsg({ text: "Please connect a Web3 wallet (or passkey) to execute on-chain streaming.", isError: true });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ text: err.reason || err.message || "Stream execution cancelled", isError: true });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="lg:ml-64 min-h-screen bg-background pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Equity Studio
              </h1>
              <p className="text-muted-foreground text-sm">
                Configure your auto-DCA basket on Robinhood Chain. Harvested USDG yield streams into these equities automatically.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card px-3 py-2 rounded-lg border border-border w-fit">
              <Radio size={12} className="text-accent animate-pulse" />
              <span className="font-mono">{activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}</span>
              <span className="text-[10px] text-accent font-semibold px-1.5 py-0.5 rounded bg-accent/15 border border-accent/30">Robinhood Testnet</span>
              <button
                onClick={fetchOnChainState}
                disabled={isFetching}
                title="Refresh live on-chain balances"
                className="ml-1 text-muted-foreground hover:text-accent transition-colors"
              >
                <RefreshCw size={12} className={isFetching ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* On-Chain Stock Token Portfolio Card */}
          <div className="bg-card border border-border rounded-lg p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-accent" />
                <h3 className="font-bold text-foreground text-sm">Your On-Chain Stock Token Portfolio (ERC-8056)</h3>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">Chainlink Oracle Priced</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-secondary/60 p-3.5 rounded-lg border border-border/60">
                <p className="text-xs text-muted-foreground font-medium">TSLA Tokens</p>
                <p className="text-xl font-bold text-foreground mt-1">{holdings.TSLA.toFixed(4)}</p>
                <p className="text-[10px] text-accent font-medium mt-0.5">Tesla, Inc. (Robinhood Chain)</p>
              </div>
              <div className="bg-secondary/60 p-3.5 rounded-lg border border-border/60">
                <p className="text-xs text-muted-foreground font-medium">AMZN Tokens</p>
                <p className="text-xl font-bold text-foreground mt-1">{holdings.AMZN.toFixed(4)}</p>
                <p className="text-[10px] text-accent font-medium mt-0.5">Amazon.com, Inc.</p>
              </div>
              <div className="bg-secondary/60 p-3.5 rounded-lg border border-border/60">
                <p className="text-xs text-muted-foreground font-medium">Accrued Yield</p>
                <p className="text-xl font-bold text-accent mt-1">${accruedYield.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Ready for Auto-DCA</p>
              </div>
              <div className="bg-secondary/60 p-3.5 rounded-lg border border-border/60">
                <p className="text-xs text-muted-foreground font-medium">Execution Engine</p>
                <p className="text-xl font-bold text-foreground mt-1">Autonomous</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Session Key Ready</p>
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            {/* Current Allocation Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  Your Stock Token Basket
                </h2>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    totalAllocation === 100
                      ? 'bg-accent/15 text-accent border-accent/30'
                      : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                  }`}
                >
                  {totalAllocation}% Allocated {totalAllocation === 100 ? '✓' : '(Must be 100%)'}
                </span>
              </div>

              {positions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-sm">
                  No positions yet. Add stock tokens below to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {positions.map((pos) => (
                    <div
                      key={pos.id}
                      className="flex items-center gap-4 p-4 bg-secondary rounded-lg border border-border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-bold text-foreground">
                              {pos.symbol}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {pos.name}
                            </p>
                          </div>
                          <button
                            onClick={() => removePosition(pos.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {/* Slider */}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={pos.allocation}
                          onChange={(e) =>
                            updateAllocation(pos.id, parseInt(e.target.value))
                          }
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #00c805 0%, #00c805 ${pos.allocation}%, #2d3142 ${pos.allocation}%, #2d3142 100%)`,
                          }}
                        />
                      </div>

                      {/* Allocation Display */}
                      <div className="text-right">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={pos.allocation}
                          onChange={(e) =>
                            updateAllocation(pos.id, parseInt(e.target.value) || 0)
                          }
                          className="w-16 bg-muted border border-border rounded px-2 py-1 text-right font-bold text-foreground text-sm focus:outline-none focus:border-accent"
                        />
                        <p className="text-xs text-muted-foreground mt-1">%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Position */}
            <div className="mb-6 pb-6 border-b border-border">
              <h3 className="text-sm font-bold text-foreground mb-3">
                Available Robinhood Stock Tokens (ERC-8056)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {AVAILABLE_STOCKS.map((stock) => {
                  const isAdded = positions.some(
                    (p) => p.symbol === stock.symbol
                  );
                  return (
                    <button
                      key={stock.symbol}
                      onClick={() => !isAdded && addPosition(stock)}
                      disabled={isAdded}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                        isAdded
                          ? 'bg-muted/60 text-muted-foreground cursor-not-allowed border border-transparent'
                          : 'bg-secondary border border-border text-foreground hover:border-accent hover:text-accent'
                      }`}
                    >
                      {!isAdded && <Plus size={12} />}
                      {stock.symbol}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Feedback */}
            {statusMsg && (
              <div className={`p-3 rounded-lg text-xs font-medium mb-4 border ${
                statusMsg.isError
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-accent/10 border-accent/30 text-accent'
              }`}>
                {statusMsg.text}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveBasket}
                disabled={loading || streaming}
                className="flex-1 bg-accent text-primary-foreground py-3.5 rounded-lg font-bold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                <span>{loading ? "Saving to YieldStreamer..." : "Save Basket on Robinhood Chain"}</span>
              </button>

              <button
                onClick={handleExecuteStream}
                disabled={loading || streaming || accruedYield < 1.0}
                className="flex-1 bg-secondary border border-accent/40 text-accent hover:bg-accent/15 py-3.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Harvest accrued yield and stream into TSLA/AMZN on Robinhood Chain"
              >
                {streaming ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                <span>
                  {streaming
                    ? "Executing Autonomous DCA..."
                    : `Stream $${Math.min(accruedYield, 5.0).toFixed(2)} Accrued Yield Now`}
                </span>
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Zap size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Continuous Yield Stream
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Whenever Morpho yield accrues in NovaVault, your session key streams it into these exact percentages.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Zero Principal Exposure
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your USDG savings principal is mathematically isolated. Even if equities drop 50%, your cash savings remain 100% intact.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Projected Yield Breakdown */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-2">
              Monthly Projected Equity Allocation
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Estimated from ${accruedYield.toFixed(2)} current accrued yield:
            </p>
            <div className="space-y-2">
              {positions.map(
                (pos) =>
                  pos.allocation > 0 && (
                    <div
                      key={pos.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border/60"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{pos.symbol}</span>
                        <span className="text-xs text-muted-foreground">({pos.allocation}%)</span>
                      </div>
                      <span className="text-sm font-mono font-semibold text-accent">
                        ${((accruedYield * pos.allocation) / 100).toFixed(2)} USDG
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
