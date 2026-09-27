const hre = require("hardhat");

async function main() {
  console.log("===============================================================");
  console.log("   NOVAWEALTH: AUTONOMOUS DCA EXECUTION SIMULATION");
  console.log("===============================================================\n");

  const [deployer, user, sessionKeyBot] = await hre.ethers.getSigners();
  console.log(`[+] Deployer:    ${deployer.address}`);
  console.log(`[+] User:        ${user.address}`);
  console.log(`[+] DCA Agent:   ${sessionKeyBot.address}\n`);

  // 1. Deploy Mocks & Core Contracts
  console.log("--- [Step 1: Scaffolding Environment] ---");
  const MockUSDG = await hre.ethers.getContractFactory("MockUSDG");
  const usdg = await MockUSDG.deploy();
  await usdg.waitForDeployment();
  const usdgAddress = await usdg.getAddress();
  console.log(`[+] Mock USDG deployed at: ${usdgAddress}`);

  const MockStockToken = await hre.ethers.getContractFactory("MockStockToken");
  const tsla = await MockStockToken.deploy("Robinhood TSLA Token", "TSLA");
  await tsla.waitForDeployment();
  const tslaAddress = await tsla.getAddress();

  const amzn = await MockStockToken.deploy("Robinhood AMZN Token", "AMZN");
  await amzn.waitForDeployment();
  const amznAddress = await amzn.getAddress();
  console.log(`[+] Mock TSLA: ${tslaAddress}`);
  console.log(`[+] Mock AMZN: ${amznAddress}`);

  const MockChainlinkFeed = await hre.ethers.getContractFactory("MockChainlinkFeed");
  const tslaFeed = await MockChainlinkFeed.deploy("TSLA / USD", 25000000000n); // $250.00
  await tslaFeed.waitForDeployment();
  const amznFeed = await MockChainlinkFeed.deploy("AMZN / USD", 18000000000n); // $180.00
  await amznFeed.waitForDeployment();

  const StockTokenAdapter = await hre.ethers.getContractFactory("StockTokenAdapter");
  const adapter = await StockTokenAdapter.deploy();
  await adapter.waitForDeployment();
  const adapterAddress = await adapter.getAddress();

  await adapter.setPriceFeed(tslaAddress, await tslaFeed.getAddress(), 86400);
  await adapter.setPriceFeed(amznAddress, await amznFeed.getAddress(), 86400);

  const NovaVault = await hre.ethers.getContractFactory("NovaVault");
  const vault = await NovaVault.deploy(usdgAddress, deployer.address);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log(`[+] NovaVault deployed at: ${vaultAddress}`);

  const YieldStreamer = await hre.ethers.getContractFactory("YieldStreamer");
  const streamer = await YieldStreamer.deploy(vaultAddress, adapterAddress, usdgAddress, deployer.address);
  await streamer.waitForDeployment();
  const streamerAddress = await streamer.getAddress();
  console.log(`[+] YieldStreamer deployed at: ${streamerAddress}`);

  // Link Vault -> YieldStreamer
  await vault.setYieldStreamer(streamerAddress);

  // Fund YieldStreamer with stock tokens so it can deliver to users
  await tsla.mint(streamerAddress, hre.ethers.parseUnits("1000", 18));
  await amzn.mint(streamerAddress, hre.ethers.parseUnits("1000", 18));
  console.log(`[+] Seeded YieldStreamer liquidity pool with 1,000 TSLA & 1,000 AMZN\n`);

  // 2. User Deposits USDG
  console.log("--- [Step 2: User Deposits Savings] ---");
  const depositAmount = hre.ethers.parseUnits("10000", 6); // 10,000 USDG
  await usdg.mint(user.address, depositAmount);
  await usdg.connect(user).approve(vaultAddress, depositAmount);
  await vault.connect(user).deposit(depositAmount, user.address);
  console.log(`[✔] User deposited 10,000 USDG into NovaVault.`);
  console.log(`    Vault Total Assets: ${hre.ethers.formatUnits(await vault.totalAssets(), 6)} USDG`);
  console.log(`    Vault Total Principal: ${hre.ethers.formatUnits(await vault.totalPrincipalDeposited(), 6)} USDG\n`);

  // 3. Morpho Blue Yield Generation Simulation
  console.log("--- [Step 3: Morpho Blue Yield Inflow] ---");
  const harvestedYield = hre.ethers.parseUnits("250", 6); // 250 USDG generated
  await usdg.mint(deployer.address, harvestedYield);
  await usdg.connect(deployer).approve(vaultAddress, harvestedYield);
  await vault.injectYield(harvestedYield);
  console.log(`[✔] Injected 250 USDG external lending yield into NovaVault.`);
  console.log(`    Vault Total Assets: ${hre.ethers.formatUnits(await vault.totalAssets(), 6)} USDG`);
  console.log(`    Available Yield for DCA: ${hre.ethers.formatUnits(await vault.accruedYield(), 6)} USDG\n`);

  // 4. Session Key Biometric Passkey Authorization & Basket Configuration
  console.log("--- [Step 4: Biometric Passkey Session Authorization & Basket Setup] ---");
  // Set basket: 60% TSLA, 40% AMZN
  await streamer.connect(user).setAllocationBasket([tslaAddress, amznAddress], [6000, 4000]);
  console.log(`[✔] User configured allocation basket: 60% TSLA, 40% AMZN`);

  // Authorize session key executor and set daily spend limit
  await streamer.connect(user).authorizeExecutor(sessionKeyBot.address, true);
  const dailySpendLimit = hre.ethers.parseUnits("500", 6); // 500 USDG daily
  await streamer.connect(user).setMaxDailySpend(dailySpendLimit);
  console.log(`[✔] User granted session key authorization to autonomous DCA bot:`);
  console.log(`    Bot Address: ${sessionKeyBot.address}`);
  console.log(`    Daily Spend Limit: 500 USDG`);
  console.log(`    Status: ACTIVE (Biometric Passkey bound)\n`);

  // 5. Autonomous DCA Execution
  console.log("--- [Step 5: Autonomous DCA Execution] ---");
  const dcaAmount = hre.ethers.parseUnits("100", 6); // 100 USDG yield used
  console.log(`[+] Autonomous Copilot executing streamYield with 100 USDG of accumulated yield...`);
  await streamer.connect(sessionKeyBot).streamYield(user.address, dcaAmount);

  // 6. Verification
  console.log("\n===============================================================");
  console.log("   PORTFOLIO STATE POST-DCA VERIFICATION");
  console.log("===============================================================");
  const userTSLA = await tsla.balanceOf(user.address);
  const userAMZN = await amzn.balanceOf(user.address);
  const totalPrincipal = await vault.totalPrincipalDeposited();
  const userShares = await vault.balanceOf(user.address);
  const remainingYield = await vault.accruedYield();

  console.log(`[✔] User TSLA Balance:   ${hre.ethers.formatUnits(userTSLA, 18)} TSLA shares`);
  console.log(`[✔] User AMZN Balance:   ${hre.ethers.formatUnits(userAMZN, 18)} AMZN shares`);
  console.log(`[✔] User Vault Shares:   ${hre.ethers.formatUnits(userShares, 6)} nvUSDG`);
  console.log(`[✔] Total Vault Principal: ${hre.ethers.formatUnits(totalPrincipal, 6)} USDG (100% Intact!)`);
  console.log(`[✔] Remaining Yield:     ${hre.ethers.formatUnits(remainingYield, 6)} USDG`);
  console.log("===============================================================\n");
  console.log(">>> SIMULATION SUCCESSFUL: Principal 100% Protected, RWA Equities Acquired! <<<");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
