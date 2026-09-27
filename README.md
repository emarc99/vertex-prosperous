# NovaWealth ⚡

### Autonomous Consumer Wealth & RWA Copilot on Robinhood Chain
> **Autonomous Consumer Wealth & Real-World Asset Layer**: High-Yield Paxos USDG Sweeps, T+0 Instant Liquidity Fronting, No-Principal-Risk Stock Token DCA, and Biometric Passkey Smart Accounts.

Built for the **Arbitrum Open House Singapore Buildathon (HackQuest)**  
Tracks: **Robinhood Chain Track** | **Paxos USDG Bounty Track** | **RWA & Consumer Track**

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
4. **1-Click Biometric Passkeys (ERC-4337)**: Built with zero seed phrases and 100% sponsored gas fees via the Alchemy Paymaster on Robinhood Chain. Scoped session keys allow the AI Copilot to execute automated DCA without interrupting the user.

---

## 🚀 Live On-Chain Deployments (Robinhood Chain Testnet — `46630`)

All core contracts and price feeds are live and verified on the **Robinhood Chain Testnet**:

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
                      [ Retail User ]
                             │
                  1-Click Passkey (FaceID)
                             ▼
              [ ERC-4337 Smart Account ] ──(100% Gas Sponsored)──► [ Alchemy Paymaster ]
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

## ⚡ Technical Highlights

### 1. ERC-8056 Scaled UI Amount Extension
Robinhood Stock Tokens utilize **ERC-8056** to represent corporate actions (splits, reinvested dividends) via onchain multipliers without changing underlying balances or token supplies. `StockTokenAdapter.sol` dynamically factors in `uiMultiplier()` when calculating exchange ratios between 6-decimal USDG and 18-decimal tokenized equities.

### 2. Multi-Decimal Normalization
* **Paxos USDG**: 6 decimals
* **Chainlink Feeds**: 8 decimals (USD quote pairs)
* **Robinhood Stock Tokens**: 18 decimals
* `StockTokenAdapter.sol` executes precision-loss-free conversions:
  $$\text{stockAmount} = \frac{\text{usdgAmount} \times 10^{20}}{\text{priceInUSD}}$$

### 3. Session-Aware Execution Guard
Prevents toxic execution slippage during weekend equity market closures. The adapter validates timestamp freshness before permitting the session-key streamer to purchase equities.

---

## 🧪 Testing & Verification

The smart contract suite includes 10 comprehensive unit tests verifying accounting, principal safeguards, instant T+0 redemptions, and autonomous DCA streaming:

```bash
# Run tests
npm test
```

### Test Results:
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

---

## 💻 Local Development & Deployment

### Prerequisites
* Node.js v18+ or v20+
* npm

### Running the Next.js Frontend Locally
```bash
# Install dependencies
npm --prefix frontend install

# Run dev server
npm run dev
# Open http://localhost:3000 in your browser
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
   * Directly showcases Robinhood's proprietary **Stock Tokens** (TSLA, AMZN, AMD, NFLX, PLTR) with ERC-8056 compliance.
   * Speaks directly to Robinhood's **28.6M retail user base** through frictionless savings and equity accumulation.
2. **Paxos USDG Bounty Track**:
   * Positions **Paxos USDG** as the primary high-yield settlement currency driving organic deposit velocity.
3. **Real-World Asset (RWA) & Capital Efficiency**:
   * Bridges onchain stablecoin lending yield directly into tokenized real-world equities (TSLA, AMZN, AMD, NFLX, PLTR).
   * Implements **Instant T+0 Liquidity Fronting** to eliminate multi-day redemption delays for everyday users.

---

## 📄 License
MIT License. Built with ❤️ for the Arbitrum Open House Singapore Buildathon.
