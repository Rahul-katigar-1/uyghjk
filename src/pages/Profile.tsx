import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, ChevronRight, Bell, Heart, Shield, LogOut, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { mockUser } from '@/data/mockData';

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const menuItems = [
    { icon: Heart, label: 'Favorites', subtitle: '12 items saved' },
    { icon: Bell, label: 'Notifications', hasToggle: true, value: notifications, onChange: setNotifications },
    { icon: Moon, label: 'Dark Mode', hasToggle: true, value: darkMode, onChange: setDarkMode },
    { icon: Shield, label: 'Privacy & Security', subtitle: 'Manage your data' },
  ];

  const tierColors = {
    bronze: 'from-amber-600 to-amber-700',
    silver: 'from-slate-400 to-slate-500',
    gold: 'from-amber-400 to-amber-500',
    platinum: 'from-slate-300 to-slate-400',
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary text-white">
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
            <h1 className="text-xl font-bold">Profile</h1>
          </div>

          {/* Profile Card */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white/20"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{mockUser.name}</h2>
              <p className="text-sm opacity-80">{mockUser.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${tierColors[mockUser.tier]}`}>
                  {mockUser.tier.toUpperCase()}
                </span>
                <span className="text-xs opacity-80">
                  {mockUser.loyaltyPoints.toLocaleString()} pts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5 -mt-2">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4 text-center"
          >
            <p className="text-2xl font-bold text-primary">23</p>
            <p className="text-xs text-muted-foreground">Orders</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-4 text-center"
          >
            <p className="text-2xl font-bold text-secondary">${mockUser.walletBalance.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Balance</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-4 text-center"
          >
            <p className="text-2xl font-bold text-accent">12</p>
            <p className="text-xs text-muted-foreground">Favorites</p>
          </motion.div>
        </div>

        {/* Menu Items */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 border-b border-border last:border-0"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.label}</p>
                {item.subtitle && (
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                )}
              </div>
              {item.hasToggle ? (
                <Switch
                  checked={item.value}
                  onCheckedChange={item.onChange}
                />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}
