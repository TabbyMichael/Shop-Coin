import SHA256 from 'crypto-js/sha256';
import { Transaction } from './types';

export class Block {
  public nonce = 0;
  public hash: string;

  constructor(
    public timestamp: number,
    public transactions: Transaction[],
    public previousHash: string = ''
  ) {
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return SHA256(
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.nonce
    ).toString();
  }

  mineBlock(difficulty: number) {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}