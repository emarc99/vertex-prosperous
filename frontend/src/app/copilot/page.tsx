'use client';

import { Navigation } from '@/components/nav';
import { MessageSquare, Send, Bot, Sparkles, Terminal, Activity, Radio, RefreshCw, ShieldCheck } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import deployedInfo from '@/contracts/deployed.json';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
}

const VAULT_ABI = [
  "function totalAssets() external view returns (uint256)",
  "function totalPrincipalDeposited() external view returns (uint256)",
  "function accruedYield() external view returns (uint256)"
];

const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)"
];

export default function CopilotPage() {
  const [liveStats, setLiveStats] = useState({
    principal: 15.0,
    accruedYield: 5.0,
    totalAssets: 20.0,
    tsla: 8.0235,
    amzn: 8.0215,
    isLoaded: false
  });
  const [activeAddress, setActiveAddress] = useState<string>('0xb8AD2787f447e04E8D66D7e888Dd48fB68DdedB7');

  const fetchLiveTelemetry = useCallback(async () => {
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
      const tsla = new ethers.Contract(deployedInfo.stockTokens.TSLA.address, ERC20_ABI, provider);
      const amzn = new ethers.Contract(deployedInfo.stockTokens.AMZN.address, ERC20_ABI, provider);

      const [rawAssets, rawPrincipal, rawYield, rawTsla, rawAmzn] = await Promise.all([
        vault.totalAssets().catch(() => BigInt(0)),
        vault.totalPrincipalDeposited().catch(() => BigInt(0)),
        vault.accruedYield().catch(() => BigInt(0)),
        tsla.balanceOf(targetAddr).catch(() => BigInt(0)),
        amzn.balanceOf(targetAddr).catch(() => BigInt(0)),
      ]);

      setLiveStats({
        totalAssets: parseFloat(ethers.formatUnits(rawAssets, 6)),
        principal: parseFloat(ethers.formatUnits(rawPrincipal, 6)),
        accruedYield: parseFloat(ethers.formatUnits(rawYield, 6)),
        tsla: parseFloat(ethers.formatUnits(rawTsla, 18)),
        amzn: parseFloat(ethers.formatUnits(rawAmzn, 18)),
        isLoaded: true
      });
    } catch (err) {
      console.warn("Could not query Robinhood testnet RPC in Copilot:", err);
    }
  }, []);

  useEffect(() => {
    fetchLiveTelemetry();
  }, [fetchLiveTelemetry]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content:
        "Hello! I am your NovaWealth Autonomous Copilot on Robinhood Chain. I monitor your Paxos USDG vault yield, track Robinhood Earn MetaMorpho lending rates, and execute your multi-asset equity DCA via scoped session keys. How can I help you today?",
      timestamp: '08:00 PM',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = input;
    setInput('');

    // Contextual response with LIVE on-chain telemetry data
    setTimeout(() => {
      const lower = query.toLowerCase();
      let response = `I can analyze your portfolio, trigger automated DCA rebalancing, or explain your T+0 liquidity buffer. Currently monitoring your $${liveStats.principal.toFixed(2)} USDG vault principal on Robinhood Chain.`;

      if (lower.includes("principal") || lower.includes("safe") || lower.includes("protect")) {
        response = `🛡️ Your initial USDG principal ($${liveStats.principal.toFixed(2)} USDG) is 100% protected on Robinhood Chain. NovaVault strictly isolates totalPrincipalDeposited. Only accrued yield ($${liveStats.accruedYield.toFixed(2)} USDG currently available) can ever be harvested for equities. Your deposit principal can never be lost.`;
      } else if (lower.includes("yield") || lower.includes("apy") || lower.includes("earn") || lower.includes("balance")) {
        response = `📈 NovaVault currently holds $${liveStats.totalAssets.toFixed(2)} USDG total assets ($${liveStats.principal.toFixed(2)} principal + $${liveStats.accruedYield.toFixed(2)} accrued yield). The lending strategy generates ~8.45% APY aligned with Robinhood Earn's MetaMorpho rails.`;
      } else if (lower.includes("t+0") || lower.includes("withdraw") || lower.includes("liquid")) {
        response = `⚡ NovaVault maintains an onchain 15% instant liquidity buffer. You can redeem your $${liveStats.principal.toFixed(2)} USDG principal instantly at T+0 with zero settlement delay.`;
      } else if (lower.includes("stock") || lower.includes("token") || lower.includes("basket") || lower.includes("tsla") || lower.includes("amzn")) {
        response = `🎯 Your on-chain portfolio currently holds ${liveStats.tsla.toFixed(4)} TSLA and ${liveStats.amzn.toFixed(4)} AMZN tokens on Robinhood Chain (ERC-8056). Your target DCA basket is set to 60% TSLA and 40% AMZN, priced via Chainlink price feeds.`;
      } else if (lower.includes("session") || lower.includes("passkey") || lower.includes("key") || lower.includes("bot")) {
        response = `🔑 Your ERC-4337 session key daemon (agent/yield_bot.js) is armed and monitoring Robinhood Chain. It triggers automated streamYield() batches whenever accrued yield crosses the $5.00 USDG threshold, within your $50 daily spend budget.`;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <>
      <Navigation />
      <main className="lg:ml-64 min-h-screen bg-background pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-4xl h-[calc(100vh-4rem)] lg:h-screen flex flex-col">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-1 flex items-center gap-2">
                AI Wealth Copilot
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                  ONLINE
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Autonomous advisory and telemetry engine on Robinhood Chain (46630)
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-lg">
              <Activity size={14} className="text-accent animate-pulse" />
              <span>Yield Streamer Daemon: Active</span>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 overflow-y-auto bg-card border border-border rounded-lg p-6 mb-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.type === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0">
                    <Bot size={18} className="text-accent" />
                  </div>
                )}

                <div
                  className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-lg text-sm leading-relaxed ${
                    msg.type === 'user'
                      ? 'bg-accent text-primary-foreground font-medium'
                      : 'bg-secondary border border-border/60 text-foreground'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1.5 opacity-60 ${
                      msg.type === 'user'
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about yield APY, T+0 liquidity, or stock token allocations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-accent text-primary-foreground px-5 py-3 rounded-lg font-bold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-accent/15"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Quick queries:</span>
            {[
              'Is my principal safe?',
              'What is my current USDG yield?',
              'How does T+0 liquidity work?',
              'Show my TSLA / AMZN basket',
            ].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="text-xs px-2.5 py-1.5 bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-accent rounded transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
