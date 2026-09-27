"use client";

import React from "react";
import { ShieldCheck, Fingerprint, ExternalLink, Zap, Wallet } from "lucide-react";

interface NavbarProps {
  account: string;
  isPasskeyConnected: boolean;
  onConnectWallet: () => void;
  onOpenPasskeyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  account,
  isPasskeyConnected,
  onConnectWallet,
  onOpenPasskeyModal,
}) => {
  return (
    <header style={{
      borderBottom: "1px solid var(--border-color)",
      background: "rgba(7, 9, 13, 0.8)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      padding: "16px 24px"
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap"
      }}>
        {/* Logo & Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #00FF08 0%, #009904 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(0, 200, 5, 0.4)"
          }}>
            <Zap size={22} color="#000000" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
                Nova<span className="text-gradient-green">Wealth</span>
              </span>
              <span className="badge badge-green" style={{ fontSize: "0.65rem", padding: "2px 8px" }}>
                RWA Copilot
              </span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Robinhood Chain • Paxos USDG • Stock Tokens
            </span>
          </div>
        </div>

        {/* Network & Live Metrics Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div className="glass-panel" style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.8rem",
            color: "var(--text-secondary)"
          }}>
            <div className="pulse-dot" />
            <span>Robinhood Testnet (46630)</span>
          </div>

          <div className="glass-panel" style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.8rem"
          }}>
            <span style={{ color: "var(--text-muted)" }}>Morpho Earn APY:</span>
            <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>8.45%</span>
          </div>

          <a
            href="https://faucet.paxos.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ padding: "6px 14px", fontSize: "0.8rem", textDecoration: "none" }}
          >
            <span>Paxos USDG Faucet</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Auth / Account Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Passkey Button */}
          <button
            onClick={onOpenPasskeyModal}
            className="btn-secondary"
            style={{
              borderColor: isPasskeyConnected ? "var(--accent-green)" : "var(--border-color)",
              color: isPasskeyConnected ? "#00FF08" : "var(--text-primary)"
            }}
          >
            <Fingerprint size={16} color={isPasskeyConnected ? "#00FF08" : "var(--text-secondary)"} />
            <span style={{ fontSize: "0.85rem" }}>
              {isPasskeyConnected ? "Passkey Active" : "Passkey AA"}
            </span>
          </button>

          {/* Wallet Connect */}
          <button
            onClick={onConnectWallet}
            className="btn-primary"
            style={{ padding: "8px 18px", fontSize: "0.85rem" }}
          >
            <Wallet size={16} />
            <span>
              {account
                ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                : "Connect Wallet"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
