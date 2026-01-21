import { Product } from '@/types';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product);
    toast.success(`Added ${product.name} to cart`, {
      icon: '🛒',
      duration: 2000,
    });
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
    if (newQuantity === 0) {
      toast.info(`Removed ${product.name} from cart`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative"
    >
      <div className={cn(
        "glass-card rounded-2xl overflow-hidden transition-all duration-300",
        !isOutOfStock && "hover:shadow-lg hover:-translate-y-0.5",
        quantity > 0 && "ring-2 ring-primary ring-offset-2"
      )}>
        {/* Product Image */}
        <div className="relative aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover",
              isOutOfStock && "grayscale opacity-50"
            )}
          />
          
          {/* Stock Badge */}
          <div className={cn(
            "absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium",
            product.stock <= 5 && product.stock > 0
              ? "bg-amber-100 text-amber-700"
              : product.stock > 5
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          )}>
            {isOutOfStock ? 'Out of Stock' : `${product.stock} left`}
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="px-4 py-2 bg-destructive text-destructive-foreground rounded-full text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quantity Badge */}
          <AnimatePresence>
            {quantity > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-2 left-2 w-7 h-7 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-lg"
              >
                {quantity}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-3">
          <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-1 min-h-[2.5rem]">
            {product.name}
          </h4>
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>

            {quantity === 0 ? (
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="h-8 px-3 rounded-full bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleUpdateQuantity(quantity - 1)}
                  className="h-8 w-8 rounded-full"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-6 text-center font-semibold text-sm">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  onClick={() => handleUpdateQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="h-8 w-8 rounded-full bg-gradient-primary hover:opacity-90"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
