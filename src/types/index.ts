export interface Machine {
  id: string;
  name: string;
  location: string;
  address: string;
  distance: number;
  status: 'online' | 'offline' | 'low-stock';
  availableItems: number;
  temperature: number;
  operatingHours: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'beverages' | 'snacks' | 'healthy' | 'all';
  stock: number;
  machineId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'dispensing' | 'ready' | 'completed' | 'failed';
  machineId: string;
  machineName: string;
  machineLocation: string;
  createdAt: Date;
  qrCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  walletBalance: number;
  loyaltyPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
}
