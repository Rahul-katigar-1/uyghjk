import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard, Smartphone, Shield, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { mockUser } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type PaymentMethod = 'wallet' | 'upi' | 'card';

export default function Payment() {
  const navigate = useNavigate();
  const { getTotal, clearCart } = useCartStore();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const subtotal = getTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode; subtitle: string }[] = [
    {
      id: 'wallet',
      label: 'Wallet',
      icon: <Wallet className="w-5 h-5" />,
      subtitle: `Balance: $${mockUser.walletBalance.toFixed(2)}`,
    },
    {
      id: 'upi',
      label: 'UPI',
      icon: <Smartphone className="w-5 h-5" />,
      subtitle: 'GPay, PhonePe, Paytm',
    },
    {
      id: 'card',
      label: 'Card',
      icon: <CreditCard className="w-5 h-5" />,
      subtitle: 'Credit / Debit Card',
    },
  ];

  const handlePayment = async () => {
    if (selectedMethod === 'wallet' && mockUser.walletBalance < total) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Generate a mock order ID
    const orderId = `ORD-${Date.now()}`;
    
    clearCart();
    navigate(`/order-status/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4 safe-top">
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Payment</h1>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Amount Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-primary rounded-2xl p-6 text-white text-center"
        >
          <p className="text-sm opacity-80 mb-1">Total Amount</p>
          <p className="text-4xl font-bold">${total.toFixed(2)}</p>
        </motion.div>

        {/* Payment Methods */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <motion.div
                key={method.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod(method.id)}
                className={cn(
                  "glass-card rounded-xl p-4 cursor-pointer transition-all",
                  selectedMethod === method.id
                    ? "ring-2 ring-primary shadow-md"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    selectedMethod === method.id
                      ? "bg-gradient-primary text-white"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{method.label}</p>
                    <p className="text-sm text-muted-foreground">{method.subtitle}</p>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    selectedMethod === method.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  )}>
                    {selectedMethod === method.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Wallet Warning */}
        {selectedMethod === 'wallet' && mockUser.walletBalance < total && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-destructive/10 border border-destructive/20 rounded-xl p-4"
          >
            <p className="text-sm text-destructive">
              Insufficient balance. You need ${(total - mockUser.walletBalance).toFixed(2)} more.
            </p>
            <Link to="/wallet">
              <Button variant="link" className="text-primary p-0 h-auto mt-1">
                Add money to wallet →
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Order Summary (Collapsible) */}
        <div className="glass-card rounded-xl overflow-hidden">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="w-full p-4 flex items-center justify-between"
          >
            <span className="font-semibold text-foreground">Order Summary</span>
            <motion.div
              animate={{ rotate: showSummary ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </button>
          <AnimatePresence>
            {showSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="text-foreground">${tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Secure Payment Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-secondary" />
          <span>Secured by 256-bit encryption</span>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          onClick={handlePayment}
          disabled={isProcessing || (selectedMethod === 'wallet' && mockUser.walletBalance < total)}
          className="w-full h-14 rounded-2xl bg-gradient-primary hover:opacity-90 text-lg font-semibold shadow-xl shadow-primary/30 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${total.toFixed(2)}`
          )}
        </Button>
      </div>
    </div>
  );
}
