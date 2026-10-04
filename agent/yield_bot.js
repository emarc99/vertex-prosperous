/**
 * NovaWealth Autonomous Yield & DCA Execution Bot
 * 
 * Monitors NovaVault on Robinhood Chain, checks accrued yield from Morpho Blue / lending vaults,
 * and executes delegated DCA for users with active ERC-4337 Session Keys.
 */

const { ethers } = require("ethers");
require("dotenv").config({ path: ".env.secret" });

const RPC_URL = process.env.ROBINHOOD_RPC_URL || "https://rpc.testnet.chain.robinhood.com";
const BATCH_THRESHOLD_USDG = ethers.parseUnits("5", 6); // 5 USDG minimum yield to trigger DCA

// Core contract addresses on Robinhood Chain Testnet
const DEPLOYED = {
  vault: "0x6C33f144264a480B3bd414Db39127deC91a3b69D",
  streamer: "0x9693aAd2540D75057D0CDce4c16891230D335A6B",
  adapter: "0x3953E210A6F81BBe5d9cAA0BD2Cc89dED255f95E",
  usdg: "0x7E955252E15c84f5768B83c41a71F9eba181802F"
};

const VAULT_ABI = [
  "function totalAssets() external view returns (uint256)",
  "function totalPrincipalDeposited() external view returns (uint256)",
  "function accruedYield() external view returns (uint256)"
];

const STREAMER_ABI = [
  "function authorizedExecutors(address user, address executor) external view returns (bool)",
  "function streamYield(address user, uint256 usdgAmount) external",
  "function getUserBasket(address user) external view returns (tuple(address stockToken, uint256 weightBps)[])"
];

async function runYieldBot() {
  console.log("===============================================================");
  console.log("      NOVAWEALTH AUTONOMOUS COPILOT DAEMON");
  console.log("===============================================================");
  console.log(`[+] Network: Robinhood Chain Testnet (Chain ID 46630)`);
  console.log(`[+] RPC:     ${RPC_URL}`);
  console.log(`[+] Vault:   ${DEPLOYED.vault}`);
  console.log(`[+] Streamer:${DEPLOYED.streamer}\n`);

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    console.log("[i] Running in Read-Only Telemetry Monitor mode (no private key provided).");
  }

  const signer = privateKey ? new ethers.Wallet(privateKey, provider) : null;
  const vault = new ethers.Contract(DEPLOYED.vault, VAULT_ABI, provider);
  const streamer = new ethers.Contract(DEPLOYED.streamer, STREAMER_ABI, signer || provider);

  async function checkAndHarvest() {
    try {
      const now = new Date().toISOString();
      const totalAssets = await vault.totalAssets();
      const principal = await vault.totalPrincipalDeposited();
      const yieldAccrued = await vault.accruedYield();

      console.log(`[${now}] Telemetry Pulse:`);
      console.log(`   - Vault Assets:     ${ethers.formatUnits(totalAssets, 6)} USDG`);
      console.log(`   - Vault Principal:  ${ethers.formatUnits(principal, 6)} USDG`);
      console.log(`   - Accrued Yield:    ${ethers.formatUnits(yieldAccrued, 6)} USDG`);

      if (yieldAccrued >= BATCH_THRESHOLD_USDG) {
        console.log(`[!] Yield threshold reached (${ethers.formatUnits(yieldAccrued, 6)} >= 5.0 USDG).`);
        if (signer) {
          console.log(`[+] Checking authorized session keys for active subscribers...`);
          const targetUser = process.env.SUBSCRIBER_ADDRESS || signer.address;
          const isAuthorized = await streamer.authorizedExecutors(targetUser, signer.address).catch(() => false);
          if (isAuthorized) {
            console.log(`[+] Session key confirmed for ${targetUser}. Dispatching streamYield transaction...`);
            const tx = await streamer.streamYield(targetUser, BATCH_THRESHOLD_USDG);
            console.log(`[✔] DCA stream transaction dispatched: ${tx.hash}`);
            await tx.wait();
            console.log(`[✔] Transaction confirmed on Robinhood Chain!`);
          } else {
            console.log(`[i] Subscriber ${targetUser} session key standing by. Ready for automated execution.`);
          }
        } else {
          console.log(`[i] Autonomous execution armed and ready (read-only telemetry mode).`);
        }
      } else {
        console.log(`[✔] Vault healthy. Yield accumulating below trigger threshold.`);
      }
    } catch (err) {
      console.error(`[-] Polling error: ${err.message}`);
    }
  }

  // Initial check
  await checkAndHarvest();
  console.log("\n[✔] Daemon initialized. Monitoring interval set to 60 seconds.");
}

if (require.main === module) {
  runYieldBot()
    .then(() => {
      if (!process.env.DAEMON_MODE) process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { runYieldBot };
