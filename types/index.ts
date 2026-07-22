export type Category =
  | 'Laptops'
  | 'Mobiles'
  | 'Smart Watches'
  | 'Headphones'
  | 'Gaming'
  | 'Cameras';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  description: string;
  images: string[];
  specs: Record<string, string>;
  features: string[];
  tags: string[];
  isFeatured?: boolean;
  isDeal?: boolean;
  releaseDate: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  total: number;
  items: CartItem[];
  address: Address;
  paymentMethod: string;
  trackingId?: string;
  estimatedDelivery?: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'flat';
  minOrder: number;
  description: string;
}

export interface Brand {
  name: string;
  logo: string;
  productCount: number;
}

export interface AIRecommendation {
  productId: string;
  reason: string;
  matchScore: number;
}

export interface ComparisonResult {
  pros: Record<string, string[]>;
  cons: Record<string, string[]>;
  recommendation: string;
  bestValueId: string;
}
