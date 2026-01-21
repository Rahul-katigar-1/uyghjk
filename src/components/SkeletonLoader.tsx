import { motion } from 'framer-motion';

interface SkeletonCardProps {
  variant?: 'machine' | 'product' | 'order';
}

export function SkeletonCard({ variant = 'machine' }: SkeletonCardProps) {
  if (variant === 'product') {
    return (
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="aspect-square bg-muted shimmer" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-muted rounded shimmer w-3/4" />
          <div className="flex items-center justify-between">
            <div className="h-6 bg-muted rounded shimmer w-16" />
            <div className="h-8 bg-muted rounded-full shimmer w-16" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'order') {
    return (
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-muted rounded shimmer w-24" />
          <div className="h-5 bg-muted rounded-full shimmer w-20" />
        </div>
        <div className="h-4 bg-muted rounded shimmer w-3/4" />
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-muted rounded shimmer" />
          <div className="w-12 h-12 bg-muted rounded shimmer" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="h-5 bg-muted rounded shimmer w-16" />
          <div className="h-8 bg-muted rounded-full shimmer w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="h-32 bg-muted shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded shimmer w-3/4" />
        <div className="h-4 bg-muted rounded shimmer w-1/2" />
        <div className="flex items-center gap-4">
          <div className="h-4 bg-muted rounded shimmer w-16" />
          <div className="h-4 bg-muted rounded shimmer w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonLoader({ count = 3, variant = 'machine' }: { count?: number; variant?: 'machine' | 'product' | 'order' }) {
  return (
    <div className={variant === 'product' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <SkeletonCard variant={variant} />
        </motion.div>
      ))}
    </div>
  );
}
