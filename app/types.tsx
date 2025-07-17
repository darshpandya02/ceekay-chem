// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  avatar?: string;
  addresses?: Address[];
  wishlist?: string[]; // Array of Product IDs
  orderHistory?: Order[];
  isActive: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type?: 'home' | 'office' | 'other';
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  thumbnail?: string;
  inStock: boolean;
  stock: number; // Changed from stockQuantity to match schema
  sku: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  unit?: string; // kg, liters, pieces, etc.
  specifications: ProductSpecification[];
  isPromoted: boolean;
  promotedUntil?: string;
  rating: number; // averageRating from schema
  reviewCount: number; // totalReviews from schema
  reviews?: Review[];
  tags: string[];
  isActive: boolean;
  isHazardous?: boolean;
  storageInstructions?: string;
  applicationInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
  unit?: string;
}

// Cart types
export interface CartItem {
  id?: string;
  product: Product; // Can be populated Product 
  quantity: number;
  price: number; // Price at the time of adding to cart
  subtotal?: number; // Calculated field
  addedAt?: string;
}

export interface Cart {
  id: string;
  user: string; // User ID
  items: CartItem[];
  totalItems?: number; // Calculated field
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Order {
  id: string;
  user: string; // User ID
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  subtotal?: number;
  taxAmount?: number;
  shippingAmount?: number;
  discountAmount?: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string; // Simplified to match schema
  paymentStatus: PaymentStatus;
  shippingMethod?: ShippingMethod;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id?: string;
  product: Product; // Can be populated Product
  quantity: number;
  price: number;
  name: string; // Product name at time of order
  image?: string; // Product image at time of order
  subtotal?: number; // Calculated field
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface PaymentMethodType {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash_on_delivery' | 'wallet';
  provider?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimatedDays: number;
  isActive: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export type NotificationType = 
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'payment_success'
  | 'payment_failed'
  | 'stock_alert'
  | 'price_drop'
  | 'promotion'
  | 'system';


// Review types
export interface Review {
  id?: string;
  user: string | User; // Can be populated User or just ID
  rating: number;
  comment?: string;
  createdAt: string;
  // Additional fields for external review system
  productId?: string;
  orderId?: string;
  title?: string;
  images?: string[];
  isVerified?: boolean;
  isHelpful?: number;
  updatedAt?: string;
}