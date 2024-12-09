import React, { useState, useEffect } from 'react';
import { Activity, Users, Coins, Clock } from 'lucide-react';

interface NetworkStatsProps {
  difficulty: number;
  totalSupply: number;
  shopkeepersCount: number;
  lastBlockTime: number;
}

export function NetworkStats({ difficulty, totalSupply, shopkeepersCount, lastBlockTime }: NetworkStatsProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      {[
        {
          icon: <Activity className="h-5 w-5 text-blue-500" />,
          label: "Difficulty",
          value: difficulty,
          loading: isLoading
        },
        {
          icon: <Coins className="h-5 w-5 text-orange-500" />,
          label: "Total Supply",
          value: `${totalSupply} SC`,
          loading: isLoading
        },
        {
          icon: <Users className="h-5 w-5 text-green-500" />,
          label: "Shopkeepers",
          value: shopkeepersCount,
          loading: isLoading
        },
        {
          icon: <Clock className="h-5 w-5 text-purple-500" />,
          label: "Last Block",
          value: new Date(lastBlockTime).toLocaleTimeString(),
          loading: isLoading
        }
      ].map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {stat.icon}
              <span className="ml-2 text-sm text-gray-500">{stat.label}</span>
            </div>
            {stat.loading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <span className="text-lg font-semibold">{stat.value}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}