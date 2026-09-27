export interface StockAsset {
  symbol: string;
  name: string;
  address: string;
  priceUSD: number;
  balance: number;
  allocationBps: number;
  color: string;
}

export interface PortfolioState {
  usdgWalletBalance: number;
  vaultDepositUSDG: number;
  accruedYieldUSDG: number;
  totalHarvestedUSDG: number;
  stockHoldings: { [symbol: string]: number };
  totalEquityValueUSD: number;
  totalNetWorthUSD: number;
}

export interface CopilotLog {
  id: string;
  timestamp: string;
  type: "ANALYSIS" | "SESSION_CHECK" | "HARVEST" | "DCA_EXECUTION" | "REBALANCE";
  title: string;
  details: string;
  txHash?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: "SET_BASKET" | "DEPOSIT" | "TRIGGER_STREAM";
    payload?: any;
  };
}
