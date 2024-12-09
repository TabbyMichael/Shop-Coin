import React from 'react';
import { Activity, Users, Coins, Clock } from 'lucide-react';

interface NetworkStatsProps {
  difficulty: number;
  totalSupply: number;
  shopkeepersCount: number;
  lastBlockTime: number;
}

export function NetworkStats({ difficulty, totalSupply, shopkeepersCount, lastBlockTime }: NetworkStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-blue-500" />
            <span className="ml-2 text-sm text-gray-500">Difficulty</span>
          </div>
          <span className="text-lg font-semibold">{difficulty}</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Coins className="h-5 w-5 text-orange-500" />
            <span className="ml-2 text-sm text-gray-500">Total Supply</span>
          </div>
          <span className="text-lg font-semibold">{totalSupply} SC</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-green-500" />
            <span className="ml-2 text-sm text-gray-500">Shopkeepers</span>
          </div>
          <span className="text-lg font-semibold">{shopkeepersCount}</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-purple-500" />
            <span className="ml-2 text-sm text-gray-500">Last Block</span>
          </div>
          <span className="text-lg font-semibold">
            {Math.floor((Date.now() - lastBlockTime) / 1000)}s ago
          </span>
        </div>
      </div>
    </div>
  );
}