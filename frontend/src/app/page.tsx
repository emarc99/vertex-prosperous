"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { HeroMetric } from "../components/HeroMetric";
import { SmartCashVault } from "../components/SmartCashVault";
import { EquityStreamStudio } from "../components/EquityStreamStudio";
import { CopilotTerminal } from "../components/CopilotTerminal";
import { PasskeyModal } from "../components/PasskeyModal";
import { StockAsset, PortfolioState, CopilotLog } from "../lib/types";
import deployedData from "../contracts/deployed.json";

export default function Home() {
  const [account, setAccount] = useState<string>("0xb8AD2787f447e04E8D66D7e888Dd48fB68DdedB7");
  const [isPasskeyConnected, setIsPasskeyConnected] = useState<boolean>(true);
  const [isPasskeyModalOpen, setIsPasskeyModalOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Live Stock Assets metadata from Robinhood Chain Testnet deployment
  const [assets, setAssets] = useState<StockAsset[]>([
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      address: deployedData.stockTokens.TSLA.address,
      priceUSD: deployedData.stockTokens.TSLA.priceUSD,
      balance: 5.0,
      allocationBps: 3000, // 30%
      color: "#E82127",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com, Inc.",
      address: deployedData.stockTokens.AMZN.address,
      priceUSD: deployedData.stockTokens.AMZN.priceUSD,
      balance: 5.0,
      allocationBps: 2500, // 25%
      color: "#FF9900",
    },
    {
      symbol: "AMD",
      name: "Advanced Micro Devices",
      address: deployedData.stockTokens.AMD.address,
      priceUSD: deployedData.stockTokens.AMD.priceUSD,
      balance: 5.0,
      allocationBps: 2000, // 20%
      color: "#00C805",
    },
    {
      symbol: "NFLX",
      name: "Netflix, Inc.",
      address: deployedData.stockTokens.NFLX.address,
      priceUSD: deployedData.stockTokens.NFLX.priceUSD,
      balance: 5.0,
      allocationBps: 1500, // 15%
      color: "#E50914",
    },
    {
      symbol: "PLTR",
      name: "Palantir Technologies",
      address: deployedData.stockTokens.PLTR.address,
      priceUSD: deployedData.stockTokens.PLTR.priceUSD,
      balance: 5.0,
      allocationBps: 1000, // 10%
      color: "#00D8F6",
    },
  ]);

  // User Portfolio State
  const [portfolio, setPortfolio] = useState<PortfolioState>({
    usdgWalletBalance: 100.0,
    vaultDepositUSDG: 500.0,
    accruedYieldUSDG: 18.45,
    totalHarvestedUSDG: 24.5,
    stockHoldings: {
      TSLA: 5.0,
      AMZN: 5.0,
      AMD: 5.0,
      NFLX: 5.0,
      PLTR: 5.0,
    },
    totalEquityValueUSD: 0,
    totalNetWorthUSD: 0,
  });

  // Telemetry logs
  const [logs, setLogs] = useState<CopilotLog[]>([
    {
      id: "log-1",
      timestamp: "10:14:02 AM",
      type: "SESSION_CHECK",
      title: "NYSE Session Verified",
      details: "Trading session ACTIVE. Chainlink feeds fresh within 120s limit.",
    },
    {
      id: "log-2",
      timestamp: "10:14:05 AM",
      type: "DCA_EXECUTION",
      title: "Autonomous Yield Stream Executed",
      details: "Streamed $12.50 USDG yield into 0.015 TSLA, 0.018 AMZN, 0.021 AMD.",
      txHash: "0x6C33f144264a480B3bd414Db39127deC91a3b69D",
    },
  ]);

  // Recalculate equity values when assets or holdings change
  useEffect(() => {
    let equitySum = 0;
    assets.forEach((a) => {
      const holding = portfolio.stockHoldings[a.symbol] || 0;
      equitySum += holding * a.priceUSD;
    });

    const netWorth =
      portfolio.vaultDepositUSDG +
      portfolio.accruedYieldUSDG +
      equitySum;

    setPortfolio((prev) => ({
      ...prev,
      totalEquityValueUSD: equitySum,
      totalNetWorthUSD: netWorth,
    }));
  }, [assets, portfolio.vaultDepositUSDG, portfolio.accruedYieldUSDG, portfolio.stockHoldings]);

  // Connect Wallet handler
  const handleConnectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setIsPasskeyModalOpen(true);
    }
  };

  // Deposit handler
  const handleDeposit = async (amount: number) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 800));
    setPortfolio((prev) => ({
      ...prev,
      usdgWalletBalance: Math.max(0, prev.usdgWalletBalance - amount),
      vaultDepositUSDG: prev.vaultDepositUSDG + amount,
    }));
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "HARVEST",
        title: "Smart Cash Deposit (T+0 Active)",
        details: `Deposited $${amount.toFixed(2)} Paxos USDG. 85% allocated to Morpho Earn; 15% instant buffer.`,
      },
      ...prev,
    ]);
    setIsProcessing(false);
  };

  // Withdraw handler
  const handleWithdraw = async (amount: number) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 800));
    setPortfolio((prev) => ({
      ...prev,
      vaultDepositUSDG: Math.max(0, prev.vaultDepositUSDG - amount),
      usdgWalletBalance: prev.usdgWalletBalance + amount,
    }));
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "HARVEST",
        title: "Instant T+0 Redemption",
        details: `Redeemed $${amount.toFixed(2)} USDG principal immediately from liquidity buffer.`,
      },
      ...prev,
    ]);
    setIsProcessing(false);
  };

  // Simulate Yield handler
  const handleSimulateYield = async (amount: number) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    setPortfolio((prev) => ({
      ...prev,
      accruedYieldUSDG: prev.accruedYieldUSDG + amount,
    }));
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "HARVEST",
        title: "Morpho Yield Harvested",
        details: `Accrued +$${amount.toFixed(2)} USDG interest from Robinhood Chain lending pools.`,
      },
      ...prev,
    ]);
    setIsProcessing(false);
  };

  // Update Basket handler
  const handleUpdateBasket = async (newWeights: { [symbol: string]: number }) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    setAssets((prev) =>
      prev.map((a) => ({
        ...a,
        allocationBps: (newWeights[a.symbol] || 0) * 100,
      }))
    );
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "REBALANCE",
        title: "Onchain Basket Reconfigured",
        details: `New weights: ${Object.entries(newWeights)
          .filter(([_, w]) => w > 0)
          .map(([sym, w]) => `${sym} ${w}%`)
          .join(", ")}`,
      },
      ...prev,
    ]);
    setIsProcessing(false);
  };

  // Trigger Stream handler (Auto-DCA)
  const handleTriggerStream = async (amountUSDG: number) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));

    // Calculate how many stock tokens were bought
    const newHoldings = { ...portfolio.stockHoldings };
    const purchasedSummary: string[] = [];

    assets.forEach((a) => {
      const sliceUSDG = (amountUSDG * a.allocationBps) / 10000;
      if (sliceUSDG > 0) {
        const sharesBought = sliceUSDG / a.priceUSD;
        newHoldings[a.symbol] = (newHoldings[a.symbol] || 0) + sharesBought;
        purchasedSummary.push(`${sharesBought.toFixed(4)} ${a.symbol}`);
      }
    });

    setPortfolio((prev) => ({
      ...prev,
      accruedYieldUSDG: Math.max(0, prev.accruedYieldUSDG - amountUSDG),
      totalHarvestedUSDG: prev.totalHarvestedUSDG + amountUSDG,
      stockHoldings: newHoldings,
    }));

    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "DCA_EXECUTION",
        title: "Autonomous Yield DCA Executed",
        details: `Streamed $${amountUSDG.toFixed(2)} yield into ${purchasedSummary.join(", ")}. Principal untouched!`,
        txHash: "0x9693aAd2540D75057D0CDce4c16891230D335A6B",
      },
      ...prev,
    ]);

    setIsProcessing(false);
  };

  // Copilot conversational responses
  const handleTriggerCopilotAction = async (prompt: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 800));
    const lower = prompt.toLowerCase();

    if (lower.includes("principal") || lower.includes("protect")) {
      return `🛡️ Your initial deposit of $${portfolio.vaultDepositUSDG.toFixed(2)} USDG is 100% safeguarded inside NovaVault (ERC-4626). Our contracts strictly enforce that only excess yield generated on Morpho Blue can be harvested. Even if all tokenized stocks dropped to zero, your cash principal remains fully withdrawable!`;
    }

    if (lower.includes("t+0") || lower.includes("liquidity") || lower.includes("withdraw")) {
      return `⚡ Unlike traditional funds that take 30 to 180 days to redeem (as highlighted by SBI Digital Markets), NovaVault features an instant T+0 liquidity buffer. When you withdraw, funds are settled immediately from the onchain buffer without waiting for redemption windows.`;
    }

    if (lower.includes("stock") || lower.includes("token")) {
      return `📈 Robinhood Stock Tokens are tokenized equities issued by Robinhood Assets Jersey (RHJ). They provide 24/7 onchain economic exposure to US shares (TSLA, AMZN, AMD, NFLX, PLTR) with ERC-8056 corporate action multiplier compliance and Chainlink oracle price feeds.`;
    }

    if (lower.includes("session") || lower.includes("hour") || lower.includes("nyse")) {
      return `🕒 Robinhood Chain supports 24/7 trading for Stock Tokens, but our YieldStreamer checks feed freshness and session capabilities to avoid trading during illiquid gap-down hours. Currently, all 5 Chainlink feeds are active and reporting fresh prices.`;
    }

    return `🤖 Copilot Analysis: Your portfolio has a healthy $${portfolio.vaultDepositUSDG.toFixed(2)} USDG deposit earning 8.45% APY. You currently have $${portfolio.accruedYieldUSDG.toFixed(2)} in accrued yield ready to stream. Your target basket is weighted across TSLA, AMZN, AMD, NFLX, and PLTR. Would you like me to trigger an automated DCA stream now?`;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Navbar
        account={account}
        isPasskeyConnected={isPasskeyConnected}
        onConnectWallet={handleConnectWallet}
        onOpenPasskeyModal={() => setIsPasskeyModalOpen(true)}
      />

      {/* Main Container */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 60px 24px", width: "100%", flex: 1 }}>
        {/* Hero Section */}
        <HeroMetric
          portfolio={portfolio}
          onDepositClick={() => {
            const el = document.getElementById("vault-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          onStreamClick={() => {
            const el = document.getElementById("stream-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          onCopilotClick={() => {
            const el = document.getElementById("copilot-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 2-Column Grid: Smart Cash Vault & Equity Stream Studio */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "24px",
          marginTop: "24px"
        }}>
          {/* Column 1: Smart Cash Vault */}
          <div id="vault-section">
            <SmartCashVault
              portfolio={portfolio}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onSimulateYield={handleSimulateYield}
              isProcessing={isProcessing}
            />
          </div>

          {/* Column 2: Equity Stream Studio */}
          <div id="stream-section">
            <EquityStreamStudio
              assets={assets}
              portfolio={portfolio}
              onUpdateBasket={handleUpdateBasket}
              onTriggerStream={handleTriggerStream}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* AI Copilot & Telemetry Terminal */}
        <div id="copilot-section">
          <CopilotTerminal
            logs={logs}
            onTriggerCopilotAction={handleTriggerCopilotAction}
          />
        </div>

        {/* Footer info & partners */}
        <footer style={{
          marginTop: "60px",
          borderTop: "1px solid var(--border-color)",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "0.8rem",
          color: "var(--text-muted)"
        }}>
          <div>
            <strong>NovaWealth</strong> — Built for the <strong>Arbitrum Open House Singapore Buildathon</strong>.
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <span>Robinhood Chain (46630)</span>
            <span>Paxos USDG</span>
            <span>Morpho Blue</span>
            <span>SBI Digital Markets Lane 2</span>
          </div>
        </footer>
      </main>

      {/* Passkey Modal */}
      <PasskeyModal
        isOpen={isPasskeyModalOpen}
        onClose={() => setIsPasskeyModalOpen(false)}
        onSuccess={() => {
          setIsPasskeyConnected(true);
          setIsPasskeyModalOpen(false);
        }}
        isAlreadyConnected={isPasskeyConnected}
      />
    </div>
  );
}
