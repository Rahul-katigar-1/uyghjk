import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, RefreshCw, ChevronRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { mockOrders } from '@/data/mockData';
import { cn } from '@/lib/utils';

type OrderFilter = 'all' | 'completed' | 'failed';

export default function Orders() {
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all');

  const filters: { id: OrderFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' },
  ];

  const filteredOrders = mockOrders.filter((order) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return order.status === 'completed';
    if (activeFilter === 'failed') return order.status === 'failed';
    return true;
  });

  const statusConfig = {
    pending: { label: 'Pending', class: 'bg-amber-100 text-amber-700' },
    confirmed: { label: 'Confirmed', class: 'bg-primary/10 text-primary' },
    preparing: { label: 'Preparing', class: 'bg-primary/10 text-primary' },
    dispensing: { label: 'Dispensing', class: 'bg-primary/10 text-primary' },
    ready: { label: 'Ready', class: 'bg-secondary/10 text-secondary' },
    completed: { label: 'Completed', class: 'bg-secondary/10 text-secondary' },
    failed: { label: 'Failed', class: 'bg-destructive/10 text-destructive' },
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4 safe-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <h1 className="text-xl font-bold text-foreground">Orders</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Filters */}
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "rounded-full",
                activeFilter === filter.id
                  ? "bg-gradient-primary text-white border-0"
                  : "hover:bg-muted"
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        <AnimatePresence mode="wait">
          {filteredOrders.length > 0 ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredOrders.map((order, index) => {
                const status = statusConfig[order.status];
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/order/${order.id}`}>
                      <div className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-sm text-muted-foreground">
                            {order.id}
                          </span>
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium",
                            status.class
                          )}>
                            {status.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, i) => (
                              <img
                                key={i}
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-10 h-10 rounded-lg object-cover border-2 border-card"
                              />
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-medium border-2 border-card">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {order.machineName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.createdAt.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="font-semibold text-foreground">
                            ${order.total.toFixed(2)}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full gap-1"
                              onClick={(e) => {
                                e.preventDefault();
                                // Handle reorder
                              }}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Reorder
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">No orders yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start by finding a vending machine nearby
              </p>
              <Link to="/">
                <Button className="rounded-xl bg-gradient-primary hover:opacity-90">
                  Browse Machines
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
