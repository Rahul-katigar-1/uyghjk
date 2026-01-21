import { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WalletCard } from '@/components/WalletCard';
import { MachineCard } from '@/components/MachineCard';
import { mockMachines, mockOrders, mockUser } from '@/data/mockData';
import { Link } from 'react-router-dom';

type FilterType = 'nearest' | 'most-items' | 'recent';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('nearest');

  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'nearest', label: 'Nearest', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'most-items', label: 'Most Items', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { id: 'recent', label: 'Recent', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  const sortedMachines = [...mockMachines].sort((a, b) => {
    switch (activeFilter) {
      case 'nearest':
        return a.distance - b.distance;
      case 'most-items':
        return b.availableItems - a.availableItems;
      default:
        return a.distance - b.distance;
    }
  });

  const filteredMachines = sortedMachines.filter((machine) =>
    machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    machine.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 py-4 safe-top">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Good morning,</p>
              <h1 className="text-xl font-bold text-foreground">{mockUser.name.split(' ')[0]} 👋</h1>
            </div>
            <Link to="/profile">
              <motion.img
                whileTap={{ scale: 0.95 }}
                src={mockUser.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search machines, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-6">
        {/* Wallet Card */}
        <WalletCard />

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 rounded-full whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-gradient-primary text-white border-0 shadow-md'
                  : 'hover:bg-muted'
              }`}
            >
              {filter.icon}
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Recent Orders */}
        {mockOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Recent Orders</h2>
              <Link to="/orders" className="text-sm text-primary font-medium">
                View All
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
              {mockOrders.slice(0, 3).map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-64"
                >
                  <Link to={`/order/${order.id}`}>
                    <div className="glass-card rounded-xl p-3.5 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {order.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1 truncate">
                        {order.machineName}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <img
                              key={i}
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-8 h-8 rounded-full object-cover border-2 border-card"
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-primary">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Machines */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Nearby Machines</h2>
            <Link to="/search" className="text-sm text-primary font-medium">
              See All
            </Link>
          </div>
          
          <AnimatePresence mode="wait">
            {filteredMachines.length > 0 ? (
              <motion.div
                key="machines"
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredMachines.map((machine, index) => (
                  <MachineCard key={machine.id} machine={machine} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">No machines found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
