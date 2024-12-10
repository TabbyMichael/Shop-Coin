import { IERC20 } from '../contracts/IERC20';

export interface IShopCoinEnhanced extends IERC20 {
  accumulatePoints(purchaseAmount: number): number;
  convertPointsToTokens(points: number): number;
  getPurchaseHistory(address: string): Transaction[];
  getPointBalance(address: string): number;
}

export interface IMerchantFeatures {
  registerMerchant(address: string, metadata: MerchantData): boolean;
  batchTransfer(recipients: string[], amounts: number[]): boolean;
  stake(amount: number): boolean;
  unstake(): boolean;
  getStakedAmount(address: string): number;
  calculateTransactionFee(amount: number, address: string): number;
}

export interface IPlatformControls {
  setFeeRate(rate: number): void;
  pauseTransactions(): void;
  resumeTransactions(): void;
  verifyMerchant(address: string): boolean;
  adjustSupply(amount: number): void;
}

export interface MerchantData {
  name: string;
  businessType: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  stakedAmount: number;
  feeRate: number;
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  type: 'purchase' | 'transfer' | 'reward' | 'stake' | 'unstake';
  points?: number;
} 