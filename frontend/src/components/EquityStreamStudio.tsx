"use client";

import React, { useState } from "react";
import { Sliders, RefreshCw, Zap, ExternalLink, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { StockAsset, PortfolioState } from "../lib/types";

interface EquityStreamStudioProps {
  assets: StockAsset[];
  portfolio: PortfolioState;
  onUpdateBasket: (newWeights: { [symbol: string]: number }) => Promise<void>;
  onTriggerStream: (amountUSDG: number) => Promise<void>;
  isProcessing: boolean;
}

export const EquityStreamStudio: React.FC<EquityStreamStudioProps> = ({
  assets,
  portfolio,
  onUpdateBasket,
  onTriggerStream,
  isProcessing,
}) => {
  // Local basket weights (percentages 0-100)
  const [weights, setWeights] = useState<{ [symbol: string]: number }>(() => {
    const initial: { [symbol: string]: number } = {};
    assets.forEach((a) => {
      initial[a.symbol] = a.allocationBps / 100;
    });
    return initial;
  });

  const [streamAmount, setStreamAmount] = useState<string>("10");
  const [feedback, setFeedback] = useState<string>("");

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const handleSliderChange = (symbol: string, val: number) => {
    setWeights((prev) => ({ ...prev, [symbol]: val }));
  };

  const applyPreset = (presetName: string) => {
    if (presetName === "AI_TECH") {
      setWeights({ TSLA: 35, AMD: 35, PLTR: 30, AMZN: 0, NFLX: 0 });
    } else if (presetName === "BLUECHIP") {
      setWeights({ AMZN: 40, TSLA: 30, NFLX: 30, AMD: 0, PLTR: 0 });
    } else if (presetName === "EQUAL") {
      setWeights({ TSLA: 20, AMZN: 20, AMD: 20, NFLX: 20, PLTR: 20 });
    }
  };

  const handleSaveBasket = async () => {
    if (totalWeight !== 100) {
      alert(`Total allocation must equal 100%. Current total: ${totalWeight}%`);
      return;
    }
    await onUpdateBasket(weights);
    setFeedback("Target allocation basket saved on Robinhood Chain!");
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleStream = async () => {
    const amt = parseFloat(streamAmount);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > portfolio.accruedYieldUSDG) {
      alert("Stream amount exceeds currently accrued yield. You can only stream yield, protecting principal!");
      return;
    }
    await onTriggerStream(amt);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    setFeedback(`Successfully streamed $${amt} yield into Robinhood Stock Tokens!`);
    setTimeout(() => setFeedback(""), 5000);
  };

  return (
    <div className="glass-panel" style={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Equity Stream Studio</h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Auto-DCA Accrued Yield into Real Robinhood Stock Tokens
            </span>
          </div>
          <div className="badge badge-cyan" style={{ fontSize: "0.75rem" }}>
            Total: {totalWeight}%
          </div>
        </div>

        {/* Presets */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "center" }}>Presets:</span>
          <button onClick={() => applyPreset("AI_TECH")} className="btn-secondary" style={{ padding: "3px 10px", fontSize: "0.75rem" }}>
            AI & Chips
          </button>
          <button onClick={() => applyPreset("BLUECHIP")} className="btn-secondary" style={{ padding: "3px 10px", fontSize: "0.75rem" }}>
            Consumer Giants
          </button>
          <button onClick={() => applyPreset("EQUAL")} className="btn-secondary" style={{ padding: "3px 10px", fontSize: "0.75rem" }}>
            Equal Weight (20% each)
          </button>
        </div>

        {/* Asset Sliders List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          {assets.map((asset) => {
            const currentWeight = weights[asset.symbol] || 0;
            const userHoldings = portfolio.stockHoldings[asset.symbol] || 0;
            const holdingValueUSD = userHoldings * asset.priceUSD;

            return (
              <div
                key={asset.symbol}
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: asset.color
                    }} />
                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{asset.symbol}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{asset.name}</span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      ${asset.priceUSD.toFixed(2)}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "8px" }}>
                      ({userHoldings.toFixed(2)} shares ≈ ${holdingValueUSD.toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Slider and Percentage */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={currentWeight}
                    onChange={(e) => handleSliderChange(asset.symbol, parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: asset.color, cursor: "pointer" }}
                  />
                  <span style={{
                    minWidth: "45px",
                    textAlign: "right",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: currentWeight > 0 ? asset.color : "var(--text-muted)"
                  }}>
                    {currentWeight}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {feedback && (
          <div style={{
            background: "rgba(0, 200, 5, 0.15)",
            border: "1px solid rgba(0, 200, 5, 0.4)",
            borderRadius: "var(--radius-sm)",
            padding: "10px",
            color: "#00FF08",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px"
          }}>
            <CheckCircle size={16} />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Stream Controls */}
      <div style={{
        background: "rgba(0, 200, 5, 0.05)",
        border: "1px solid rgba(0, 200, 5, 0.2)",
        borderRadius: "var(--radius-sm)",
        padding: "14px",
        marginTop: "12px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "8px" }}>
          <span style={{ color: "var(--text-secondary)" }}>Available Accrued Yield to Stream:</span>
          <span style={{ fontWeight: 700, color: "#00FF08" }}>
            +${portfolio.accruedYieldUSDG.toFixed(4)} USDG
          </span>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          <input
            type="number"
            className="input-field"
            value={streamAmount}
            onChange={(e) => setStreamAmount(e.target.value)}
            placeholder="USDG to Stream"
            style={{ padding: "8px 12px", fontSize: "0.9rem" }}
          />
          <button
            onClick={() => setStreamAmount(portfolio.accruedYieldUSDG.toFixed(2))}
            className="btn-secondary"
            style={{ whiteSpace: "nowrap", padding: "8px 12px", fontSize: "0.8rem" }}
          >
            Max Yield
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSaveBasket}
            disabled={isProcessing || totalWeight !== 100}
            className="btn-secondary"
            style={{ flex: 1, padding: "10px", fontSize: "0.85rem" }}
          >
            <span>Save Basket</span>
          </button>

          <button
            onClick={handleStream}
            disabled={isProcessing || portfolio.accruedYieldUSDG <= 0}
            className="btn-primary"
            style={{ flex: 1.5, padding: "10px", fontSize: "0.85rem" }}
          >
            <Zap size={15} />
            <span>Auto-Stream Yield</span>
          </button>
        </div>
      </div>
    </div>
  );
};
