import React from 'react';
import { Bitcoin } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Bitcoin className="h-8 w-8 text-orange-500" />
            <h1 className="ml-2 text-2xl font-mono">ShopCoin</h1>
          </div>
          <div className="font-mono text-sm text-gray-500">
            Version 1.0.0
          </div>
        </div>
      </div>
    </header>
  );
}