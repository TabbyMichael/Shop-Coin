import React from 'react';
import { Hash, Clock, Database } from 'lucide-react';

interface Block {
  hash: string;
  previousHash: string;
  timestamp: number;
  transactions: Transaction[];
}

interface BlockViewerProps {
  blocks: Block[];
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}


export function BlockViewer({ blocks }: BlockViewerProps) {
  return (
    <div className="space-y-4 font-mono">
      {blocks.map((block, index) => (
        <div key={block.hash} className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Block {index + 1}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {new Date(block.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600 break-all">{block.hash}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600 break-all">{block.previousHash}</span>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Transactions</h4>
            <div className="space-y-2">
              {block.transactions.map((tx, i) => (
                <div key={i} className="text-xs bg-gray-50 p-2 rounded">
                  <div>From: {tx.from}</div>
                  <div>To: {tx.to}</div>
                  <div>Amount: {tx.amount} SC</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}