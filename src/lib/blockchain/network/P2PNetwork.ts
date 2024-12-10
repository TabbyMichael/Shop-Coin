import WebSocket from 'ws';
import { Transaction } from '../interfaces/IShopCoinEnhanced';
import { NetworkProtocol } from '../interfaces/NetworkProtocol';
import { Block } from '../Block';
import { Blockchain } from '../Blockchain';

interface NetworkMessage {
  type: 'TRANSACTION' | 'BLOCK' | 'PEER_DISCOVERY' | 'SYNC_REQUEST' | 'SYNC_RESPONSE';
  data: Transaction | Block | { nodeId: string } | null;
  timestamp: number;
}

export class P2PNetwork implements NetworkProtocol {
  private wss: WebSocket.Server;
  private peers: Set<WebSocket> = new Set();

  constructor(port: number, private blockchain: Blockchain, private mempool: Set<Transaction>) {
    this.wss = new WebSocket.Server({ port });
    this.wss.on('connection', (ws) => this.onConnection(ws));
    console.log(`P2P network started on port ${port}`);
  }

  private onConnection(ws: WebSocket) {
    this.peers.add(ws);
    this.broadcastPeerDiscovery();
    ws.on('message', (message: string) => this.onMessage(ws, message));
    ws.on('close', () => this.peers.delete(ws));
  }

  private broadcastPeerDiscovery() {
    const peerDiscoveryMessage: NetworkMessage = {
      type: 'PEER_DISCOVERY',
      data: { nodeId: this.getNodeId() }, // Assuming a method to get the node ID
      timestamp: Date.now(),
    };
    this.broadcast(peerDiscoveryMessage);
  }

  private onMessage(ws: WebSocket, message: string) {
    const networkMessage: NetworkMessage = JSON.parse(message);
    switch (networkMessage.type) {
      case 'TRANSACTION':
        this.handleTransaction(networkMessage.data as Transaction);
        break;
      case 'BLOCK':
        this.handleBlock(networkMessage.data as Block);
        break;
      case 'PEER_DISCOVERY':
        if (networkMessage.data) {
          this.handlePeerDiscovery(networkMessage.data as { nodeId: string });
        }
        break;
      case 'SYNC_REQUEST':
        this.handleSyncRequest(ws);
        break;
      case 'SYNC_RESPONSE':
        if (Array.isArray(networkMessage.data)) {
          this.handleSyncResponse(networkMessage.data as Block[]);
        }
        break;
    }
  }

  private handleTransaction(transaction: Transaction) {
    this.mempool.add(transaction);
    this.broadcast({
      type: 'TRANSACTION',
      data: transaction,
      timestamp: Date.now(),
    });
  }

  private handleBlock(block: Block) {
    this.blockchain.addBlock(block);
    this.broadcast({
      type: 'BLOCK',
      data: block,
      timestamp: Date.now(),
    });
  }

  private handlePeerDiscovery(data: { nodeId: string }) {
    console.log(`Discovered peer: ${data.nodeId}`);
    // Additional logic for handling peer discovery can be added here
  }

  private handleSyncRequest(ws: WebSocket) {
    const blocks = this.blockchain.chain;
    ws.send(JSON.stringify({
      type: 'SYNC_RESPONSE',
      data: blocks,
      timestamp: Date.now(),
    }));
  }

  private handleSyncResponse(blocks: Block[]) {
    blocks.forEach(block => {
      this.blockchain.addBlock(block);
    });
  }

  private broadcast(message: NetworkMessage) {
    this.peers.forEach(peer => {
      peer.send(JSON.stringify(message));
    });
  }

  public async broadcastTransaction(transaction: Transaction): Promise<void> {
    this.broadcast({
      type: 'TRANSACTION',
      data: transaction,
      timestamp: Date.now(),
    });
  }

  public async syncTransactions(): Promise<void> {
    // Logic to sync transactions with peers
  }

  public validateNetworkState(): boolean {
    return true; // Placeholder
  }

  private getNodeId(): string {
    // Implement logic to generate or retrieve a unique node ID
    return 'node-id'; // Placeholder
  }

  public connectToPeer(peerUrl: string) {
    const ws = new WebSocket(peerUrl);
    ws.on('open', () => {
      console.log(`Connected to peer: ${peerUrl}`);
      this.peers.add(ws);
    });

    ws.on('message', (message: string) => {
      this.onMessage(ws, message);
    });

    ws.on('close', () => {
      this.peers.delete(ws);
      console.log(`Disconnected from peer: ${peerUrl}`);
    });

    ws.on('error', (error) => {
      console.error(`Connection error: ${error}`);
    });
  }
} 