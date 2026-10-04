import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import deployedInfo from '@/contracts/deployed.json';

const STREAMER_ABI = [
  "function setAllocationBasket(address[] calldata tokens, uint256[] calldata weightsBps) external"
];

const OPERATOR_KEY = process.env.DEPLOYER_PRIVATE_KEY || "0x4df3776b2526361346b6518038f03ba7a205f7e4e04970aee5008a90b0ca69b0";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const tokens: string[] = body.tokens || [deployedInfo.stockTokens.TSLA.address, deployedInfo.stockTokens.AMZN.address];
    const weightsBps: number[] = body.weightsBps || [6000, 4000];

    const provider = new ethers.JsonRpcProvider(deployedInfo.rpcUrl);
    const signer = new ethers.Wallet(OPERATOR_KEY, provider);
    const streamer = new ethers.Contract(deployedInfo.contracts.YieldStreamer, STREAMER_ABI, signer);

    const tx = await streamer.setAllocationBasket(tokens, weightsBps);
    const receipt = await tx.wait(1);

    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      explorerUrl: `https://explorer.testnet.chain.robinhood.com/tx/${tx.hash}`
    });
  } catch (err: any) {
    console.error("API /api/basket error:", err);
    return NextResponse.json({
      success: false,
      error: err.reason || err.message || "Failed to save on-chain allocation basket"
    }, { status: 500 });
  }
}
