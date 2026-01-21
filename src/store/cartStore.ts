import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  machineId: string | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      machineId: null,

      addItem: (product: Product) => {
        set((state) => {
          // If cart has items from different machine, clear it
          if (state.machineId && state.machineId !== product.machineId) {
            return {
              items: [{ product, quantity: 1 }],
              machineId: product.machineId,
            };
          }

          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
                  : item
              ),
              machineId: product.machineId,
            };
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
            machineId: product.machineId,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.product.id !== productId
          );
          return {
            items: newItems,
            machineId: newItems.length > 0 ? state.machineId : null,
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.items.filter(
              (item) => item.product.id !== productId
            );
            return {
              items: newItems,
              machineId: newItems.length > 0 ? state.machineId : null,
            };
          }

          return {
            items: state.items.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Math.min(quantity, item.product.stock) }
                : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [], machineId: null }),

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'vending-cart',
    }
  )
);
