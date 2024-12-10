import { IERC20 } from './IERC20';
import { IShopCoinEnhanced, MerchantData, Transaction } from '../interfaces/IShopCoinEnhanced';

export class ShopCoinToken implements IERC20, IShopCoinEnhanced {
  public readonly name = 'ShopCoin';
  public readonly symbol = 'SC';
  public readonly decimals = 18;

  private _totalSupply: number = 0;
  private _balances: Map<string, number> = new Map();
  private _allowances: Map<string, Map<string, number>> = new Map();
  
  private _pointBalances: Map<string, number> = new Map();
  private _merchants: Map<string, MerchantData> = new Map();
  private _transactions: Transaction[] = [];
  private _paused: boolean = false;
  private _defaultFeeRate: number = 0.01;
  private _pointToTokenRate: number = 100;
  private _reentrancyLock: boolean = false;
  private _blacklistedAddresses: Set<string> = new Set();
  private _pointsExpiration: Map<string, Array<{points: number, expiry: number}>> = new Map();
  private _userTiers: Map<string, string> = new Map();

  constructor(initialSupply: number = 1000000) {
    this._mint('0x1', initialSupply);
  }

  totalSupply(): number {
    return this._totalSupply;
  }

  balanceOf(account: string): number {
    return this._balances.get(account) || 0;
  }

  transfer(recipient: string, amount: number): boolean {
    require(!this._paused, "Transactions are paused");
    
    const sender = msg.sender;
    const fee = this.calculateTransactionFee(amount, sender);
    const netAmount = amount - fee;
    
    this._transfer(sender, recipient, netAmount);
    if (fee > 0) {
      this._transfer(sender, '0x1', fee);
    }
    this._transactions.push({
      from: sender,
      to: recipient,
      amount: netAmount,
      timestamp: Date.now(),
      type: 'transfer'
    });
    
    return true;
  }

  allowance(owner: string, spender: string): number {
    return this._allowances.get(owner)?.get(spender) || 0;
  }

  approve(spender: string, amount: number): boolean {
    this._approve(msg.sender, spender, amount);
    return true;
  }

  transferFrom(sender: string, recipient: string, amount: number): boolean {
    this._transfer(sender, recipient, amount);
    
    const currentAllowance = this.allowance(sender, msg.sender);
    require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
    
    this._approve(sender, msg.sender, currentAllowance - amount);
    return true;
  }

  private _transfer(sender: string, recipient: string, amount: number): void {
    require(sender !== '0x0', "ERC20: transfer from zero address");
    require(recipient !== '0x0', "ERC20: transfer to zero address");
    require(this.balanceOf(sender) >= amount, "ERC20: transfer amount exceeds balance");

    this._balances.set(sender, this.balanceOf(sender) - amount);
    this._balances.set(recipient, this.balanceOf(recipient) + amount);

    this.emit('Transfer', sender, recipient, amount);
  }

  private _mint(account: string, amount: number): void {
    require(account !== '0x0', "ERC20: mint to zero address");

    this._totalSupply += amount;
    this._balances.set(account, this.balanceOf(account) + amount);

    this.emit('Transfer', '0x0', account, amount);
  }

  private _approve(owner: string, spender: string, amount: number): void {
    require(owner !== '0x0', "ERC20: approve from zero address");
    require(spender !== '0x0', "ERC20: approve to zero address");

    if (!this._allowances.has(owner)) {
      this._allowances.set(owner, new Map());
    }
    this._allowances.get(owner)!.set(spender, amount);

    this.emit('Approval', owner, spender, amount);
  }

  private emit(event: string, ...args: (string | number | boolean)[]) {
    console.log(`Event: ${event}`, ...args);
  }

  accumulatePoints(purchaseAmount: number): number {
    const points = Math.floor(purchaseAmount * 10);
    const customer = msg.sender;
    this._pointBalances.set(
      customer,
      (this._pointBalances.get(customer) || 0) + points
    );
    return points;
  }

  convertPointsToTokens(points: number): number {
    const customer = msg.sender;
    const currentPoints = this._pointBalances.get(customer) || 0;
    require(currentPoints >= points, "Insufficient points");
    
    const tokens = points / this._pointToTokenRate;
    this._pointBalances.set(customer, currentPoints - points);
    this._mint(customer, tokens);
    
    return tokens;
  }

  getPurchaseHistory(address: string): Transaction[] {
    return this._transactions.filter(tx => 
      tx.from === address || tx.to === address
    );
  }

  getPointBalance(address: string): number {
    return this._pointBalances.get(address) || 0;
  }

  registerMerchant(address: string, metadata: Omit<MerchantData, 'verificationStatus' | 'stakedAmount' | 'feeRate'>): boolean {
    require(!this._merchants.has(address), "Merchant already registered");
    
    this._merchants.set(address, {
      ...metadata,
      verificationStatus: 'pending',
      stakedAmount: 0,
      feeRate: this._defaultFeeRate
    });
    
    return true;
  }

  batchTransfer(recipients: string[], amounts: number[]): boolean {
    require(recipients.length === amounts.length, "Arrays length mismatch");
    const merchant = msg.sender;
    require(this._merchants.has(merchant), "Not a registered merchant");
    
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
    require(this.balanceOf(merchant) >= totalAmount, "Insufficient balance");
    
    recipients.forEach((recipient, index) => {
      this._transfer(merchant, recipient, amounts[index]);
    });
    
    return true;
  }

  stake(amount: number): boolean {
    const merchant = msg.sender;
    require(this._merchants.has(merchant), "Not a registered merchant");
    require(this.balanceOf(merchant) >= amount, "Insufficient balance");
    
    const merchantData = this._merchants.get(merchant)!;
    this._transfer(merchant, '0x0', amount);
    this._merchants.set(merchant, {
      ...merchantData,
      stakedAmount: merchantData.stakedAmount + amount,
      feeRate: Math.max(this._defaultFeeRate - (amount / 1000000) * 0.001, 0.001)
    });
    
    return true;
  }

  setFeeRate(rate: number): void {
    require(rate >= 0 && rate <= 0.1, "Invalid fee rate");
    this._defaultFeeRate = rate;
  }

  pauseTransactions(): void {
    this._paused = true;
  }

  resumeTransactions(): void {
    this._paused = false;
  }

  calculateTransactionFee(amount: number, address: string): number {
    const merchant = address;
    if (this._merchants.has(merchant)) {
      const merchantData = this._merchants.get(merchant)!;
      return amount * merchantData.feeRate;
    }
    return amount * this._defaultFeeRate;
  }

  private _checkReentrancy(): void {
    require(!this._reentrancyLock, "Reentrant call detected");
    this._reentrancyLock = true;
  }

  public blacklistAddress(address: string): void {
    // Admin only
    this._blacklistedAddresses.add(address);
  }

  public addPointsWithExpiry(address: string, points: number, expiryDays: number): void {
    const expiry = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);
    const userPoints = this._pointsExpiration.get(address) || [];
    userPoints.push({ points, expiry });
    this._pointsExpiration.set(address, userPoints);
  }
}

const msg = {
  sender: '0x0'
};

function require(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
} 