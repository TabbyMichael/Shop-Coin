import WebSocket from 'ws';
import { Transaction } from '../interfaces/IShopCoinEnhanced';
import { NetworkProtocol } from '../interfaces/NetworkProtocol';
import { Block } from '../Block';
import { Blockchain } from '../Blockchain';

interface NetworkMessage {
  type: 'TRANSACTION' | 'BLOCK' | 'PEER_DISCOVERY' | 'SYNC_REQUEST' | 'SYNC_RESPONSE';
  data: Transaction | Block | { nodeId: string } | null;
  timestamp: number;
  sender: string;
}

export class P2PNetwork implements NetworkProtocol {
  private peers: Map<string, WebSocket> = new Map();
  private server: WebSocket.Server | undefined;
  private nodeId: string;
  private readonly SYNC_INTERVAL = 30000; // 30 seconds
  
  constructor(
    private port: number,
    private blockchain: Blockchain,
    private mempool: Set<Transaction>
  ) {
    this.nodeId = Math.random().toString(36).substring(7);
    this.initializeServer();
    this.startSyncInterval();
  }

  private initializeServer(): void {
    this.server = new WebSocket.Server({ port: this.port });
    
    this.server.on('connection', (socket: WebSocket) => {
      this.handleConnection(socket);
    });

    console.log(`P2P Server running on port ${this.port}`);
  }

  private handleConnection(socket: WebSocket): void {
    socket.on('message', (data: string) => {
      const message: NetworkMessage = JSON.parse(data);
      this.handleMessage(message, socket);
    });

    // Send peer discovery message
    this.broadcast({
      type: 'PEER_DISCOVERY',
      data: { nodeId: this.nodeId },
      timestamp: Date.now(),
      sender: this.nodeId
    });
  }

  private handleMessage(message: NetworkMessage, socket: WebSocket): void {
    switch (message.type) {
      case 'TRANSACTION':
        if (message.data) this.handleTransaction(message.data as Transaction);
        break;
      case 'BLOCK':
        if (message.data) this.handleBlock(message.data as Block);
        break;
      case 'PEER_DISCOVERY':
        if (message.data) this.handlePeerDiscovery(message.data as { nodeId: string }, socket);
        break;
      case 'SYNC_REQUEST':
        this.handleSyncRequest(socket);
        break;
      case 'SYNC_RESPONSE':
        if (message.data && 'chain' in message.data && 'mempool' in message.data) {
          this.handleSyncResponse(message.data as { chain: Block[]; mempool: Transaction[] });
        }
        break;
    }
  }

  private handleTransaction(transaction: Transaction): void {
    if (!this.mempool.has(transaction)) {
      this.mempool.add(transaction);
      this.broadcast({
        type: 'TRANSACTION',
        data: transaction,
        timestamp: Date.now(),
        sender: this.nodeId
      });
    }
  }

  private handleBlock(block: Block): void {
    // Validate and add block to chain
    if (this.blockchain.isValidBlock(block)) {
      this.blockchain.addBlock(block);
      // Clean mempool of included transactions
      this.cleanMempool(block.transactions);
      this.broadcast({
        type: 'BLOCK',
        data: block,
        timestamp: Date.now(),
        sender: this.nodeId
      });
    }
  }

  private handlePeerDiscovery(data: { nodeId: string }, socket: WebSocket): void {
    if (data.nodeId !== this.nodeId && !this.peers.has(data.nodeId)) {
      this.peers.set(data.nodeId, socket);
      console.log(`New peer connected: ${data.nodeId}`);
    }
  }

  private handleSyncRequest(socket: WebSocket): void {
    const syncData = {
      chain: this.blockchain.chain,
      mempool: Array.from(this.mempool)
    };
    
    socket.send(JSON.stringify({
      type: 'SYNC_RESPONSE',
      data: syncData,
      timestamp: Date.now(),
      sender: this.nodeId
    }));
  }

  private handleSyncResponse(data: { chain: Block[], mempool: Transaction[] }): void {
    // Validate and update chain if necessary
    if (data.chain.length > this.blockchain.chain.length) {
      if (this.blockchain.isValidChain(data.chain)) {
        this.blockchain.chain = data.chain;
      }
    }
    
    // Update mempool with new transactions
    data.mempool.forEach(tx => {
      if (!this.mempool.has(tx)) {
        this.mempool.add(tx);
      }
    });
  }

  private broadcast(message: NetworkMessage): void {
    this.peers.forEach(socket => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    });
  }

  private startSyncInterval(): void {
    setInterval(() => {
      this.syncWithPeers();
    }, this.SYNC_INTERVAL);
  }

  private syncWithPeers(): void {
    this.broadcast({
      type: 'SYNC_REQUEST',
      data: null,
      timestamp: Date.now(),
      sender: this.nodeId
    });
  }

  // NetworkProtocol implementation
  async broadcastTransaction(transaction: Transaction): Promise<void> {
    this.handleTransaction(transaction);
  }

  async syncTransactions(): Promise<void> {
    this.syncWithPeers();
  }

  validateNetworkState(): boolean {
    return this.blockchain.isChainValid();
  }

  // Public methods for connecting to peers
  connectToPeer(peerAddress: string): void {
    const socket = new WebSocket(peerAddress);
    
    socket.on('open', () => {
      socket.send(JSON.stringify({
        type: 'PEER_DISCOVERY',
        data: { nodeId: this.nodeId },
        timestamp: Date.now(),
        sender: this.nodeId
      }));
    });

    socket.on('message', (data: string) => {
      const message: NetworkMessage = JSON.parse(data);
      this.handleMessage(message, socket);
    });
  }

  private cleanMempool(transactions: Transaction[]): void {
    transactions.forEach(tx => {
      this.mempool.delete(tx);
    });
  }
} 