import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

interface OrderStepperProps {
  steps: Step[];
  currentStep: number;
}

export function OrderStepper({ steps, currentStep }: OrderStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        {/* Progress Line Background */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full mx-8" />
        
        {/* Active Progress Line */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-primary rounded-full mx-8"
          initial={{ width: 0 }}
          animate={{
            width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 4rem)`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isPending = step.id > currentStep;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted && "bg-secondary text-secondary-foreground shadow-lg",
                  isActive && "bg-gradient-primary text-white shadow-lg animate-pulse-glow",
                  isPending && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}
              </motion.div>
              
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-[70px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
