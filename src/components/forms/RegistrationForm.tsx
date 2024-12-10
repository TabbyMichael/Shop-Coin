import React, { useState } from 'react';
import { Store, User, Building2, Mail, Phone, CreditCard, QrCode, Settings, Network, FileText } from 'lucide-react';

interface RegistrationData {
  type: 'shopkeeper' | 'customer';
  businessName?: string;
  businessType?: string;
  shopAddress?: string;
  businessRegNumber?: string;
  contactInfo?: string;
  p2pPreferences?: string[];
  b2bOptions?: string[];
  paymentSettings?: string[];
  fullName?: string;
  email?: string;
  phone?: string;
  preferredPayments?: string[];
  loyaltyOptIn?: boolean;
  qrCodeAccess?: boolean;
  preferredShops?: string[];
}

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationData>({
    type: 'shopkeeper'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = <T extends keyof RegistrationData>(field: T, value: RegistrationData[T]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Registration Type Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            className={`px-4 py-2 rounded-md transition-all ${
              formData.type === 'shopkeeper'
                ? 'bg-orange-500 text-white'
                : 'text-gray-500'
            }`}
            onClick={() => handleInputChange('type', 'shopkeeper')}
          >
            <Store className="inline-block w-4 h-4 mr-2" />
            Shopkeeper
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-all ${
              formData.type === 'customer'
                ? 'bg-orange-500 text-white'
                : 'text-gray-500'
            }`}
            onClick={() => handleInputChange('type', 'customer')}
          >
            <User className="inline-block w-4 h-4 mr-2" />
            Customer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formData.type === 'shopkeeper' ? (
          // Shopkeeper Registration Fields
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building2 className="inline-block w-4 h-4 mr-2" />
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName || ''}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Store className="inline-block w-4 h-4 mr-2" />
                  Business Type
                </label>
                <select
                  value={formData.businessType || ''}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select type</option>
                  <option value="retail">Retail Store</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="service">Service Provider</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="marketplace">Online Marketplace</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText className="inline-block w-4 h-4 mr-2" />
                  Business Registration Number
                </label>
                <input
                  type="text"
                  value={formData.businessRegNumber || ''}
                  onChange={(e) => handleInputChange('businessRegNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Network className="inline-block w-4 h-4 mr-2" />
                  P2P Network Preferences
                </label>
                <div className="space-y-2">
                  {['Direct P2P', 'Network Pool', 'Hybrid'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.p2pPreferences?.includes(option) || false}
                        onChange={(e) => {
                          const current = formData.p2pPreferences || [];
                          handleInputChange(
                            'p2pPreferences',
                            e.target.checked
                              ? [...current, option]
                              : current.filter(item => item !== option)
                          );
                        }}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Settings className="inline-block w-4 h-4 mr-2" />
                  Payment Settings
                </label>
                <div className="space-y-2">
                  {['Instant Settlement', 'Batch Processing', 'Smart Contract Escrow'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.paymentSettings?.includes(option) || false}
                        onChange={(e) => {
                          const current = formData.paymentSettings || [];
                          handleInputChange(
                            'paymentSettings',
                            e.target.checked
                              ? [...current, option]
                              : current.filter(item => item !== option)
                          );
                        }}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Customer Registration Fields
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline-block w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName || ''}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline-block w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline-block w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CreditCard className="inline-block w-4 h-4 mr-2" />
                  Preferred Payment Methods
                </label>
                <div className="space-y-2">
                  {['Credit Card', 'Bank Transfer', 'Mobile Wallet', 'Cryptocurrency'].map((method) => (
                    <label key={method} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.preferredPayments?.includes(method) || false}
                        onChange={(e) => {
                          const current = formData.preferredPayments || [];
                          handleInputChange(
                            'preferredPayments',
                            e.target.checked
                              ? [...current, method]
                              : current.filter(item => item !== method)
                          );
                        }}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.loyaltyOptIn || false}
                    onChange={(e) => handleInputChange('loyaltyOptIn', e.target.checked)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Join Loyalty Program</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.qrCodeAccess || false}
                    onChange={(e) => handleInputChange('qrCodeAccess', e.target.checked)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <QrCode className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Enable QR Code Scanner</span>
                </label>
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {formData.type === 'shopkeeper' ? (
                <Store className="w-5 h-5 mr-2" />
              ) : (
                <User className="w-5 h-5 mr-2" />
              )}
              Register as {formData.type === 'shopkeeper' ? 'Shopkeeper' : 'Customer'}
            </span>
          )}
        </button>
      </form>
    </div>
  );
}