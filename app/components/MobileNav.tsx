'use client';

import { motion } from 'framer-motion';
import {
  Home,
  Search,
  ShoppingBag,
  Crown,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function MobileNav() {
  const [isSommelierOpen, setIsSommelierOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">

      {/* Frosted Glass Background */}
      <div className="absolute inset-0 bg-[#0C0C0C]/80 backdrop-blur-xl border-t border-white/10" />

      <div className="relative flex justify-around items-center h-20 px-4">

        <NavLink
          icon={<Home size={22} />}
          label="Home"
          href="/"
          active
        />

        <NavLink
          icon={<Search size={22} />}
          label="Shop"
          href="/shop"
        />

        {/* Floating Center Action: AI Sommelier */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsSommelierOpen(!isSommelierOpen);
            trackEvent('mobile_nav_ai_sommelier_click', {
              action: isSommelierOpen ? 'close' : 'open',
            });
          }}
          className="relative -top-6"
        >
          <div className="bg-[#D4AF37] p-4 rounded-2xl shadow-[0_10px_20px_rgba(212,175,55,0.4)]">
            <MessageCircle color="black" size={24} />
          </div>
        </motion.button>

        <NavLink
          icon={<Crown size={22} />}
          label="Reserve"
          href="/dashboard"
        />

        <NavLink
          icon={<ShoppingBag size={22} />}
          label="Cart"
          href="/cart"
          badge="2"
        />

      </div>
    </nav>
  );
}

function NavLink({
  icon,
  label,
  href,
  active = false,
  badge = '',
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: string;
}) {
  const handleClick = () => {
    trackEvent('mobile_nav_click', {
      nav_item: label.toLowerCase(),
      destination: href,
      has_badge: !!badge,
      badge_value: badge,
    });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="flex flex-col items-center gap-1 group relative"
    >
      <div
        className={`transition-colors duration-300 ${
          active
            ? 'text-[#D4AF37]'
            : 'text-gray-500 group-hover:text-white'
        }`}
      >
        {icon}

        {badge && (
          <span className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-bold px-1.5 rounded-full border-2 border-black">
            {badge}
          </span>
        )}
      </div>

      <span
        className={`text-[10px] uppercase tracking-tighter ${
          active
            ? 'text-[#D4AF37]'
            : 'text-gray-500 group-hover:text-white'
        }`}
      >
        {label}
      </span>
    </Link>
  );
}