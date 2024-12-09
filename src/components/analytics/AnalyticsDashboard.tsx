import React, { useState } from 'react';
import { BarChart, LineChart, Activity, Users, DollarSign, History } from 'lucide-react';

interface AnalyticsData {
  transactionVolume: number[];
  userGrowth: number[];
  revenueData: number[];
  shopkeeperDistribution: { type: string; count: number }[];
  networkHealth: number;
  activeUsers: number;
}

export function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '1y'>('7d');
  
  // Mock data - replace with real blockchain data
  const analyticsData: AnalyticsData = {
    transactionVolume: [100, 150, 120, 200, 180, 220, 190],
    userGrowth: [500, 520, 550, 580, 600, 650, 700],
    revenueData: [1000, 1500, 1200, 2000, 1800, 2200, 1900],
    shopkeeperDistribution: [
      { type: 'Retail', count: 45 },
      { type: 'Restaurant', count: 30 },
      { type: 'Service', count: 25 }
    ],
    networkHealth: 98,
    activeUsers: 1234
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Network Analytics</h2>
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '1y'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period as '24h' | '7d' | '30d' | '1y')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeframe === period
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Network Health"
          value={`${analyticsData.networkHealth}%`}
          icon={<Activity className="h-6 w-6 text-green-500" />}
          trend="+2.5%"
          trendDirection="up"
        />
        <MetricCard
          title="Active Users"
          value={analyticsData.activeUsers.toLocaleString()}
          icon={<Users className="h-6 w-6 text-blue-500" />}
          trend="+12.3%"
          trendDirection="up"
        />
        <MetricCard
          title="Transaction Volume"
          value={`${analyticsData.transactionVolume[6]} SC`}
          icon={<History className="h-6 w-6 text-purple-500" />}
          trend="-3.2%"
          trendDirection="down"
        />
        <MetricCard
          title="Total Revenue"
          value={`${analyticsData.revenueData[6]} SC`}
          icon={<DollarSign className="h-6 w-6 text-orange-500" />}
          trend="+8.1%"
          trendDirection="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Transaction Volume</h3>
          <div className="h-64 flex items-center justify-center">
            <BarChart className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-gray-500">Chart placeholder</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center">
            <LineChart className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-gray-500">Chart placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendDirection: 'up' | 'down';
}

function MetricCard({ title, value, icon, trend, trendDirection }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-2 text-sm font-medium text-gray-500">{title}</h3>
        </div>
        <span className={`text-sm ${
          trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
} 