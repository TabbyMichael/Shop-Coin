import React from 'react';
import { Store } from 'lucide-react';

interface ShopkeeperFormProps {
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    address: string;
    name: string;
    businessType: string;
  };
  onChange: (field: string, value: string) => void;
  isProcessing: boolean;
}

export function ShopkeeperForm({ onSubmit, formData, onChange, isProcessing }: ShopkeeperFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 font-mono">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Store className="h-5 w-5 text-orange-500 mr-2" />
          Blockchain Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Network Participation Level
            </label>
            <select
              value={formData.businessType}
              onChange={e => onChange('businessType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select level</option>
              <option value="validator">Validator Node</option>
              <option value="merchant">Merchant Node</option>
              <option value="light">Light Node</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Transaction Processing Speed
            </label>
            <select
              value={formData.name}
              onChange={e => onChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select speed</option>
              <option value="instant">Instant (Higher fees)</option>
              <option value="standard">Standard (Medium fees)</option>
              <option value="batch">Batch (Lower fees)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Smart Contract Template
            </label>
            <select
              value={formData.address}
              onChange={e => onChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select template</option>
              <option value="standard">Standard Payment</option>
              <option value="escrow">Escrow Service</option>
              <option value="recurring">Recurring Payment</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Apply Settings'}
        </button>
      </div>
    </form>
  );
}