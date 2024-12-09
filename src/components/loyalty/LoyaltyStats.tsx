import React from 'react';
import { Award, TrendingUp, History } from 'lucide-react';

interface LoyaltyStatsProps {
  points: number;
  pointsValue: number;
  transactionCount: number;
}

export function LoyaltyStats({ points, pointsValue, transactionCount }: LoyaltyStatsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <Award className="h-6 w-6 text-indigo-600 mr-2" />
        Loyalty Program
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-indigo-600" />
              <span className="ml-2 text-sm text-gray-600">Points Balance</span>
            </div>
            <span className="text-lg font-semibold">{points}</span>
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="ml-2 text-sm text-gray-600">Points Value</span>
            </div>
            <span className="text-lg font-semibold">{pointsValue} SC</span>
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <History className="h-5 w-5 text-blue-600" />
              <span className="ml-2 text-sm text-gray-600">Transactions</span>
            </div>
            <span className="text-lg font-semibold">{transactionCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}