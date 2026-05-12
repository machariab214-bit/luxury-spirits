'use client';

import BlackCardDashboard from '../components/BlackCardDashboard';
import LoginForm from '../components/LoginForm';
import { useAuth } from '@/lib/auth';

export default function DashboardPage() {
  return (
    <ClientDashboard />
  );
}

function ClientDashboard() {
  const { isAuthenticated, isBlackCard, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (!isBlackCard) {
    return <BlackCardDashboard />;
  }

  return <BlackCardDashboard />;
}