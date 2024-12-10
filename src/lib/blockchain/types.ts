export interface Transaction {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  type: 'purchase' | 'transfer' | 'reward' | 'stake' | 'unstake';
}

export interface ShopkeeperData {
  name: string;
  businessType: string;
  registrationDate: number;
  lastReward: number;
  transactionCount: number;
  loyaltyPoints: number;
}

export interface BlockchainState {
  balance: number;
  loyaltyPoints: number;
  isProcessing: boolean;
  error: string | null;
}

export interface PaymentFormData {
  from: string;
  to: string;
  amount: number;
  type: 'payment' | 'loyalty';
}