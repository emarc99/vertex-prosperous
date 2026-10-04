'use client';

import { Navigation } from '@/components/nav';
import { MessageSquare, Send, Bot, Sparkles, Terminal, Activity } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export default function CopilotPage() {
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

    // Contextual response
    setTimeout(() => {
      const lower = query.toLowerCase();
      let response = "I can analyze your portfolio, trigger automated DCA rebalancing, or explain your T+0 liquidity buffer. Try asking about your principal safety, USDG yield, or Robinhood Stock Tokens.";

      if (lower.includes("principal") || lower.includes("safe") || lower.includes("protect")) {
        response = "🛡️ Your initial USDG principal is 100% protected. NovaVault strictly records totalPrincipalDeposited. Only excess yield generated from the lending strategy can ever be harvested for stock token purchases. Your deposit can never be lost.";
      } else if (lower.includes("yield") || lower.includes("apy") || lower.includes("earn")) {
        response = "📈 NovaVault is currently generating ~8.45% APY on Paxos USDG aligned with Robinhood Earn's MetaMorpho infrastructure. You have accrued yield ready for autonomous streaming.";
      } else if (lower.includes("t+0") || lower.includes("withdraw") || lower.includes("liquid")) {
        response = "⚡ NovaVault maintains an onchain 15% instant liquidity buffer. Whenever you request a withdrawal, your cash principal is redeemed instantly at T+0 without waiting for external lending recall.";
      } else if (lower.includes("stock") || lower.includes("token") || lower.includes("basket") || lower.includes("tsla")) {
        response = "🎯 Your target DCA basket is configured for 60% TSLA and 40% AMZN. Stock Token Adapter queries Chainlink 8-decimal feeds and applies ERC-8056 multipliers for any corporate actions.";
      } else if (lower.includes("session") || lower.includes("passkey") || lower.includes("key")) {
        response = "🔑 Your ERC-4337 session key is scoped to a maximum daily spend of $50 USDG. The copilot can only stream accrued yield within your pre-approved daily budget.";
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
    }, 700);
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
