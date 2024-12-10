import { Blockchain } from './Blockchain';
import { Transaction } from './interfaces/IShopCoinEnhanced';
import { P2PNetwork } from './network/P2PNetwork';

const blockchain = new Blockchain();
const mempool = new Set<Transaction>();
const p2pNetwork = new P2PNetwork(6001, blockchain, mempool);

// Connect to known peers
p2pNetwork.connectToPeer('ws://peer1.example.com:6001');
p2pNetwork.connectToPeer('ws://peer2.example.com:6001'); 