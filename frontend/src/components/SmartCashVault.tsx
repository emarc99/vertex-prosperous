"use client";

import React, { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, DollarSign, ShieldAlert, Sparkles, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { PortfolioState } from "../lib/types";

interface SmartCashVaultProps {
  portfolio: PortfolioState;
  onDeposit: (amount: number) => Promise<void>;
  onWithdraw: (amount: number) => Promise<void>;
  onSimulateYield: (amount: number) => Promise<void>;
  isProcessing: boolean;
}

export const SmartCashVault: React.FC<SmartCashVaultProps> = ({
  portfolio,
  onDeposit,
  onWithdraw,
  onSimulateYield,
  isProcessing,
}) => {
  const [tab, setTab] = useState<"deposit" | "withdraw" | "yield">("deposit");
  const [amount, setAmount] = useState<string>("50");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleAction = async () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    try {
      if (tab === "deposit") {
        await onDeposit(num);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
        setSuccessMsg(`Successfully deposited $${num} Paxos USDG into Smart Cash Vault!`);
      } else if (tab === "withdraw") {
        await onWithdraw(num);
        setSuccessMsg(`Instant T+0 redemption of $${num} USDG processed to your wallet!`);
      } else if (tab === "yield") {
        await onSimulateYield(num);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        setSuccessMsg(`Simulated +$${num} USDG Morpho lending interest accrued!`);
      }
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (e: any) {
      console.error(e);
    }
  };

  const setPercent = (pct: number) => {
    const maxVal = tab === "deposit" ? portfolio.usdgWalletBalance : portfolio.vaultDepositUSDG;
    setAmount((maxVal * pct).toFixed(2));
  };

  return (
    <div className="glass-panel" style={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Smart Cash Vault</h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              ERC-4626 Paxos USDG • 8.45% Morpho Yield
            </span>
          </div>
          <div className="badge badge-green">
            T+0 Instant Buffer
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: "flex",
          background: "rgba(0, 0, 0, 0.4)",
          padding: "4px",
          borderRadius: "var(--radius-sm)",
          marginBottom: "20px"
        }}>
          <button
            onClick={() => { setTab("deposit"); setAmount("50"); }}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              background: tab === "deposit" ? "var(--bg-secondary)" : "transparent",
              color: tab === "deposit" ? "#00FF08" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Deposit
          </button>
          <button
            onClick={() => { setTab("withdraw"); setAmount("25"); }}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              background: tab === "withdraw" ? "var(--bg-secondary)" : "transparent",
              color: tab === "withdraw" ? "#00FF08" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Instant T+0 Withdraw
          </button>
          <button
            onClick={() => { setTab("yield"); setAmount("10"); }}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              background: tab === "yield" ? "var(--bg-secondary)" : "transparent",
              color: tab === "yield" ? "#00D8F6" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            + Test Yield
          </button>
        </div>

        {/* Balance preview */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.85rem",
          marginBottom: "10px",
          color: "var(--text-secondary)"
        }}>
          <span>
            {tab === "deposit" ? "Wallet USDG Available:" : "Deposited Vault Balance:"}
          </span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            ${tab === "deposit"
              ? portfolio.usdgWalletBalance.toFixed(2)
              : portfolio.vaultDepositUSDG.toFixed(2)} USDG
          </span>
        </div>

        {/* Input box */}
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <input
            type="number"
            className="input-field"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            style={{ fontSize: "1.3rem", fontWeight: 700, paddingRight: "70px" }}
          />
          <div style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            fontWeight: 600,
            fontSize: "0.85rem"
          }}>
            USDG
          </div>
        </div>

        {/* Percentage chips */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {[0.25, 0.50, 0.75, 1.0].map((pct) => (
            <button
              key={pct}
              onClick={() => setPercent(pct)}
              className="btn-secondary"
              style={{
                padding: "4px 10px",
                fontSize: "0.75rem",
                borderRadius: "var(--radius-sm)",
                flex: 1,
                justifyContent: "center"
              }}
            >
              {pct === 1.0 ? "MAX" : `${pct * 100}%`}
            </button>
          ))}
        </div>

        {/* Info card */}
        <div style={{
          background: "rgba(0, 0, 0, 0.25)",
          padding: "12px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
          marginBottom: "16px"
        }}>
          {tab === "deposit" && (
            <p>
              Deposits are converted 1:1 into <strong style={{ color: "#fff" }}>nvUSDG</strong> shares. 85% is deployed to Morpho Blue lending pools for yield, while 15% is reserved for immediate T+0 liquidity.
            </p>
          )}
          {tab === "withdraw" && (
            <p>
              <strong style={{ color: "#00FF08" }}>Instant T+0 Redemptions:</strong> You can redeem 100% of your USDG cash principal on demand directly from the onchain liquidity buffer without lockups or delay.
            </p>
          )}
          {tab === "yield" && (
            <p>
              <strong style={{ color: "#00D8F6" }}>Yield Simulator:</strong> Injects testnet USDG yield into the vault to simulate daily Morpho interest payments, enabling you to test the autonomous Stock DCA stream!
            </p>
          )}
        </div>

        {successMsg && (
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
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleAction}
        disabled={isProcessing}
        className="btn-primary"
        style={{ width: "100%", padding: "14px" }}
      >
        {isProcessing ? (
          <span>Processing Transaction...</span>
        ) : tab === "deposit" ? (
          <>
            <span>Deposit into Smart Cash</span>
            <ArrowDownLeft size={16} />
          </>
        ) : tab === "withdraw" ? (
          <>
            <span>Withdraw Principal (T+0)</span>
            <ArrowUpRight size={16} />
          </>
        ) : (
          <>
            <span>Accrue Morpho Yield</span>
            <Sparkles size={16} />
          </>
        )}
      </button>
    </div>
  );
};
