export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

export const NOVA_VAULT_ABI = [
  "function asset() view returns (address)",
  "function totalAssets() view returns (uint256)",
  "function totalPrincipalDeposited() view returns (uint256)",
  "function accruedYield() view returns (uint256)",
  "function totalYieldHarvested() view returns (uint256)",
  "function liquidityBufferBps() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function deposit(uint256 assets, address receiver) returns (uint256)",
  "function withdraw(uint256 assets, address receiver, address owner) returns (uint256)",
  "function harvestYield(uint256 amount, address recipient) returns (uint256)",
  "function injectYield(uint256 amount)",
  "event YieldHarvested(address indexed recipient, uint256 amount)",
  "event YieldSimulated(uint256 amountAdded, uint256 newTotalYield)",
  "event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)",
  "event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)"
];

export const YIELD_STREAMER_ABI = [
  "function vault() view returns (address)",
  "function adapter() view returns (address)",
  "function usdg() view returns (address)",
  "function userMaxDailySpend(address user) view returns (uint256)",
  "function authorizedExecutors(address user, address executor) view returns (bool)",
  "function getUserBasket(address user) view returns (tuple(address stockToken, uint256 weightBps)[])",
  "function setAllocationBasket(address[] tokens, uint256[] weightsBps)",
  "function authorizeExecutor(address executor, bool isAuthorized)",
  "function setMaxDailySpend(uint256 maxUSDG)",
  "function streamYield(address user, uint256 usdgAmount)",
  "event BasketUpdated(address indexed user, uint256 itemCount)",
  "event ExecutorAuthorized(address indexed user, address indexed executor, bool authorized)",
  "event YieldStreamed(address indexed user, address indexed stockToken, uint256 usdgSpent, uint256 stockAmountPurchased)"
];

export const STOCK_ADAPTER_ABI = [
  "function getLatestPrice(address stockToken) view returns (uint256)",
  "function calculateStockAmount(address stockToken, uint256 usdgAmount) view returns (uint256)",
  "function calculateUSDGAmount(address stockToken, uint256 stockAmount) view returns (uint256)"
];
