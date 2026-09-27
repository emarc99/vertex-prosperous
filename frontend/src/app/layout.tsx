import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaWealth | Autonomous Consumer Wealth & RWA Copilot",
  description: "High-yield Paxos USDG Smart Cash, T+0 instant liquidity, and no-principal-risk Stock Token DCA on Robinhood Chain.",
  keywords: ["Robinhood Chain", "RWA", "Paxos USDG", "Stock Tokens", "DeFi", "Arbitrum", "Account Abstraction"],
  authors: [{ name: "NovaWealth Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
