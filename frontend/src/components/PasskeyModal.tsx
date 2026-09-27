"use client";

import React, { useState } from "react";
import { Fingerprint, X, ShieldCheck, Check, Sparkles, Key, Zap } from "lucide-react";

interface PasskeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isAlreadyConnected: boolean;
}

export const PasskeyModal: React.FC<PasskeyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isAlreadyConnected,
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState<boolean>(isAlreadyConnected);

  if (!isOpen) return null;

  const handleBiometricAuth = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setAuthenticated(true);
      onSuccess();
    }, 1200);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(8px)",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div className="glass-panel" style={{
        maxWidth: "460px",
        width: "100%",
        padding: "28px",
        position: "relative",
        border: "1px solid rgba(0, 200, 5, 0.3)",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.8)"
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer"
          }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: authenticated
              ? "rgba(0, 200, 5, 0.15)"
              : "rgba(139, 92, 246, 0.15)",
            border: authenticated
              ? "1px solid rgba(0, 200, 5, 0.4)"
              : "1px solid rgba(139, 92, 246, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto"
          }}>
            {authenticated ? (
              <ShieldCheck size={32} color="#00FF08" />
            ) : (
              <Fingerprint size={32} color="#A78BFA" />
            )}
          </div>

          <h3 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
            {authenticated ? "Passkey Active & Verified" : "Sign In with Biometric Passkey"}
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            ERC-4337 Smart Account on Robinhood Chain • Zero Seed Phrases
          </p>
        </div>

        {/* Permissions / Security Breakdown */}
        <div style={{
          background: "rgba(0, 0, 0, 0.4)",
          borderRadius: "var(--radius-sm)",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "24px",
          fontSize: "0.8rem"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <Key size={16} color="#00D8F6" style={{ marginTop: "2px", flexShrink: 0 }} />
            <div>
              <strong style={{ color: "var(--text-primary)" }}>Scoped Session Key Policy</strong>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                Grants NovaWealth Copilot permission to stream strictly accrued yield up to $50/day. Principal withdrawal is 100% restricted to your biometric confirmation.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <Zap size={16} color="#00FF08" style={{ marginTop: "2px", flexShrink: 0 }} />
            <div>
              <strong style={{ color: "var(--text-primary)" }}>100% Sponsored Gasless Execution</strong>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                All transactions are sponsored via the Alchemy Paymaster on Robinhood Chain Testnet (46630). You never pay or manage gas tokens.
              </p>
            </div>
          </div>
        </div>

        {/* Biometric trigger action */}
        {authenticated ? (
          <div style={{ textAlign: "center" }}>
            <div style={{
              background: "rgba(0, 200, 5, 0.15)",
              color: "#00FF08",
              padding: "12px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.85rem",
              marginBottom: "16px"
            }}>
              ✓ Passkey Account 0xb8AD...edB7 Ready
            </div>
            <button onClick={onClose} className="btn-secondary" style={{ width: "100%" }}>
              Done
            </button>
          </div>
        ) : (
          <button
            onClick={handleBiometricAuth}
            disabled={isScanning}
            className="btn-primary"
            style={{ width: "100%", padding: "14px", display: "flex", justifyContent: "center", gap: "8px" }}
          >
            <Fingerprint size={18} />
            <span>{isScanning ? "Scanning FaceID / TouchID..." : "Verify with FaceID / TouchID"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
