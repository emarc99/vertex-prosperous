"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Wallet,
  Zap,
  MessageSquare,
  LogIn,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
  Droplets,
  Smartphone,
  UserCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import deployedInfo from "../contracts/deployed.json";

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authMethod, setAuthMethod] = useState<string>("passkey");
  const [userDisplay, setUserDisplay] = useState<string>("0xb8AD...edB7");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMethod = localStorage.getItem("nova_auth_method") || "passkey";
      setAuthMethod(storedMethod);

      if (storedMethod === "email") {
        const email = localStorage.getItem("nova_user_email") || "investor@novawealth.rh";
        setUserDisplay(email);
      } else if (storedMethod === "wallet") {
        const addr = localStorage.getItem("nova_user_address") || (window as any).ethereum?.selectedAddress || "0xb8AD...edB7";
        setUserDisplay(addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr);
      } else {
        const addr = localStorage.getItem("nova_user_address") || "0xb8AD2787f447e04E8D66D7e888Dd48fB68DdedB7";
        setUserDisplay(`${addr.slice(0, 6)}...${addr.slice(-4)}`);
      }
    }
  }, [pathname]);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/vault", label: "Smart Vault", icon: Wallet },
    { href: "/stream", label: "Equity Studio", icon: Zap },
    { href: "/copilot", label: "AI Copilot", icon: MessageSquare },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-40">
        <Link href="/" className="text-accent font-bold text-lg flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          NovaWealth
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground hover:text-accent p-2"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="lg:hidden fixed top-16 left-0 right-0 bg-card border-b border-border z-30 py-4 px-4 shadow-2xl">
          <div className="flex flex-col gap-2">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-accent text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <Link
              href="/auth"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary mt-2 border border-border"
            >
              {authMethod === "passkey" ? <Smartphone size={18} className="text-accent" /> : authMethod === "wallet" ? <Wallet size={18} className="text-accent" /> : <UserCheck size={18} className="text-accent" />}
              <span>{authMethod.toUpperCase()}: {userDisplay}</span>
            </Link>
            <a
              href="https://faucet.paxos.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-accent border border-accent/40 bg-accent/10 mt-2"
            >
              <Droplets size={14} /> Get Testnet USDG Faucet
            </a>
          </div>
        </nav>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:flex lg:flex-col lg:w-64 lg:h-screen lg:bg-card lg:border-r lg:border-border lg:z-40">
        <div className="p-6 border-b border-border">
          <Link href="/" className="text-accent font-bold text-xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            NovaWealth
          </Link>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
              Robinhood Chain (46630)
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1.5">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-accent text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              RWA Protocol
            </p>
            <div className="space-y-1 text-xs">
              <a
                href={`${deployedInfo.blockExplorer}/address/${deployedInfo.contracts.NovaVault}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <span>NovaVault (nvUSDG)</span>
                <ExternalLink size={12} />
              </a>
              <a
                href={`${deployedInfo.blockExplorer}/address/${deployedInfo.contracts.YieldStreamer}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <span>YieldStreamer DCA</span>
                <ExternalLink size={12} />
              </a>
              <a
                href="https://faucet.paxos.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-accent hover:bg-accent/10 transition-colors font-medium"
              >
                <span className="flex items-center gap-1.5"><Droplets size={12} /> USDG Faucet</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </nav>

        {/* Footer User Info */}
        <div className="p-4 border-t border-border bg-card">
          <Link
            href="/auth"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-foreground bg-secondary/80 border border-border hover:border-accent transition-colors w-full group"
          >
            <div className="flex items-center gap-2">
              {authMethod === "passkey" ? (
                <ShieldCheck size={16} className="text-accent flex-shrink-0" />
              ) : authMethod === "wallet" ? (
                <Wallet size={16} className="text-accent flex-shrink-0" />
              ) : (
                <UserCheck size={16} className="text-accent flex-shrink-0" />
              )}
              <div className="truncate">
                <p className="font-semibold text-foreground text-[11px] truncate">
                  {authMethod === "passkey" ? "Passkey Smart Account" : authMethod === "wallet" ? "Web3 Wallet (46630)" : "Investor Account"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{userDisplay}</p>
              </div>
            </div>
            <span className="text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">
              Switch
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
