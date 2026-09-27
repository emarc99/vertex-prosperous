"use client";

import React, { useState } from "react";
import { Sparkles, Terminal, Send, CheckCircle2, AlertCircle, ArrowUpRight, Cpu } from "lucide-react";
import { CopilotLog, ChatMessage } from "../lib/types";

interface CopilotTerminalProps {
  logs: CopilotLog[];
  onTriggerCopilotAction: (prompt: string) => Promise<string>;
}

export const CopilotTerminal: React.FC<CopilotTerminalProps> = ({
  logs,
  onTriggerCopilotAction,
}) => {
  const [tab, setTab] = useState<"chat" | "telemetry">("chat");
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "copilot",
      text: "👋 Hi! I am your NovaWealth AI Wealth Copilot. I autonomously manage your Paxos USDG yield sweep and dollar-cost average your interest into Robinhood Stock Tokens (TSLA, AMZN, AMD, NFLX, PLTR) with zero risk to your principal. Ask me anything about your portfolio or market sessions!",
      timestamp: "Just now",
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await onTriggerCopilotAction(text);
      const copilotMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "copilot",
        text: response,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "How is my principal 100% protected?",
    "Explain the T+0 instant liquidity buffer",
    "What are Robinhood Stock Tokens?",
    "Check current NYSE/Robinhood trading session",
  ];

  return (
    <div className="glass-panel" style={{ padding: "24px", marginTop: "24px" }}>
      {/* Header with Tab switcher */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "16px",
        marginBottom: "16px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "rgba(139, 92, 246, 0.2)",
            border: "1px solid rgba(139, 92, 246, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Sparkles size={18} color="#A78BFA" />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>AI Wealth Copilot & Telemetry</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Autonomous Session-Key Agent • Market Intelligence • Execution Feed
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: "flex",
          background: "rgba(0, 0, 0, 0.4)",
          padding: "3px",
          borderRadius: "var(--radius-full)"
        }}>
          <button
            onClick={() => setTab("chat")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: tab === "chat" ? "rgba(139, 92, 246, 0.25)" : "transparent",
              color: tab === "chat" ? "#DDD6FE" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Sparkles size={13} />
            <span>Copilot Chat</span>
          </button>
          <button
            onClick={() => setTab("telemetry")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: tab === "telemetry" ? "rgba(0, 200, 5, 0.2)" : "transparent",
              color: tab === "telemetry" ? "#00FF08" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Terminal size={13} />
            <span>Execution Telemetry ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Chat */}
      {tab === "chat" && (
        <div>
          {/* Quick Prompts */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "12px" }}>
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="btn-secondary"
                style={{
                  fontSize: "0.75rem",
                  padding: "4px 12px",
                  whiteSpace: "nowrap",
                  borderRadius: "var(--radius-full)"
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div style={{
            height: "260px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            paddingRight: "8px",
            marginBottom: "16px"
          }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: m.sender === "user" ? "flex-end" : "flex-start"
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    background:
                      m.sender === "user"
                        ? "linear-gradient(135deg, rgba(0, 200, 5, 0.25) 0%, rgba(0, 150, 4, 0.2) 100%)"
                        : "rgba(255, 255, 255, 0.05)",
                    border:
                      m.sender === "user"
                        ? "1px solid rgba(0, 200, 5, 0.4)"
                        : "1px solid var(--border-color)",
                    color: m.sender === "user" ? "#FFFFFF" : "var(--text-primary)"
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: "flex", gap: "6px", alignItems: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                <Sparkles size={14} className="animate-spin" />
                <span>Copilot is reasoning over onchain state...</span>
              </div>
            )}
          </div>

          {/* Chat input box */}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              className="input-field"
              placeholder="Ask your AI Copilot about yields, Stock Tokens, or session keys..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{ fontSize: "0.9rem" }}
            />
            <button onClick={() => handleSend()} className="btn-primary" style={{ padding: "0 20px" }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Execution Telemetry */}
      {tab === "telemetry" && (
        <div style={{ maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          {logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              No automated execution events yet. Deposit Smart Cash and trigger a stream to watch live telemetry!
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 14px",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: log.type === "DCA_EXECUTION" ? "#00FF08" : "#00D8F6"
                  }} />
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{log.title}</span>
                    <span style={{ color: "var(--text-secondary)", marginLeft: "8px" }}>{log.details}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{log.timestamp}</span>
                  {log.txHash && (
                    <a
                      href={`https://explorer.testnet.chain.robinhood.com/tx/${log.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#00D8F6", display: "flex", alignItems: "center", gap: "2px" }}
                    >
                      <span>Tx</span>
                      <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
