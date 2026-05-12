'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Crown, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Please enter your access token');
      return;
    }

    try {
      await login(token);
    } catch (err) {
      setError('Invalid access token. Please check and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Crown className="mx-auto text-[#D4AF37] mb-4" size={48} />
          <h1 className="text-3xl font-serif mb-2">Black Card Access</h1>
          <p className="text-gray-400">Enter your member access token</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Access Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your Shopify access token"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-900/30 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-bold hover:bg-[#FFBF00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an access token? Contact our concierge team.
          </p>
        </div>
      </div>
    </div>
  );
}