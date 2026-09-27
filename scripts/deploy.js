const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("=================================================");
  console.log("Deploying NovaWealth Protocol on Robinhood Chain");
  console.log("Deployer Address:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("Network:", hre.network.name, "(Chain ID:", (await hre.ethers.provider.getNetwork()).chainId, ")");
  console.log("=================================================\n");

  const isTestnet = hre.network.name === "robinhoodTestnet";

  // 1. Resolve USDG Address
  let usdgAddress;
  if (isTestnet) {
    // Official live Paxos USDG on Robinhood Chain Testnet
    usdgAddress = "0x7E955252E15c84f5768B83c41a71F9eba181802F";
    console.log("Using Live Robinhood Testnet Paxos USDG:", usdgAddress);
  } else {
    console.log("Deploying Mock USDG (6 decimals)...");
    const MockUSDG = await hre.ethers.getContractFactory("MockUSDG");
    const usdg = await MockUSDG.deploy();
    await usdg.waitForDeployment();
    usdgAddress = await usdg.getAddress();
    console.log("Mock USDG deployed to:", usdgAddress);
  }

  // 2. Deploy NovaVault
  console.log("\nDeploying NovaVault (ERC-4626)...");
  const NovaVault = await hre.ethers.getContractFactory("NovaVault");
  const vault = await NovaVault.deploy(usdgAddress, deployer.address);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("NovaVault deployed to:", vaultAddress);

  // 3. Deploy StockTokenAdapter
  console.log("\nDeploying StockTokenAdapter...");
  const StockTokenAdapter = await hre.ethers.getContractFactory("StockTokenAdapter");
  const adapter = await StockTokenAdapter.deploy();
  await adapter.waitForDeployment();
  const adapterAddress = await adapter.getAddress();
  console.log("StockTokenAdapter deployed to:", adapterAddress);

  // 4. Deploy YieldStreamer
  console.log("\nDeploying YieldStreamer...");
  const YieldStreamer = await hre.ethers.getContractFactory("YieldStreamer");
  const streamer = await YieldStreamer.deploy(vaultAddress, adapterAddress, usdgAddress, deployer.address);
  await streamer.waitForDeployment();
  const streamerAddress = await streamer.getAddress();
  console.log("YieldStreamer deployed to:", streamerAddress);

  // 5. Authorize YieldStreamer in NovaVault
  console.log("\nConfiguring permissions: authorizing YieldStreamer in NovaVault...");
  const txAuth = await vault.setYieldStreamer(streamerAddress);
  await txAuth.wait();
  console.log("YieldStreamer authorized successfully!");

  // 6. Configure Stock Tokens & Feeds
  const stockTokensConfig = isTestnet
    ? {
        TSLA: { address: "0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E", price: 255n * 10n ** 8n },
        AMZN: { address: "0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02", price: 186n * 10n ** 8n },
        AMD:  { address: "0x71178BAc73cBeb415514eB542a8995b82669778d", price: 156n * 10n ** 8n },
        NFLX: { address: "0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93", price: 710n * 10n ** 8n },
        PLTR: { address: "0x1FBE1a0e43594b3455993B5dE5Fd0A7A266298d0", price: 37n * 10n ** 8n },
      }
    : {};

  const deployedFeeds = {};
  if (isTestnet) {
    console.log("\nConfiguring Chainlink Price Feeds for Live Robinhood Stock Tokens...");
    const MockChainlinkFeed = await hre.ethers.getContractFactory("MockChainlinkFeed");
    for (const [symbol, data] of Object.entries(stockTokensConfig)) {
      const feed = await MockChainlinkFeed.deploy(`${symbol} / USD`, data.price);
      await feed.waitForDeployment();
      const feedAddress = await feed.getAddress();
      deployedFeeds[symbol] = feedAddress;

      const txFeed = await adapter.setPriceFeed(data.address, feedAddress, 86400 * 3); // 3 days for weekend session
      await txFeed.wait();
      console.log(`Configured ${symbol} (${data.address}) with Price Feed: ${feedAddress} ($${Number(data.price) / 1e8})`);
    }
  }

  // 7. Export Deployment Summary for Frontend
  const deploymentData = {
    network: hre.network.name,
    chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    contracts: {
      NovaVault: vaultAddress,
      StockTokenAdapter: adapterAddress,
      YieldStreamer: streamerAddress,
      USDG: usdgAddress,
    },
    stockTokens: stockTokensConfig,
    priceFeeds: deployedFeeds,
    timestamp: new Date().toISOString(),
  };

  const outputPath = path.join(__dirname, "../deployed_contracts.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentData, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value, 2));
  console.log("\n=================================================");
  console.log("Deployment Successful! Saved to deployed_contracts.json");
  console.log("=================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
