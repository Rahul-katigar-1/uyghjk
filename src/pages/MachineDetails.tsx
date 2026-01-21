import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Thermometer, Clock, Navigation, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { mockMachines, mockProducts } from '@/data/mockData';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

type Category = 'all' | 'beverages' | 'snacks' | 'healthy';

export default function MachineDetails() {
  const { machineId } = useParams<{ machineId: string }>();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const { getItemCount, getTotal } = useCartStore();

  const machine = mockMachines.find((m) => m.id === machineId);
  const itemCount = getItemCount();
  const total = getTotal();

  if (!machine) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Machine not found</h2>
          <Link to="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'beverages', label: 'Beverages' },
    { id: 'snacks', label: 'Snacks' },
    { id: 'healthy', label: 'Healthy' },
  ];

  const filteredProducts = mockProducts.filter((product) =>
    product.machineId === machineId &&
    (activeCategory === 'all' || product.category === activeCategory)
  );

  const statusConfig = {
    online: { class: 'status-online', label: 'Online', bgClass: 'bg-emerald-50 text-emerald-700' },
    offline: { class: 'status-offline', label: 'Offline', bgClass: 'bg-red-50 text-red-700' },
    'low-stock': { class: 'status-low-stock', label: 'Low Stock', bgClass: 'bg-amber-50 text-amber-700' },
  };

  const status = statusConfig[machine.status];

  return (
    <div className="min-h-screen pb-32 bg-background">
      {/* Hero Image */}
      <div className="relative h-56">
        <img
          src={machine.image}
          alt={machine.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Back Button */}
        <Link to="/">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg safe-top"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </Link>

        {/* Status Badge */}
        <div className={cn(
          "absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full safe-top",
          status.bgClass
        )}>
          <div className={cn("status-dot", status.class)} />
          <span className="text-sm font-medium">{status.label}</span>
        </div>
      </div>

      {/* Machine Info */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="glass-card rounded-2xl p-4 shadow-lg">
          <h1 className="text-xl font-bold text-foreground mb-1">{machine.name}</h1>
          <p className="text-sm text-muted-foreground mb-4">{machine.location}</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
              <MapPin className="w-5 h-5 text-primary mb-1" />
              <span className="text-sm font-semibold text-foreground">{machine.distance} km</span>
              <span className="text-xs text-muted-foreground">Distance</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
              <Thermometer className="w-5 h-5 text-secondary mb-1" />
              <span className="text-sm font-semibold text-foreground">{machine.temperature}°C</span>
              <span className="text-xs text-muted-foreground">Temperature</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
              <Clock className="w-5 h-5 text-accent mb-1" />
              <span className="text-sm font-semibold text-foreground">{machine.operatingHours}</span>
              <span className="text-xs text-muted-foreground">Hours</span>
            </div>
          </div>

          <Button className="w-full gap-2 bg-gradient-secondary hover:opacity-90 rounded-xl h-11">
            <Navigation className="w-4 h-4" />
            Get Directions
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "rounded-full whitespace-nowrap transition-all",
                activeCategory === category.id
                  ? "bg-gradient-primary text-white border-0 shadow-md"
                  : "hover:bg-muted"
              )}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products in this category</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-4 right-4 z-50"
          >
            <Link to="/cart">
              <Button className="w-full h-14 rounded-2xl bg-gradient-primary hover:opacity-90 shadow-xl shadow-primary/30 flex items-center justify-between px-5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-xs font-bold bg-accent text-accent-foreground rounded-full">
                      {itemCount}
                    </span>
                  </div>
                  <span className="font-semibold">View Cart</span>
                </div>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
