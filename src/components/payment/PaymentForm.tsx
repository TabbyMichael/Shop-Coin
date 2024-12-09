import React, { useState } from 'react';
import { CreditCard, Coins } from 'lucide-react';
import { PaymentFormData } from '../../lib/blockchain/types';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  isProcessing: boolean;
}

export function PaymentForm({ onSubmit, isProcessing }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    from: '',
    to: '',
    amount: 0,
    type: 'payment'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <CreditCard className="h-6 w-6 text-indigo-600" />
        <h2 className="ml-2 text-xl font-semibold">Make Payment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Wallet Address</label>
          <input
            type="text"
            value={formData.from}
            onChange={e => setFormData(prev => ({ ...prev, from: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Shopkeeper's Address</label>
          <input
            type="text"
            value={formData.to}
            onChange={e => setFormData(prev => ({ ...prev, to: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (SC)</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={e => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
              className="block w-full rounded-md border-gray-300 pl-7 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Coins className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Type</label>
          <select
            value={formData.type}
            onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as 'payment' | 'loyalty' }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="payment">Regular Payment</option>
            <option value="loyalty">Use Loyalty Points</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Make Payment'}
        </button>
      </form>
    </div>
  );
}