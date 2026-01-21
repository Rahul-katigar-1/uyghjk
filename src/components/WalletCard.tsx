import { Wallet, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockUser } from '@/data/mockData';
import { Link } from 'react-router-dom';

export function WalletCard() {
  const tierColors = {
    bronze: 'from-amber-600 to-amber-700',
    silver: 'from-slate-400 to-slate-500',
    gold: 'from-amber-400 to-amber-500',
    platinum: 'from-slate-300 to-slate-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to="/wallet">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-5 text-white shadow-xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-2 border-white" />
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-2 border-white" />
            <div className="absolute right-20 bottom-0 w-16 h-16 rounded-full border-2 border-white" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Wallet Balance</p>
                  <p className="text-2xl font-bold">${mockUser.walletBalance.toFixed(2)}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-60" />
            </div>

            {/* Loyalty Points */}
            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-300" />
                <span className="text-sm">
                  <span className="font-semibold">{mockUser.loyaltyPoints.toLocaleString()}</span> points
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${tierColors[mockUser.tier]} shadow-lg`}>
                {mockUser.tier.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
