import React, { useState, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { BlockViewer } from './components/blockchain/BlockViewer';
import { NetworkStats } from './components/blockchain/NetworkStats';
import { ShopkeeperForm } from './components/forms/ShopkeeperForm';
import { PaymentForm } from './components/payment/PaymentForm';
import { LoyaltyStats } from './components/loyalty/LoyaltyStats';
import { RegistrationForm } from './components/forms/RegistrationForm';
import { Blockchain } from './lib/blockchain/Blockchain';
import { ShopkeeperRegistry } from './lib/blockchain/ShopkeeperRegistry';
import { PaymentFormData, BlockchainState } from './lib/blockchain/types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { AdminInterface } from './components/admin/AdminInterface';
import { ThemeProvider } from './contexts/ThemeContext';

const blockchain = new Blockchain();
const registry = new ShopkeeperRegistry(blockchain);

function App() {
  const [state, setState] = useState<BlockchainState>({
    balance: 0,
    loyaltyPoints: 0,
    isProcessing: false,
    error: null
  });

  const [formData, setFormData] = useState({
    address: '',
    name: '',
    businessType: '',
  });

  const handleFormChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePayment = useCallback(async (paymentData: PaymentFormData) => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      if (paymentData.type === 'loyalty') {
        // Convert loyalty points to ShopCoin
        const pointValue = Math.floor(paymentData.amount * 0.1); // 10 points = 1 SC
        if (state.loyaltyPoints < pointValue) {
          throw new Error('Insufficient loyalty points');
        }
        setState(prev => ({ ...prev, loyaltyPoints: prev.loyaltyPoints - pointValue }));
      }

      blockchain.addTransaction({
        from: paymentData.from,
        to: paymentData.to,
        amount: paymentData.amount,
        timestamp: Date.now(),
        type: paymentData.type
      });

      // Add loyalty points for regular payments
      if (paymentData.type === 'payment') {
        setState(prev => ({
          ...prev,
          loyaltyPoints: prev.loyaltyPoints + Math.floor(paymentData.amount)
        }));
      }

      registry.processTransaction(paymentData.to);
      blockchain.minePendingTransactions('miner');

      setState(prev => ({
        ...prev,
        balance: blockchain.getBalance(paymentData.from),
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isProcessing: false
      }));
    }
  }, [state.loyaltyPoints]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-8">
                <NetworkStats
                  difficulty={2}
                  totalSupply={blockchain.getTotalSupply()}
                  shopkeepersCount={registry.getShopkeepersCount()}
                  lastBlockTime={blockchain.getLatestBlock().timestamp}
                />
                
                <AnalyticsDashboard />
                
                <AdminInterface />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <RegistrationForm />
                    <ShopkeeperForm
                      onSubmit={(e) => {
                        e.preventDefault();
                        registry.registerShopkeeper(formData.address, formData.name, formData.businessType);
                      }}
                      formData={formData}
                      onChange={handleFormChange}
                      isProcessing={state.isProcessing}
                    />
                    
                    <LoyaltyStats
                      points={state.loyaltyPoints}
                      pointsValue={state.loyaltyPoints * 0.1}
                      transactionCount={blockchain.getTransactionCount(formData.address)}
                    />
                  </div>
                  
                  <div className="space-y-8">
                    <PaymentForm
                      onSubmit={handlePayment}
                      isProcessing={state.isProcessing}
                    />
                    
                    <BlockViewer blocks={blockchain.chain} />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;