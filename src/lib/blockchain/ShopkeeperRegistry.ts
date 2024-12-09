import { Transaction, ShopkeeperData } from './types';
import { Blockchain } from './Blockchain';

export class ShopkeeperRegistry {
  private shopkeepers: Map<string, ShopkeeperData> = new Map();
  private readonly MINIMUM_TRANSACTIONS = 10;
  private readonly REWARD_COOLDOWN = 86400000; // 24 hours in milliseconds

  constructor(private blockchain: Blockchain) {}

  registerShopkeeper(address: string, name: string, businessType: string): void {
    this.shopkeepers.set(address, {
      name,
      businessType,
      registrationDate: Date.now(),
      lastReward: 0,
      transactionCount: 0,
      loyaltyPoints: 0
    });
  }

  processTransaction(address: string): void {
    const shopkeeper = this.shopkeepers.get(address);
    if (shopkeeper) {
      shopkeeper.transactionCount++;
      this.checkAndReward(address);
    }
  }

  private checkAndReward(address: string): void {
    const shopkeeper = this.shopkeepers.get(address);
    if (!shopkeeper) return;

    const currentTime = Date.now();
    
    if (shopkeeper.transactionCount >= this.MINIMUM_TRANSACTIONS &&
        currentTime - shopkeeper.lastReward >= this.REWARD_COOLDOWN) {
      
      const baseReward = 50;
      const longevityBonus = Math.min(
        (currentTime - shopkeeper.registrationDate) / (this.REWARD_COOLDOWN * 30),
        2
      );
      const volumeBonus = Math.min(shopkeeper.transactionCount / 100, 1.5);
      
      const totalReward = baseReward * (1 + longevityBonus + volumeBonus);
      
      const rewardTransaction: Transaction = {
        from: 'network',
        to: address,
        amount: totalReward,
        timestamp: currentTime,
        type: 'reward'
      };
      
      this.blockchain.addTransaction(rewardTransaction);
      
      shopkeeper.lastReward = currentTime;
      shopkeeper.transactionCount = 0;
    }
  }

  getShopkeeperData(address: string): ShopkeeperData | undefined {
    return this.shopkeepers.get(address);
  }

  getShopkeepersCount(): number {
    return this.shopkeepers.size;
  }
}