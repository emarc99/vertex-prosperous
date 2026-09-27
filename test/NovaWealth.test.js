const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NovaWealth Protocol Suite — Robinhood Chain Architecture", function () {
  let deployer, alice, bob, copilotSessionKey;
  let usdg, novaVault, adapter, yieldStreamer;
  let tslaToken, amznToken, amdToken, pltrToken;
  let tslaFeed, amznFeed, amdFeed, pltrFeed;

  // Constants
  const INITIAL_USDG_BALANCE = 10_000n * 10n ** 6n; // 10,000 USDG (6 decimals)
  const TSLA_PRICE = 250n * 10n ** 8n; // $250.00 (8 decimals)
  const AMZN_PRICE = 180n * 10n ** 8n; // $180.00 (8 decimals)
  const AMD_PRICE = 140n * 10n ** 8n;  // $140.00 (8 decimals)
  const PLTR_PRICE = 30n * 10n ** 8n;  // $30.00 (8 decimals)

  beforeEach(async function () {
    [deployer, alice, bob, copilotSessionKey] = await ethers.getSigners();

    // 1. Deploy Mock Paxos USDG (6 decimals)
    const MockUSDG = await ethers.getContractFactory("MockUSDG");
    usdg = await MockUSDG.deploy();
    await usdg.waitForDeployment();

    // 2. Deploy NovaVault (ERC-4626)
    const NovaVault = await ethers.getContractFactory("NovaVault");
    novaVault = await NovaVault.deploy(await usdg.getAddress(), deployer.address);
    await novaVault.waitForDeployment();

    // 3. Deploy StockTokenAdapter
    const StockTokenAdapter = await ethers.getContractFactory("StockTokenAdapter");
    adapter = await StockTokenAdapter.deploy();
    await adapter.waitForDeployment();

    // 4. Deploy YieldStreamer
    const YieldStreamer = await ethers.getContractFactory("YieldStreamer");
    yieldStreamer = await YieldStreamer.deploy(
      await novaVault.getAddress(),
      await adapter.getAddress(),
      await usdg.getAddress(),
      deployer.address
    );
    await yieldStreamer.waitForDeployment();

    // Link YieldStreamer to NovaVault
    await novaVault.setYieldStreamer(await yieldStreamer.getAddress());

    // 5. Deploy Mock Stock Tokens (18 decimals with ERC-8056)
    const MockStockToken = await ethers.getContractFactory("MockStockToken");
    tslaToken = await MockStockToken.deploy("Tesla Stock Token", "TSLA");
    amznToken = await MockStockToken.deploy("Amazon Stock Token", "AMZN");
    amdToken = await MockStockToken.deploy("AMD Stock Token", "AMD");
    pltrToken = await MockStockToken.deploy("Palantir Stock Token", "PLTR");
    await Promise.all([
      tslaToken.waitForDeployment(),
      amznToken.waitForDeployment(),
      amdToken.waitForDeployment(),
      pltrToken.waitForDeployment(),
    ]);

    // 6. Deploy Mock Chainlink Feeds (8 decimals)
    const MockChainlinkFeed = await ethers.getContractFactory("MockChainlinkFeed");
    tslaFeed = await MockChainlinkFeed.deploy("TSLA / USD", TSLA_PRICE);
    amznFeed = await MockChainlinkFeed.deploy("AMZN / USD", AMZN_PRICE);
    amdFeed = await MockChainlinkFeed.deploy("AMD / USD", AMD_PRICE);
    pltrFeed = await MockChainlinkFeed.deploy("PLTR / USD", PLTR_PRICE);
    await Promise.all([
      tslaFeed.waitForDeployment(),
      amznFeed.waitForDeployment(),
      amdFeed.waitForDeployment(),
      pltrFeed.waitForDeployment(),
    ]);

    // Configure feeds in adapter (24h staleness limit)
    await adapter.setPriceFeed(await tslaToken.getAddress(), await tslaFeed.getAddress(), 86400);
    await adapter.setPriceFeed(await amznToken.getAddress(), await amznFeed.getAddress(), 86400);
    await adapter.setPriceFeed(await amdToken.getAddress(), await amdFeed.getAddress(), 86400);
    await adapter.setPriceFeed(await pltrToken.getAddress(), await pltrFeed.getAddress(), 86400);

    // Distribute testnet USDG to Alice
    await usdg.transfer(alice.address, INITIAL_USDG_BALANCE);
  });

  describe("1. Smart Cash Vault (ERC-4626 & Principal Accounting)", function () {
    it("Should accept 6-decimal USDG deposit and issue 1:1 shares", async function () {
      const depositAmount = 1_000n * 10n ** 6n; // 1,000 USDG
      await usdg.connect(alice).approve(await novaVault.getAddress(), depositAmount);
      await novaVault.connect(alice).deposit(depositAmount, alice.address);

      expect(await novaVault.balanceOf(alice.address)).to.equal(depositAmount);
      expect(await novaVault.totalPrincipalDeposited()).to.equal(depositAmount);
      expect(await novaVault.accruedYield()).to.equal(0n);
      expect(await usdg.balanceOf(await novaVault.getAddress())).to.equal(depositAmount);
    });

    it("Should accurately track protocol yield accrual without altering principal", async function () {
      const depositAmount = 2_000n * 10n ** 6n;
      await usdg.connect(alice).approve(await novaVault.getAddress(), depositAmount);
      await novaVault.connect(alice).deposit(depositAmount, alice.address);

      // Simulate 50 USDG yield accrued from Morpho Blue lending
      const yieldAccrued = 50n * 10n ** 6n;
      await usdg.connect(deployer).approve(await novaVault.getAddress(), yieldAccrued);
      await novaVault.connect(deployer).injectYield(yieldAccrued);

      expect(await novaVault.totalAssets()).to.equal(depositAmount + yieldAccrued);
      expect(await novaVault.totalPrincipalDeposited()).to.equal(depositAmount);
      expect(await novaVault.accruedYield()).to.equal(yieldAccrued);
    });

    it("Should support instantaneous T+0 redemptions of user principal", async function () {
      const depositAmount = 1_000n * 10n ** 6n;
      await usdg.connect(alice).approve(await novaVault.getAddress(), depositAmount);
      await novaVault.connect(alice).deposit(depositAmount, alice.address);

      // Alice withdraws half her principal immediately
      const withdrawAmount = 500n * 10n ** 6n;
      await novaVault.connect(alice).withdraw(withdrawAmount, alice.address, alice.address);

      expect(await novaVault.balanceOf(alice.address)).to.equal(500n * 10n ** 6n);
      expect(await novaVault.totalPrincipalDeposited()).to.equal(500n * 10n ** 6n);
      expect(await usdg.balanceOf(alice.address)).to.equal(INITIAL_USDG_BALANCE - 500n * 10n ** 6n);
    });
  });

  describe("2. StockTokenAdapter & Pricing Feeds", function () {
    it("Should convert 6-decimal USDG to 18-decimal Stock Tokens accurately", async function () {
      // $250 USDG should buy exactly 1.0 TSLA ($250.00 / share)
      const usdgSpend = 250n * 10n ** 6n; // 250 USDG
      const stockTokens = await adapter.calculateStockAmount(await tslaToken.getAddress(), usdgSpend);

      expect(stockTokens).to.equal(1n * 10n ** 18n); // 1.0 TSLA (18 decimals)
    });

    it("Should calculate fractional stock token amounts precisely", async function () {
      // $25 USDG should buy 0.1 TSLA ($250/share)
      const usdgSpend = 25n * 10n ** 6n;
      const stockTokens = await adapter.calculateStockAmount(await tslaToken.getAddress(), usdgSpend);

      expect(stockTokens).to.equal(1n * 10n ** 17n); // 0.1 TSLA
    });

    it("Should handle ERC-8056 corporate split multiplier properly", async function () {
      // Suppose TSLA executes a 2:1 stock split (uiMultiplier = 2e18)
      await tslaToken.setUIMultiplier(2n * 10n ** 18n);

      // For $250 USDG with a 2:1 multiplier, raw tokens received are 0.5 (representing 1.0 split share)
      const usdgSpend = 250n * 10n ** 6n;
      const stockTokens = await adapter.calculateStockAmount(await tslaToken.getAddress(), usdgSpend);

      expect(stockTokens).to.equal(5n * 10n ** 17n); // 0.5 raw tokens
    });
  });

  describe("3. Autonomous Yield Streaming & No-Principal-Risk DCA", function () {
    beforeEach(async function () {
      // Alice deposits 5,000 USDG principal
      const depositAmount = 5_000n * 10n ** 6n;
      await usdg.connect(alice).approve(await novaVault.getAddress(), depositAmount);
      await novaVault.connect(alice).deposit(depositAmount, alice.address);

      // Protocol generates 100 USDG yield from Morpho
      const yieldAccrued = 100n * 10n ** 6n;
      await usdg.connect(deployer).approve(await novaVault.getAddress(), yieldAccrued);
      await novaVault.connect(deployer).injectYield(yieldAccrued);

      // Fund the YieldStreamer contract with stock tokens for test liquidity
      await tslaToken.transfer(await yieldStreamer.getAddress(), 100n * 10n ** 18n);
      await amznToken.transfer(await yieldStreamer.getAddress(), 100n * 10n ** 18n);
      await amdToken.transfer(await yieldStreamer.getAddress(), 100n * 10n ** 18n);
      await pltrToken.transfer(await yieldStreamer.getAddress(), 100n * 10n ** 18n);
    });

    it("Should allow Alice to configure a multi-asset thematic basket", async function () {
      const tokens = [
        await tslaToken.getAddress(),
        await amznToken.getAddress(),
        await amdToken.getAddress(),
      ];
      const weights = [4000, 3000, 3000]; // 40% TSLA, 30% AMZN, 30% AMD (100% total)

      await yieldStreamer.connect(alice).setAllocationBasket(tokens, weights);
      const basket = await yieldStreamer.getUserBasket(alice.address);

      expect(basket.length).to.equal(3);
      expect(basket[0].stockToken).to.equal(tokens[0]);
      expect(basket[0].weightBps).to.equal(4000n);
    });

    it("Should stream strictly accrued yield into stock tokens with zero risk to principal", async function () {
      // 1. Alice sets 50% TSLA and 50% AMZN
      const tokens = [await tslaToken.getAddress(), await amznToken.getAddress()];
      const weights = [5000, 5000];
      await yieldStreamer.connect(alice).setAllocationBasket(tokens, weights);

      // 2. Alice authorizes AI Copilot session key
      await yieldStreamer.connect(alice).authorizeExecutor(copilotSessionKey.address, true);
      await yieldStreamer.connect(alice).setMaxDailySpend(50n * 10n ** 6n); // Max $50/day

      // 3. Copilot triggers yield DCA of $40 USDG
      const streamAmount = 40n * 10n ** 6n;
      await yieldStreamer.connect(copilotSessionKey).streamYield(alice.address, streamAmount);

      // Verify Alice received Stock Tokens:
      // $20 into TSLA @ $250 = 0.08 TSLA
      // $20 into AMZN @ $180 = 0.11111... AMZN
      const aliceTSLA = await tslaToken.balanceOf(alice.address);
      const aliceAMZN = await amznToken.balanceOf(alice.address);

      expect(aliceTSLA).to.equal(8n * 10n ** 16n); // 0.08 TSLA
      expect(aliceAMZN).to.be.gt(1n * 10n ** 17n); // > 0.1 AMZN

      // CRITICAL CHECK: Alice's 5,000 USDG principal is 100% intact!
      expect(await novaVault.balanceOf(alice.address)).to.equal(5_000n * 10n ** 6n);
      expect(await novaVault.totalPrincipalDeposited()).to.equal(5_000n * 10n ** 6n);
      // Accrued yield reduced from 100 to 60 USDG
      expect(await novaVault.accruedYield()).to.equal(60n * 10n ** 6n);
    });

    it("Should prevent spending beyond accrued yield (principal safeguard)", async function () {
      const tokens = [await tslaToken.getAddress()];
      const weights = [10000];
      await yieldStreamer.connect(alice).setAllocationBasket(tokens, weights);

      // There is only 100 USDG yield available; attempting to stream 150 USDG must fail
      const excessAmount = 150n * 10n ** 6n;
      await expect(
        yieldStreamer.connect(alice).streamYield(alice.address, excessAmount)
      ).to.be.revertedWithCustomError(novaVault, "InsufficientYield");
    });

    it("Should enforce session-key daily spend limits", async function () {
      const tokens = [await tslaToken.getAddress()];
      const weights = [10000];
      await yieldStreamer.connect(alice).setAllocationBasket(tokens, weights);

      await yieldStreamer.connect(alice).authorizeExecutor(copilotSessionKey.address, true);
      await yieldStreamer.connect(alice).setMaxDailySpend(20n * 10n ** 6n); // Max $20/day

      // Streaming $30 exceeds the $20 daily limit
      const overLimit = 30n * 10n ** 6n;
      await expect(
        yieldStreamer.connect(copilotSessionKey).streamYield(alice.address, overLimit)
      ).to.be.revertedWithCustomError(yieldStreamer, "DailyLimitExceeded");
    });
  });
});
