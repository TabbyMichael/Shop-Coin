import { Transaction } from './IShopCoinEnhanced';

export interface NetworkProtocol {
  broadcastTransaction(transaction: Transaction): Promise<void>;
  syncTransactions(): Promise<void>;
  validateNetworkState(): boolean;
} 