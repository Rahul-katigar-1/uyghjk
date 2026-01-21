import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, Tag, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cartStore';
import { mockMachines } from '@/data/mockData';

export default function Cart() {
  const navigate = useNavigate();
  const { items, machineId, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const machine = mockMachines.find((m) => m.id === machineId);
  const subtotal = getTotal();
  const tax = subtotal * 0.08; // 8% tax
  const discount = promoApplied ? subtotal * 0.1 : 0; // 10% discount
  const total = subtotal + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4 safe-top">
          <div className="flex items-center gap-4">
            <Link to="/">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <h1 className="text-xl font-bold text-foreground">Cart</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6"
          >
            <span className="text-5xl">🛒</span>
          </motion.div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-6">
            Find a vending machine nearby and add some items!
          </p>
          <Link to="/">
            <Button className="rounded-xl bg-gradient-primary hover:opacity-90 px-6">
              Browse Machines
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-44">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4 safe-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={machineId ? `/machine/${machineId}` : '/'}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Cart</h1>
              <p className="text-sm text-muted-foreground">{items.length} items</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Machine Info */}
        {machine && (
          <div className="glass-card rounded-xl p-3 flex items-center gap-3">
            <img
              src={machine.image}
              alt={machine.name}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{machine.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{machine.location}</span>
              </div>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="glass-card rounded-xl p-3"
              >
                <div className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-foreground line-clamp-2">
                        {item.product.name}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.product.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-lg font-bold text-primary mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-8 w-8 rounded-full"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="h-8 w-8 rounded-full bg-gradient-primary hover:opacity-90"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="font-semibold text-foreground">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Promo Code */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-accent" />
            <span className="font-medium text-foreground">Promo Code</span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={promoApplied}
              className="rounded-xl bg-muted/50 border-0"
            />
            <Button
              onClick={handleApplyPromo}
              disabled={!promoCode || promoApplied}
              className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground px-6"
            >
              {promoApplied ? 'Applied!' : 'Apply'}
            </Button>
          </div>
          {promoApplied && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-secondary mt-2"
            >
              ✓ 10% discount applied!
            </motion.p>
          )}
        </div>

        {/* Order Summary */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span className="text-foreground">${tax.toFixed(2)}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-secondary">
                <span>Discount (10%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-border flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-lg text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Estimated dispense time: ~30 seconds</span>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          onClick={() => navigate('/payment')}
          className="w-full h-14 rounded-2xl bg-gradient-primary hover:opacity-90 text-lg font-semibold shadow-xl shadow-primary/30"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
