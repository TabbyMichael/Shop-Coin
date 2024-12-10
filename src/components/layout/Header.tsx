import React from 'react';
import { Bitcoin } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Bitcoin className="h-8 w-8 text-orange-500" />
            <h1 className="ml-2 text-2xl font-mono dark:text-white">ShopCoin</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-mono text-sm text-gray-500 dark:text-gray-400">
              Version 1.0.0
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}