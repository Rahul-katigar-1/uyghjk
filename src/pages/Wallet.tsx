import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, CreditCard, ArrowDownLeft, ArrowUpRight, Star, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { mockUser, mockTransactions } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Wallet() {
  const tierColors = {
    bronze: 'from-amber-600 to-amber-700',
    silver: 'from-slate-400 to-slate-500',
    gold: 'from-amber-400 to-amber-500',
    platinum: 'from-slate-300 to-slate-400',
  };

  const tierProgress = {
    bronze: { current: 0, next: 1000, nextTier: 'Silver' },
    silver: { current: 1000, next: 2500, nextTier: 'Gold' },
    gold: { current: 2500, next: 5000, nextTier: 'Platinum' },
    platinum: { current: 5000, next: 10000, nextTier: 'Diamond' },
  };

  const progress = tierProgress[mockUser.tier];
  const progressPercent = ((mockUser.loyaltyPoints - progress.current) / (progress.next - progress.current)) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="px-4 py-4 safe-top">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <h1 className="text-xl font-bold">Wallet</h1>
          </div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20"
          >
            <p className="text-sm opacity-80 mb-1">Available Balance</p>
            <p className="text-4xl font-bold mb-4">${mockUser.walletBalance.toFixed(2)}</p>
            <Button className="bg-white text-primary hover:bg-white/90 rounded-xl gap-2 px-6">
              <Plus className="w-4 h-4" />
              Add Money
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5 -mt-2">
        {/* Loyalty Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-foreground">Loyalty Points</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${tierColors[mockUser.tier]}`}>
              {mockUser.tier.toUpperCase()}
            </span>
          </div>
          
          <p className="text-3xl font-bold text-foreground mb-2">
            {mockUser.loyaltyPoints.toLocaleString()}
          </p>
          
          <div className="mb-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{progress.current} pts</span>
              <span>{progress.next} pts</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-accent rounded-full"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {(progress.next - mockUser.loyaltyPoints).toLocaleString()} points to {progress.nextTier}
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="glass-card rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <p className="font-medium text-foreground">Add Card</p>
            <p className="text-xs text-muted-foreground">Link payment method</p>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="glass-card rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
              <Gift className="w-5 h-5 text-accent" />
            </div>
            <p className="font-medium text-foreground">Rewards</p>
            <p className="text-xs text-muted-foreground">View offers</p>
          </motion.div>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Recent Transactions</h2>
          <div className="space-y-3">
            {mockTransactions.map((txn, index) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-4 flex items-center gap-3"
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  txn.type === 'credit' ? "bg-secondary/10" : "bg-destructive/10"
                )}>
                  {txn.type === 'credit' ? (
                    <ArrowDownLeft className="w-5 h-5 text-secondary" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {txn.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className={cn(
                  "font-semibold",
                  txn.type === 'credit' ? "text-secondary" : "text-foreground"
                )}>
                  {txn.type === 'credit' ? '+' : '-'}${txn.amount.toFixed(2)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
