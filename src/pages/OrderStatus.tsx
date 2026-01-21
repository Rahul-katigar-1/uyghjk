import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Clock, Cog, Package, AlertCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { OrderStepper } from '@/components/OrderStepper';
import Confetti from '@/components/Confetti';

const orderSteps = [
  { id: 1, label: 'Payment Confirmed', icon: <Check className="w-5 h-5" /> },
  { id: 2, label: 'Preparing', icon: <Clock className="w-5 h-5" /> },
  { id: 3, label: 'Dispensing', icon: <Cog className="w-5 h-5" /> },
  { id: 4, label: 'Ready', icon: <Package className="w-5 h-5" /> },
];

export default function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Simulate order progress
    const progressTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 3000);

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  useEffect(() => {
    if (currentStep === 4) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const statusMessages = {
    1: { title: 'Payment Successful!', subtitle: 'Your order is being processed' },
    2: { title: 'Preparing Your Order', subtitle: 'Items are being selected' },
    3: { title: 'Dispensing Items', subtitle: 'Please wait...' },
    4: { title: 'Ready to Collect!', subtitle: 'Scan the QR code at the machine' },
  };

  const status = statusMessages[currentStep as keyof typeof statusMessages];

  return (
    <div className="min-h-screen bg-background pb-24">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="bg-gradient-primary text-white px-4 py-6 safe-top">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              currentStep === 4 ? 'bg-secondary' : 'bg-white/20'
            }`}
          >
            {currentStep === 4 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Check className="w-8 h-8" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Cog className="w-8 h-8" />
              </motion.div>
            )}
          </motion.div>
          <motion.h1
            key={status.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-1"
          >
            {status.title}
          </motion.h1>
          <motion.p
            key={status.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm opacity-80"
          >
            {status.subtitle}
          </motion.p>
        </div>
      </div>

      {/* Order Stepper */}
      <div className="px-4 -mt-2">
        <div className="glass-card rounded-2xl p-4 shadow-lg">
          <OrderStepper steps={orderSteps} currentStep={currentStep} />
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 text-center"
        >
          <h3 className="font-semibold text-foreground mb-4">Scan at Machine</h3>
          <div className="inline-block p-4 bg-white rounded-2xl shadow-inner">
            <QRCodeSVG
              value={`vending://collect/${orderId}`}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="mt-4 font-mono text-sm text-muted-foreground">
            Order ID: {orderId}
          </p>
          
          {/* Countdown */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">
              Scan within{' '}
              <span className="font-bold text-accent">{formatTime(countdown)}</span>
            </span>
          </div>
        </motion.div>

        {/* Machine Location */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Central Mall Vending</p>
              <p className="text-sm text-muted-foreground">Ground Floor, Near Entrance</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              Directions
            </Button>
          </div>
        </div>

        {/* Report Issue */}
        <Button variant="outline" className="w-full rounded-xl h-12 gap-2">
          <AlertCircle className="w-4 h-4" />
          Report an Issue
        </Button>

        {/* Back to Home */}
        <Link to="/">
          <Button variant="ghost" className="w-full rounded-xl h-12">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
