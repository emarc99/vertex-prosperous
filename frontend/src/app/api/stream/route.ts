import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import deployedInfo from '@/contracts/deployed.json';

const STREAMER_ABI = [
  "function streamYield(address user, uint256 yieldAmount) external returns (uint256[] memory)"
];

const VAULT_ABI = [
  "function accruedYield() external view returns (uint256)"
];

const OPERATOR_KEY = process.env.DEPLOYER_PRIVATE_KEY || "0x4df3776b2526361346b6518038f03ba7a205f7e4e04970aee5008a90b0ca69b0";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetUser = body.user || "0xb8AD2787f447e04E8D66D7e888Dd48fB68DdedB7";
    const amountUSDG = body.amount || 5.0;

    const provider = new ethers.JsonRpcProvider(deployedInfo.rpcUrl);
    const vault = new ethers.Contract(deployedInfo.contracts.NovaVault, VAULT_ABI, provider);
    const currentYield = await vault.accruedYield().catch(() => BigInt(0));
    const availableUSDG = parseFloat(ethers.formatUnits(currentYield, 6));

    if (availableUSDG < 1.0) {
      return NextResponse.json({
        success: false,
        error: `Insufficient accrued yield in vault (${availableUSDG} USDG available, minimum 1.00 USDG needed). Inject yield in Smart Cash Vault first.`
      }, { status: 400 });
    }

    const actualAmount = Math.min(amountUSDG, availableUSDG);
    const parsedAmount = ethers.parseUnits(actualAmount.toFixed(6), 6);

    const signer = new ethers.Wallet(OPERATOR_KEY, provider);
    const streamer = new ethers.Contract(deployedInfo.contracts.YieldStreamer, STREAMER_ABI, signer);

    const tx = await streamer.streamYield(targetUser, parsedAmount);
    const receipt = await tx.wait(1);

    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      amountStreamed: actualAmount,
      user: targetUser,
      explorerUrl: `https://explorer.testnet.chain.robinhood.com/tx/${tx.hash}`
    });
  } catch (err: any) {
    console.error("API /api/stream error:", err);
    return NextResponse.json({
      success: false,
      error: err.reason || err.message || "Failed to execute on-chain DCA stream"
    }, { status: 500 });
  }
}
