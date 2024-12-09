import { useState } from 'react';
import { Shield, Settings, AlertTriangle, Database, Server, Lock, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AdminSettings {
  networkDifficulty: number;
  minRewardThreshold: number;
  blockTime: number;
  maxBlockSize: number;
}

export function AdminInterface() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<AdminSettings>({
    networkDifficulty: 2,
    minRewardThreshold: 100,
    blockTime: 600, // 10 minutes in seconds
    maxBlockSize: 1, // MB
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'network'>('overview');

  const handleSettingChange = (setting: keyof AdminSettings, value: number) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button className="flex items-center px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-800">
              <Shield className="h-5 w-5 mr-2" />
              Emergency Stop
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            {[
              { id: 'overview', label: 'Overview', icon: Settings },
              { id: 'security', label: 'Security', icon: Lock },
              { id: 'network', label: 'Network', icon: Server }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'security' | 'network')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Network Settings */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
              <Settings className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Network Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Network Difficulty
                </label>
                <input
                  type="number"
                  value={settings.networkDifficulty}
                  onChange={(e) => handleSettingChange('networkDifficulty', +e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                           shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                           dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Block Time (seconds)
                </label>
                <input
                  type="number"
                  value={settings.blockTime}
                  onChange={(e) => handleSettingChange('blockTime', +e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                           shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                           dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Security Alerts */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Security Alerts
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <p className="ml-2 text-sm text-yellow-700">Unusual network activity detected</p>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <p className="ml-2 text-sm text-red-700">Multiple failed login attempts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Network Status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2 text-green-600" />
              Network Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Active Nodes</span>
                <span className="text-sm font-medium">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Current Block Height</span>
                <span className="text-sm font-medium">1,234,567</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Network Hash Rate</span>
                <span className="text-sm font-medium">45.7 TH/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 