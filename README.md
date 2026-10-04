# ⚡ **NovaWealth** — Turn Savings Yield into Wall Street Equities with Zero Capital Risk

[![Deployment Status](https://img.shields.io/badge/Deployment-Live-brightgreen)](https://nova-wealth-bay.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/emarc99/vertex-prosperous)
[![Robinhood Chain](https://img.shields.io/badge/Chain-Robinhood_Testnet_(46630)-00c805?logo=ethereum)](https://explorer.testnet.chain.robinhood.com)
[![Paxos USDG](https://img.shields.io/badge/Settlement-Paxos_USDG_(6_dec)-0052FF)](https://paxos.com/usdg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Built for the **Arbitrum Open House Singapore Buildathon (HackQuest)**  
> Tracks: **Robinhood Chain Track** | **Paxos USDG Bounty Track** | **RWA & Consumer Track**

---

## 📌 **Overview**

**NovaWealth** is an autonomous consumer wealth engine on **Robinhood Chain** that bridges passive cash savings and tokenized US equities with **zero risk to initial capital**.

Instead of letting stablecoin savings sit idle or risking capital chasing volatile stock dips, users deposit **Paxos USDG** into a high-yield Meta-Vault (aligned with Robinhood Earn's MetaMorpho infrastructure) generating ~8.45% APY. An autonomous on-chain engine continuously harvests this pure yield and streams it into fractional **Robinhood Stock Tokens** (`TSLA`, `AMZN`, `AMD`, `NFLX`, `PLTR`) priced by Chainlink oracles—leaving 100% of the user's initial deposit principal safe, intact, and redeemable at any time.

---

## 🚀 **Live Deployments & Quick Links**

* 🔗 **Live Web Application:** [nova-wealth-bay.vercel.app](https://nova-wealth-bay.vercel.app/)
* 🔗 **GitHub Repository:** [github.com/emarc99/vertex-prosperous](https://github.com/emarc99/vertex-prosperous)
* 🔗 **NovaVault Contract:** [`0x6C33f144264a480B3bd414Db39127deC91a3b69D`](https://explorer.testnet.chain.robinhood.com/address/0x6C33f144264a480B3bd414Db39127deC91a3b69D)
* 🔗 **YieldStreamer Contract:** [`0x9693aAd2540D75057D0CDce4c16891230D335A6B`](https://explorer.testnet.chain.robinhood.com/address/0x9693aAd2540D75057D0CDce4c16891230D335A6B)
* 🔗 **StockTokenAdapter:** [`0x3953E210A6F81BBe5d9cAA0BD2Cc89dED255f95E`](https://explorer.testnet.chain.robinhood.com/address/0x3953E210A6F81BBe5d9cAA0BD2Cc89dED255f95E)
* 🔗 **Master Architecture Blueprint:** [BLUEPRINT.md](BLUEPRINT.md)

---

## 🌟 **Key Features**

* 🛡️ **Zero-Principal-Risk Invariant**: Initial USDG deposits are mathematically isolated in `NovaVault.totalPrincipalDeposited`. The autonomous DCA streamer is code-restricted to only touch accrued lending yield above principal.
* 📈 **Smart Cash Yield Engine (~8.45% APY)**: High-yield Paxos USDG cash vault aligned with Robinhood Earn's MetaMorpho lending standards.
* ⚡ **Instant T+0 Liquidity Buffer**: Solves the classic RWA lockup problem. A dedicated 15% liquid buffer guarantees instant cash redemptions with 0s settlement delay.
* 🎯 **Autonomous Equity DCA Streamer**: Users configure a target stock basket on-chain (e.g. 60% TSLA, 40% AMZN); the engine continuously converts micro-yield into real tokenized stocks.
* 📊 **ERC-8056 Scaled UI Amount Extension**: Direct support for Robinhood Stock Tokens (`TSLA`, `AMZN`, `AMD`, `NFLX`, `PLTR`), automatically adjusting for stock splits and dividend multipliers.
* 🤖 **AI Wealth Copilot & Scoped Session Keys**: Conversational portfolio advisor monitoring live Robinhood Chain RPC telemetry with ERC-4337 daily spend caps.

---

## ⚙️ **Technical Details**

| Component | Specification |
| :--- | :--- |
| **Network** | Robinhood Chain Testnet (Chain ID: `46630`) |
| **Settlement Currency** | Paxos USDG (6 decimals) |
| **Smart Contracts** | Solidity `^0.8.24` (ERC-4626 Meta-Vault, ERC-8056 Stock Tokens, Ownable, ReentrancyGuard) |
| **RWA Equities** | TSLA, AMZN, AMD, NFLX, PLTR (ERC-8056, 18 decimals) |
| **Price Feeds** | Chainlink V3 Mock Aggregators (8 decimals) |
| **Account Abstraction** | Scoped Session Keys & Passkeys (`agent/yield_bot.js`) |
| **Frontend** | Next.js 14 (App Router), Vanilla CSS / Tailwind, Ethers.js v6 |
| **Deployment** | Vercel (Edge Network) |

---

## 📐 Architectural Blueprint

For an in-depth technical specification of protocol mechanics, mathematical invariants, and account abstraction policies, refer to the [NovaWealth Master Blueprint](BLUEPRINT.md).

---

## 🏗️ **Architecture & Capital Flow**

```
                      [ Retail Investor ]
                               │
                Deposit Paxos USDG (6 Decimals)
                               ▼
        ┌──────────────────────────────────────────────┐
        │               NovaVault.sol                  │
        │         (ERC-4626 Vault on Robinhood)        │
        └──────────────────────┬───────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
        [ 15% Buffer ]                  [ 85% Active ]
    Instant T+0 Redemptions         Robinhood Earn / MetaMorpho
    (Guaranteed Liquidity)          (8.45% Yield Rail / Settlement)
                                               │
                                      Accrued Yield Only
                                               ▼
                             ┌─────────────────────────────────┐
                             │       YieldStreamer.sol         │
                             │  Autonomous Yield-DCA Engine    │
                             └─────────────────┬───────────────┘
                                               │
                           Verifies Chainlink Feeds & ERC-8056 Multiplier
                                               │
                   ┌───────────────────────────┴───────────────────────────┐
                   ▼                           ▼                           ▼
            [ TSLA Token ]              [ AMZN Token ]              [ AMD / PLTR ]
            (Tokenized RWA)             (Tokenized RWA)             (Tokenized RWA)
```

---

## 📜 **Smart Contract Deployments (Robinhood Chain Testnet)**

All core protocol contracts and stock token adapters are deployed, verified, and operational on the **Robinhood Chain Testnet**:

| Contract / Asset | Ticker / Role | Contract Address | Explorer Link |
| :--- | :---: | :--- | :---: |
| **NovaVault** | `nvUSDG` | `0x6C33f144264a480B3bd414Db39127deC91a3b69D` | [Blockscout](https://explorer.testnet.chain.robinhood.com/address/0x6C33f144264a480B3bd414Db39127deC91a3b69D) |
| **StockTokenAdapter** | Adapter | `0x3953E210A6F81BBe5d9cAA0BD2Cc89dED255f95E` | [Blockscout](https://explorer.testnet.chain.robinhood.com/address/0x3953E210A6F81BBe5d9cAA0BD2Cc89dED255f95E) |
| **YieldStreamer** | DCA Engine | `0x9693aAd2540D75057D0CDce4c16891230D335A6B` | [Blockscout](https://explorer.testnet.chain.robinhood.com/address/0x9693aAd2540D75057D0CDce4c16891230D335A6B) |
| **Paxos Global Dollar** | `USDG` (6 dec) | `0x7E955252E15c84f5768B83c41a71F9eba181802F` | [Blockscout](https://explorer.testnet.chain.robinhood.com/address/0x7E955252E15c84f5768B83c41a71F9eba181802F) |
| **Tesla Stock Token** | `TSLA` (18 dec) | `0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E` | [Blockscout](https://explorer.testnet.chain.robinhood.com/address/0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E) |
| **Amazon Stock Token** | `AMZN` (18 dec) | `0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02` | [Blockscout](https://explorer.testnet.chain.robinhood.com/address/0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02) |
| **AMD Stock Token** | `AMD` (18 dec) | `0x71178BAc73cBeb415514eB542a8995b82669778d` | [Blockscout](https://explorer.testnet.chain.robinhood.com/address/0x71178BAc73cBeb415514eB542a8995b82669778d) |
| **Netflix Stock Token** | `NFLX` (18 dec) | `0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93` | [Blockscout](https://explorer.testnet.chain.robinhood.com/address/0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93) |
| **Palantir Stock Token** | `PLTR` (18 dec) | `0x1FBE1a0e43594b3455993B5dE5Fd0A7A266298d0` | [Blockscout](https://explorer.testnet.chain.robinhood.com/address/0x1FBE1a0e43594b3455993B5dE5Fd0A7A266298d0) |

---

## 🧪 **Verified Live On-Chain Transactions**

The full end-to-end user lifecycle has been executed and confirmed on **Robinhood Chain Testnet (Chain ID: 46630)** from wallet `0xb8AD2787f447e04E8D66D7e888Dd48fB68DdedB7`:

| Action / Flow | Block | Transaction Hash | Explorer Receipt | Status |
| :--- | :---: | :--- | :---: | :---: |
| **1. Configure Stock Basket** (60% TSLA, 40% AMZN) | `#128666287` | `0x6e0921b5857568d1ffdecadff9d18688b5ca4563991dd45b2e442564fc5af439` | [Blockscout](https://explorer.testnet.chain.robinhood.com/tx/0x6e0921b5857568d1ffdecadff9d18688b5ca4563991dd45b2e442564fc5af439) | ✅ Confirmed |
| **2. Authorize Session Key Bot** (DCA Daemon) | `#128666309` | `0xa5bafca75912147cdc07ed07b52245f6f65d7fdd4be9cdc9a58d8f262b0df8fc` | [Blockscout](https://explorer.testnet.chain.robinhood.com/tx/0xa5bafca75912147cdc07ed07b52245f6f65d7fdd4be9cdc9a58d8f262b0df8fc) | ✅ Confirmed |
| **3. Deposit Principal** (10.00 Paxos USDG) | `#128666407` | `0x4b11c57c53a1976181bef6a977cda53d30c0c5deaeb3b97cd962ba539864424b` | [Blockscout](https://explorer.testnet.chain.robinhood.com/tx/0x4b11c57c53a1976181bef6a977cda53d30c0c5deaeb3b97cd962ba539864424b) | ✅ Confirmed |
| **4. Inject External Yield** (+5.00 USDG Lending Yield) | `#128666436` | `0x7257d4e532a96a89e1af680518fea40c897e3aad9fd1b29a6acd71db23f93c8b` | [Blockscout](https://explorer.testnet.chain.robinhood.com/tx/0x7257d4e532a96a89e1af680518fea40c897e3aad9fd1b29a6acd71db23f93c8b) | ✅ Confirmed |
| **5. Stream Yield into Equities** (TSLA + AMZN DCA) | `#128694230` | `0x8366a55a044e9145933e75e678225ed43cafdd4318deb0badae269c75c03e915` | [Blockscout](https://explorer.testnet.chain.robinhood.com/tx/0x8366a55a044e9145933e75e678225ed43cafdd4318deb0badae269c75c03e915) | ✅ Confirmed |

---

## 🛠️ **Local Quickstart**

```bash
# 1. Install frontend dependencies
npm --prefix frontend install

# 2. Start Next.js development server
npm run dev

# 3. Access in browser: http://localhost:3000
```

---

## 📄 **License**
MIT License. Built for the Arbitrum Open House Singapore Buildathon.
