import { Block } from './Block';
import { Transaction } from './types';

export class Blockchain {
  public chain: Block[] = [];
  private difficulty = 2;
  private pendingTransactions: Transaction[] = [];
  private miningReward = 100;
  private totalSupply = 0;
  private minimumCirculation = 1000000; // 1 million coins minimum circulation

  constructor() {
    // Genesis block
    this.chain.push(
      new Block(Date.now(), [], '0')
    );
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress: string) {
    // Adjust mining reward based on circulation
    if (this.totalSupply < this.minimumCirculation) {
      this.miningReward = 200; // Double rewards when below minimum
    } else {
      this.miningReward = 100;
    }

    const rewardTx: Transaction = {
      from: 'network',
      to: miningRewardAddress,
      amount: this.miningReward,
      timestamp: Date.now(),
      type: 'reward'
    };

    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.totalSupply += this.miningReward;
    this.pendingTransactions = [];
  }

  addTransaction(transaction: Transaction) {
    if (transaction.from !== 'network') {
      const senderBalance = this.getBalance(transaction.from);
      if (senderBalance < transaction.amount) {
        throw new Error('Insufficient balance');
      }
    }
    this.pendingTransactions.push(transaction);
  }

  getBalance(address: string): number {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.from === address) {
          balance -= trans.amount;
        }
        if (trans.to === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  getTotalSupply(): number {
    return this.totalSupply;
  }

  getTransactionCount(address: string): number {
    let count = 0;
    for (const block of this.chain) {
      count += block.transactions.filter(
        tx => tx.from === address || tx.to === address
      ).length;
    }
    return count;
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}