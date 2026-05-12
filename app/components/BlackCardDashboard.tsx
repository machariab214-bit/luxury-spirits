'use client';

import { motion } from 'framer-motion';
import { Crown, Gift, Calendar, GlassWater, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { trackDashboardView } from '@/lib/analytics';
import { useEffect } from 'react';

export default function BlackCardDashboard() {
  const { isBlackCard, isLoading, customerTier } = useAuth();

  useEffect(() => {
    if (isBlackCard && !isLoading) {
      // Track dashboard view for authenticated Black Card members
      trackDashboardView(customerTier);
    }
  }, [isBlackCard, isLoading, customerTier]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying membership...</p>
        </div>
      </div>
    );
  }

  if (!isBlackCard) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <Crown className="mx-auto text-[#D4AF37] mb-6" size={48} />
          <h1 className="text-3xl font-serif mb-4">Exclusive Access Required</h1>
          <p className="text-gray-400 mb-8">
            This dashboard is reserved for Black Card members only. Your current tier: <span className="text-[#D4AF37]">{customerTier}</span>
          </p>
          <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-full font-bold hover:bg-[#FFBF00] transition-colors">
            Upgrade to Black Card
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Status', value: 'Black Card', icon: <Crown className="text-[#D4AF37]" /> },
    { label: 'Reserve Points', value: '12,450', icon: <Gift className="text-[#D4AF37]" /> },
    { label: 'Private Events', value: '2 Upcoming', icon: <Calendar className="text-[#D4AF37]" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-white pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">

          <div>
            <h2 className="text-[#D4AF37] tracking-[0.3em] uppercase text-sm mb-2">
              Exclusive Membership
            </h2>
            <h1 className="text-5xl font-serif">
              Welcome Back, Julian
            </h1>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-gray-500 text-sm italic">
              "The finest things are reserved for those who wait."
            </p>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md"
            >
              <div className="mb-4">{stat.icon}</div>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-light font-serif">
                {stat.value}
              </p>
            </motion.div>
          ))}

        </div>

        {/* Allocation Section */}
        <section className="mb-12">

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-serif">
              Your Private Allocations
            </h3>

            <span className="text-[#D4AF37] text-xs uppercase tracking-tighter border-b border-[#D4AF37] cursor-pointer">
              View All Collections
            </span>
          </div>

          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0c0c0c] border border-[#D4AF37]/30 rounded-3xl overflow-hidden flex flex-col md:flex-row">

            <div className="w-full md:w-1/3 h-64 bg-[url('/images/rare-bottle.jpg')] bg-cover bg-center" />

            <div className="p-8 flex-1 flex flex-col justify-center">

              <div className="bg-[#D4AF37] text-black text-[10px] font-bold px-2 py-1 rounded w-fit mb-4">
                MEMBER EXCLUSIVE
              </div>

              <h4 className="text-3xl font-serif mb-2">
                Hibiki 21 Year Old: Mt. Fuji Edition
              </h4>

              <p className="text-gray-400 mb-6 max-w-md">
                As a Black Card member, we have reserved 1 of only 100 bottles for your collection. Reservation expires in 48 hours.
              </p>

              <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-[#D4AF37] transition-colors w-fit">
                Claim Allocation
              </button>

            </div>
          </div>

        </section>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="group border border-white/5 p-6 rounded-xl hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between">

            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-full">
                <GlassWater size={20} className="text-[#D4AF37]" />
              </div>

              <div>
                <p className="font-serif">
                  Request Personal Sommelier
                </p>
                <p className="text-xs text-gray-500">
                  24/7 priority curation service
                </p>
              </div>
            </div>

            <ChevronRight className="text-gray-600 group-hover:text-[#D4AF37]" />
          </div>

          {/* Repeat for other benefits... */}

        </div>

      </div>
    </div>
  );
}