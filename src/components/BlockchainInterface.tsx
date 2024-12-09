import React, { useState, useCallback } from 'react';
import { Wallet, CircleDollarSign, Store, History } from 'lucide-react';
import { Blockchain } from '../lib/blockchain/Blockchain';
import { ShopkeeperRegistry } from '../lib/blockchain/ShopkeeperRegistry';
import { BlockchainState } from '../lib/blockchain/types';

const blockchain = new Blockchain();
const registry = new ShopkeeperRegistry(blockchain);

export function BlockchainInterface() {
  const [state, setState] = useState<BlockchainState>({
    balance: 0,
    isProcessing: false,
    error: null
  });

  const [formData, setFormData] = useState({
    address: '',
    name: '',
    businessType: '',
    amount: 0
  });

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      registry.registerShopkeeper(
        formData.address,
        formData.name,
        formData.businessType
      );
      
      setState(prev => ({
        ...prev,
        balance: blockchain.getBalance(formData.address),
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isProcessing: false
      }));
    }
  }, [formData]);

  const simulateTransaction = useCallback(async () => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      blockchain.addTransaction({
        from: 'customer',
        to: formData.address,
        amount: formData.amount,
        timestamp: Date.now()
      });
      
      registry.processTransaction(formData.address);
      blockchain.minePendingTransactions('miner');
      
      setState(prev => ({
        ...prev,
        balance: blockchain.getBalance(formData.address),
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isProcessing: false
      }));
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-center mb-8">
              <CircleDollarSign className="h-12 w-12 text-indigo-600" />
              <h1 className="ml-3 text-3xl font-bold text-gray-900">ShopCoin Dashboard</h1>
            </div>

            <div className="mb-8 p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="h-6 w-6 text-indigo-600" />
                  <span className="ml-2 text-lg font-medium">Balance:</span>
                </div>
                <span className="text-2xl font-bold">{state.balance} SC</span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Type
                </label>
                <input
                  type="text"
                  value={formData.businessType}
                  onChange={e => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={state.isProcessing}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Store className="h-5 w-5 mr-2" />
                Register Shopkeeper
              </button>
            </form>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Transaction Amount
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={simulateTransaction}
                disabled={state.isProcessing}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                <History className="h-5 w-5 mr-2" />
                Simulate Transaction
              </button>
            </div>

            {state.error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-700">
                {state.error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}