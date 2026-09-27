"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, ShieldCheck, ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { PortfolioState } from "../lib/types";

interface HeroMetricProps {
  portfolio: PortfolioState;
  onDepositClick: () => void;
  onStreamClick: () => void;
  onCopilotClick: () => void;
}

export const HeroMetric: React.FC<HeroMetricProps> = ({
  portfolio,
  onDepositClick,
  onStreamClick,
  onCopilotClick,
}) => {
  // Live ticking micro-animation for yield
  const [tickingYield, setTickingYield] = useState(portfolio.accruedYieldUSDG);

  useEffect(() => {
    setTickingYield(portfolio.accruedYieldUSDG);
  }, [portfolio.accruedYieldUSDG]);

  // Micro-accrual tick every 2 seconds to make the UI feel alive!
  useEffect(() => {
    if (portfolio.vaultDepositUSDG <= 0) return;
    const interval = setInterval(() => {
      // 8.45% APY per 2 seconds on deposited balance
      const secondFraction = 2 / (365 * 24 * 3600);
      const yieldPerTick = portfolio.vaultDepositUSDG * 0.0845 * secondFraction;
      setTickingYield((prev) => prev + yieldPerTick);
    }, 2000);
    return () => clearInterval(interval);
  }, [portfolio.vaultDepositUSDG]);

  const totalValue =
    portfolio.vaultDepositUSDG +
    tickingYield +
    portfolio.totalEquityValueUSD;

  return (
    <div className="glass-panel" style={{
      padding: "32px",
      margin: "24px 0",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative ambient gradient backdrop */}
      <div style={{
        position: "absolute",
        top: "-80px",
        right: "-80px",
        width: "280px",
        height: "280px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0, 200, 5, 0.15) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Top Tagline Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
        <div className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ShieldCheck size={14} />
          <span>Zero-Principal-Risk Architecture</span>
        </div>

        <div className="badge badge-cyan" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Clock size={14} />
          <span>Instant T+0 Liquidity Fronting</span>
        </div>

        <div className="glass-panel" style={{
          padding: "4px 10px",
          borderRadius: "var(--radius-full)",
          fontSize: "0.75rem",
          color: "var(--text-muted)"
        }}>
          Robinhood Chain • Autonomous RWA Layer
        </div>
      </div>

      {/* Main Metric Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "24px",
        alignItems: "end"
      }}>
        {/* Left: Total Net Worth Counter */}
        <div>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            Total Portfolio Net Worth
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginTop: "4px" }}>
            <h1 style={{ fontSize: "3.2rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </h1>
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#00FF08",
              fontSize: "0.95rem",
              fontWeight: 600
            }}>
              <TrendingUp size={16} />
              +8.45% APY
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "6px" }}>
            Your cash principal earns yield on Morpho, which auto-streams into tokenized US stocks.
          </p>
        </div>

        {/* Middle/Right: Breakdown Badges */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          background: "rgba(0, 0, 0, 0.3)",
          padding: "16px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)"
        }}>
          {/* Smart Cash Principal */}
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>USDG Principal (T+0)</span>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px" }}>
              ${portfolio.vaultDepositUSDG.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span style={{ fontSize: "0.7rem", color: "#00FF08" }}>100% Protected</span>
          </div>

          {/* Live Accrued Yield */}
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Accrued Yield</span>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#00FF08", marginTop: "2px" }}>
              +${tickingYield.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Streaming to Equities</span>
          </div>

          {/* Tokenized Equities */}
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Stock Tokens Value</span>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-cyan)", marginTop: "2px" }}>
              ${portfolio.totalEquityValueUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>TSLA, AMZN, AMD, etc.</span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
        <button onClick={onDepositClick} className="btn-primary">
          <span>Deposit Smart Cash (USDG)</span>
          <ArrowUpRight size={16} />
        </button>

        <button onClick={onStreamClick} className="btn-secondary">
          <span>Configure Stock Stream</span>
        </button>

        <button onClick={onCopilotClick} className="btn-secondary" style={{ borderColor: "rgba(139, 92, 246, 0.4)" }}>
          <Sparkles size={16} color="#A78BFA" />
          <span style={{ color: "#DDD6FE" }}>AI Copilot Terminal</span>
        </button>
      </div>
    </div>
  );
};
