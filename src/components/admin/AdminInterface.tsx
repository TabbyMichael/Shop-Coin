import { useState } from 'react';
import { 
  CreditCard, ArrowUpRight, ArrowDownRight, Wallet
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ShopCoinToken } from '../../lib/blockchain/contracts/ShopCoinToken';

// Add spending data interface
interface SpendingData {
  name: string;
  value: number;
  color: string;
}

export function AdminInterface() {
  const [wallets] = useState([
    {
      name: 'Main Wallet',
      balance: '45,500.12',
      address: '444 221 224 ***',
      color: 'bg-purple-500',
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      name: 'XYZ Wallet',
      balance: '250.5',
      address: '444 221 224 ***',
      color: 'bg-green-500',
      icon: <Wallet className="h-6 w-6" />
    }
  ]);

  const [transactions] = useState([
    {
      type: 'withdraw',
      amount: -542,
      timestamp: '05:24:45 AM',
      status: 'pending'
    },
    {
      type: 'topup',
      amount: 5553,
      timestamp: '05:24:45 AM',
      status: 'completed'
    }
  ]);

  // Add spending data state
  const [spendingData] = useState<SpendingData[]>([
    { name: 'Investment', value: 24, color: '#4ade80' },  // green-400
    { name: 'Food', value: 18, color: '#f87171' },        // red-400
    { name: 'Restaurant', value: 21, color: '#fbbf24' },  // amber-400
    { name: 'Rent', value: 28, color: '#60a5fa' },        // blue-400
    { name: 'Investment', value: 9, color: '#c084fc' }    // purple-400
  ]);

  // Initialize token
  const [token] = useState(() => new ShopCoinToken());
  
  // Add merchant management state
  const [merchantData, setMerchantData] = useState<{
    address: string;
    stakedAmount: number;
    feeRate: number;
    pointBalance: number;
  }>({
    address: '',
    stakedAmount: 0,
    feeRate: 0,
    pointBalance: 0
  });

  // Add handlers for new features
  const handlePointConversion = async (points: number) => {
    try {
      await token.convertPointsToTokens(points);
      // Update UI
    } catch (error) {
      console.error('Error converting points to tokens:', error);
      // Handle error
    }
  };

  const handleStake = async (amount: number) => {
    try {
      await token.stake(amount);
      setMerchantData(prev => ({
        ...prev,
        stakedAmount: prev.stakedAmount + amount
      }));
    } catch (error) {
      console.error('Error staking:', error);
    }
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wallets</h1>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Add Wallet
          </button>
        </div>

        {/* Wallet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {wallets.map((wallet, index) => (
            <div
              key={index}
              className={`${wallet.color} p-6 rounded-xl text-white cursor-pointer transform transition hover:scale-105`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm opacity-80">{wallet.name}</span>
                {wallet.icon}
              </div>
              <div className="text-2xl font-bold mb-4">${wallet.balance}</div>
              <div className="flex items-center text-sm opacity-80">
                <span>{wallet.address}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Card Details & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Card Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Card Details</h2>
              <div className="flex space-x-2">
                <button className="text-blue-600">Generate Number</button>
                <button className="text-blue-600">Edit</button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Card Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Card Name</label>
                  <div className="font-semibold">Main Balance</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Valid Date</label>
                  <div className="font-semibold">06/21</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Staked Amount</label>
                  <div className="font-semibold">{merchantData.stakedAmount} SC</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Fee Rate</label>
                  <div className="font-semibold">{(merchantData.feeRate * 100).toFixed(2)}%</div>
                </div>
                {/* ... more card details ... */}
              </div>

              {/* Usage Limits */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Main Limits</span>
                  <span className="font-semibold">$10,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Convert Points</span>
                  <button 
                    onClick={() => handlePointConversion(100)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Convert 100 Points
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Stake Tokens</span>
                  <button 
                    onClick={() => handleStake(1000)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Stake 1000 SC
                  </button>
                </div>
                {/* ... more limits ... */}
              </div>
            </div>
          </div>

          {/* Spending Analytics */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Spending Analytics</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={spendingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={108}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop: '2rem'
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Wallet Activity</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded-full bg-gray-100">Monthly</button>
              <button className="px-3 py-1 rounded-full bg-gray-100">Weekly</button>
              <button className="px-3 py-1 rounded-full bg-indigo-600 text-white">Today</button>
            </div>
          </div>

          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center">
                  {tx.type === 'withdraw' ? (
                    <ArrowDownRight className="h-5 w-5 text-red-500 mr-3" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-green-500 mr-3" />
                  )}
                  <div>
                    <div className="font-medium">{tx.type === 'withdraw' ? 'Withdraw' : 'Top-up'}</div>
                    <div className="text-sm text-gray-500">{tx.timestamp}</div>
                  </div>
                </div>
                <div className={`font-medium ${
                  tx.type === 'withdraw' ? 'text-red-500' : 'text-green-500'
                }`}>
                  {tx.type === 'withdraw' ? '-' : '+'}${Math.abs(tx.amount)}
                </div>
                <div className={`text-sm ${
                  tx.status === 'completed' ? 'text-green-500' : 
                  tx.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {tx.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 