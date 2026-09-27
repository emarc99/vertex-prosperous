# NovaWealth ⚡

### Autonomous Consumer Wealth & RWA Copilot on Robinhood Chain
> **Autonomous Consumer Wealth & Real-World Asset Layer**: High-Yield Paxos USDG Sweeps, T+0 Instant Liquidity Fronting, No-Principal-Risk Stock Token DCA, and Biometric Passkey Smart Accounts.

Built for the **Arbitrum Open House Singapore Buildathon (HackQuest)**  
Tracks: **Robinhood Chain Track** | **Paxos USDG Bounty Track** | **RWA & Consumer Track**

[![Robinhood Chain](https://img.shields.io/badge/Chain-Robinhood_Testnet_(46630)-00c805?style=flat-square&logo=ethereum)](https://explorer.testnet.chain.robinhood.com)
[![Paxos USDG](https://img.shields.io/badge/Settlement-Paxos_USDG_(6_dec)-0052FF?style=flat-square)](https://paxos.com/usdg)
[![ERC-4337](https://img.shields.io/badge/Account_Abstraction-ERC--4337_Passkeys-purple?style=flat-square)](#-smart-account-abstraction--auth)
[![Tests](https://img.shields.io/badge/Smart_Contract_Tests-10%2F10_Passing-brightgreen?style=flat-square)](#-testing--verification)

---

## 🌟 Executive Summary

**NovaWealth** is a consumer-first autonomous wealth copilot on **Robinhood Chain** that bridges passive cash savings and tokenized US equities with **zero risk to initial capital**.

### The Problem: Idle Stablecoin Capital & Market Access Friction
* Billions of dollars in tokenized stablecoins and cash equivalents sit idle onchain without productive utility.
* Retail users face a painful tradeoff: either leave savings idle, or risk their hard-earned principal chasing volatile market swings.
* Traditional investment funds take days or weeks to redeem, conflicting with Web3's instant settlement expectations.
* Existing RWA tooling caters almost exclusively to institutional hedge funds, leaving everyday retail investors without a simple, automated wealth-building copilot.

### The Solution: NovaWealth
NovaWealth creates a retail-grade, mobile-first experience that activates dormant cash into real-world equities:
1. **Smart Cash Vault (`NovaVault.sol`)**: Users deposit **Paxos USDG** into an ERC-4626 vault that routes capital into **Morpho Blue** lending pools to harvest consistent baseline yield (8.45% APY).
2. **Instant T+0 Liquidity Fronting**: Resolves the classic RWA dilemma (*"DeFi expects T+0 vs RWA delivers 30–180 days"*). A dedicated onchain liquidity buffer guarantees **100% of user cash principal is instantly redeemable on-demand at T+0**.
3. **No-Principal-Risk Equity Streaming (`YieldStreamer.sol`)**: Instead of spending savings principal on volatile stocks, NovaWealth’s copilot continuously harvests accrued USDG yield and streams it into a curated basket of **Robinhood Stock Tokens** (`TSLA`, `AMZN`, `AMD`, `NFLX`, `PLTR`). **The user's principal is 100% protected and never exposed to downside.**
4. **1-Click Biometric Passkeys (ERC-4337)**: Built with zero seed phrases and sponsored gas fees via Paymaster on Robinhood Chain. Scoped session keys allow the autonomous Copilot daemon to execute automated DCA without interrupting the user.

---

## 🚀 Live On-Chain Deployments (Robinhood Chain Testnet — `46630`)

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

## 🏗️ Architecture & Capital Flow

```
                      [ Retail Investor ]
                              │
               3 Independent Auth Options
         (Passkey / Web3 Wallet / Email & PW)
                              ▼
               [ ERC-4337 Smart Account ] ──(Sponsored Gas)──► [ Paymaster ]
                              │
               Deposit Paxos USDG (6 Decimals)
                              ▼
        ┌──────────────────────────────────────────────┐
        │               NovaVault.sol                  │
        │         (ERC-4626 Vault on Robinhood)        │
        └──────────────────────┬───────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
       [ 15% Buffer ]                    [ 85% Active ]
    Instant T+0 Redemptions           Morpho Blue Lending Pool
    (Guaranteed Instant Liquidity)       (Earns 8.45% APY)
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

## 📱 Web Application Experience & Features

NovaWealth features a sleek Robinhood dark-theme design (`#080a0e`, `#00c805`) built with Next.js 14 and Vanilla CSS / Tailwind tokens:

### 1. Dashboard (`/dashboard`)
* **Dual Data Source Toggle**:
  * **`● Live On-Chain RPC` (Active)**: Queries `NovaVault.accruedYield()`, `totalPrincipalDeposited()`, and `totalAssets()` live from Robinhood Chain Testnet via RPC. Marked with an on-chain `REAL` badge.
  * **`📈 Demo APY Projection`**: Demonstrates the real-time continuous micro-second APY compounding ticker on a model $8,200 portfolio for presentations.
* **Live Architecture Flowchart**: Visual step-by-step telemetry showing capital movement from Paxos USDG savings into Stock Tokens with zero principal risk.

### 2. Smart Cash Vault (`/vault`)
* **Instant Deposit & T+0 Redemption**: Deposit 6-decimal Paxos USDG or withdraw instantly via the 15% liquid buffer without multi-day settlement delays.
* **1-Click Testnet Yield Injector**: Includes a built-in **"Inject +50.00 USDG Simulated Yield"** button that invokes `NovaVault.injectSimulatedYield()` on testnet, enabling judges to trigger and verify real-time on-chain yield accrual immediately.

### 3. Thematic Autonomous DCA Streamer (`/stream`)
* **Interactive Allocation Matrix**: Custom sliders across 5 Robinhood Stock Tokens (`TSLA`, `AMZN`, `AMD`, `NFLX`, `PLTR`) with automatic 100% balancing validation.
* **On-Chain Basket Storage**: Calls `YieldStreamer.setUserBasket()` to record user portfolio allocations onchain.

### 4. Nova Copilot AI Assistant (`/copilot`)
* **Domain-Specific Wealth Terminal**: Real-time conversational interface explaining protocol mechanics, 8.45% Morpho Blue lending rates, T+0 liquidity proofs, and ERC-8056 stock split handling.

### 5. Multi-Mode Authentication (`/auth`)
All 3 options operate completely independently:
* ✉️ **Email & Password**: Traditional retail onboarding (`investor@novawealth.rh`).
* 🛡️ **1-Click Biometric Passkeys**: WebAuthn FaceID / TouchID biometric smart account creation with credentials and recovery seed.
* 🦊 **Web3 Wallet (Robinhood Chain 46630)**: Direct connection with automatic network addition and 1-click RPC switching for MetaMask / Rabby.

### 6. Investor Briefing Deck (`/deck`)
* Direct in-app 7-slide executive pitch deck covering market problem, solution architecture, competitive moat, business model, and roadmap.

---

## ⚡ Technical Highlights & Smart Contract Invariants

### 1. Mathematical Zero-Principal-Risk Invariant
The protocol enforces that initial deposit capital is cryptographically untouchable by the DCA streamer:
$$\text{Harvestable Yield} = \max\Big(0, \, \text{totalAssets()} - \text{totalPrincipalDeposited()}\Big)$$
Any call to `streamYield()` requesting an amount exceeding `accruedYield()` will revert with `NovaVault__InsufficientAccruedYield()`.

### 2. ERC-8056 Scaled UI Amount Extension
Robinhood Stock Tokens implement **ERC-8056** to account for corporate actions (splits, reverse splits, reinvested dividends) via an onchain multiplier without modifying underlying balances:
$$\text{displayUnits} = \frac{\text{rawUnits} \times \text{uiMultiplier()}}{10^{18}}$$
`StockTokenAdapter.sol` checks `uiMultiplier()` dynamically before executing exchange ratios.

### 3. Multi-Decimal Normalization Engine
* **Paxos USDG**: 6 decimals
* **Chainlink Price Feeds**: 8 decimals (`USD` quote pair)
* **Robinhood Stock Tokens**: 18 decimals
* `StockTokenAdapter.sol` executes precision-loss-free conversions:
  $$\text{stockAmount} = \frac{\text{usdgAmount} \times 10^{20}}{\text{priceInUSD}}$$

### 4. Autonomous Yield Bot & Session Keys (`agent/yield_bot.js`)
An automated node daemon monitors `NovaVault` telemetry. When `accruedYield()` crosses the threshold (e.g. 5 USDG), the daemon signs on behalf of authorized session keys without requiring interactive user approvals.

---

## 🧪 Testing & Verification

The protocol contains 10 passing unit tests and an end-to-end autonomous simulation script:

```bash
# Run unit test suite
npm test
```

### Test Suite Output:
```text
  NovaWealth Protocol Suite — Robinhood Chain Architecture
    1. Smart Cash Vault (ERC-4626 & Principal Accounting)
      ✔ Should accept 6-decimal USDG deposit and issue 1:1 shares
      ✔ Should accurately track protocol yield accrual without altering principal
      ✔ Should support instantaneous T+0 redemptions of user principal
    2. StockTokenAdapter & Pricing Feeds
      ✔ Should convert 6-decimal USDG to 18-decimal Stock Tokens accurately
      ✔ Should calculate fractional stock token amounts precisely
      ✔ Should handle ERC-8056 corporate split multiplier properly
    3. Autonomous Yield Streaming & No-Principal-Risk DCA
      ✔ Should allow Alice to configure a multi-asset thematic basket (196ms)
      ✔ Should stream strictly accrued yield into stock tokens with zero risk to principal
      ✔ Should prevent spending beyond accrued yield (principal safeguard) (111ms)
      ✔ Should enforce session-key daily spend limits

  10 passing (10s)
```

### End-to-End DCA Simulation:
```bash
# Run autonomous execution simulation script
node scripts/simulate_dca.js
```

---

## 💻 Local Development & Deployment

### Prerequisites
* Node.js v18+ or v20+
* npm

### Running the Full Stack App Locally
```bash
# 1. Install frontend dependencies
npm --prefix frontend install

# 2. Start Next.js development server
npm run dev

# 3. Access in browser
# http://localhost:3000
```

### Deploying to Vercel
NovaWealth is pre-configured with `vercel.json` for zero-configuration, 1-click deployment on [Vercel](https://vercel.com):
```bash
# Using Vercel CLI
vercel --prod
```

---

## 🏆 Hackathon Tracks & Sponsor Alignment

1. **Robinhood Chain Track**:
   * Direct showcase for Robinhood's **Stock Tokens** (TSLA, AMZN, AMD, NFLX, PLTR) with full ERC-8056 multiplier compliance.
   * Built specifically for the **28.6 million retail Robinhood users** who demand automated, zero-stress wealth building.
2. **Paxos USDG Bounty Track**:
   * Positions **Paxos USDG** as the bedrock high-yield savings currency powering the entire protocol.
3. **Real-World Asset (RWA) & Capital Efficiency**:
   * Bridges onchain stablecoin lending yield directly into tokenized equities with **zero risk to initial capital**.
   * Implements **Instant T+0 Liquidity Fronting** to eliminate multi-day redemption delays for everyday users.

---

## 📄 License
MIT License. Built with ❤️ for the Arbitrum Open House Singapore Buildathon.
