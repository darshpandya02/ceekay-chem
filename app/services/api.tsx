// import { Product, Order, User, CartItem, Address } from '../types';

// // Mock data for products
// const products: Product[] = [
//   {
//     id: '1',
//     name: 'NPK 15-15-15',
//     description: 'Balanced fertilizer for general plant growth with equal parts nitrogen, phosphorus, and potassium.',
//     price: 45.99,
//     image: 'https://placehold.co/400x300',
//     category: 'NPK Blends',
//     stock: 500,
//     unit: 'kg',
//     specifications: {
//       'Total Nitrogen': '15%',
//       'Available Phosphate': '15%',
//       'Soluble Potash': '15%'
//     },
//     isPromoted: true,
//     discountPercentage: 10
//   },
//   {
//     id: '2',
//     name: 'Urea 46-0-0',
//     description: 'High-nitrogen fertilizer for rapid green growth in nitrogen-deficient crops.',
//     price: 38.50,
//     image: 'https://placehold.co/400x300',
//     category: 'Nitrogen',
//     stock: 750,
//     unit: 'kg',
//     specifications: {
//       'Total Nitrogen': '46%'
//     }
//   },
//   {
//     id: '3',
//     name: 'Triple Super Phosphate',
//     description: 'High-phosphorus fertilizer ideal for root development and flowering stages.',
//     price: 42.75,
//     image: 'https://placehold.co/400x300',
//     category: 'Phosphorus',
//     stock: 300,
//     unit: 'kg',
//     specifications: {
//       'Available Phosphate': '46%'
//     }
//   },
//   {
//     id: '4',
//     name: 'Potassium Chloride',
//     description: 'High-potassium fertilizer for improved plant disease resistance and quality.',
//     price: 48.99,
//     image: 'https://placehold.co/400x300',
//     category: 'Potassium',
//     stock: 450,
//     unit: 'kg',
//     specifications: {
//       'Soluble Potash': '60%'
//     }
//   },
//   {
//     id: '5',
//     name: 'Micronutrient Mix',
//     description: 'Complete blend of essential micronutrients for optimum crop health.',
//     price: 65.00,
//     image: 'https://placehold.co/400x300',
//     category: 'Micronutrients',
//     stock: 200,
//     unit: 'kg',
//     specifications: {
//       'Iron': '2.5%',
//       'Manganese': '1.5%',
//       'Zinc': '1.0%',
//       'Copper': '0.5%',
//       'Boron': '0.5%'
//     },
//     isPromoted: true,
//     discountPercentage: 5
//   }
// ];

// // Mock user data
// const currentUser: User = {
//   id: 'u1',
//   name: 'John Farmer',
//   email: 'john.farmer@example.com',
//   phone: '+1234567890',
//   defaultAddress: {
//     fullName: 'John Farmer',
//     streetAddress: '123 Farm Road',
//     city: 'Agrville',
//     state: 'Midwest',
//     postalCode: '12345',
//     country: 'USA',
//     phoneNumber: '+1234567890'
//   },
//   savedAddresses: [],
//   orderHistory: [
//     {
//       id: 'ord1',
//       items: [
//         {
//           product: products[0],
//           quantity: 5
//         },
//         {
//           product: products[2],
//           quantity: 3
//         }
//       ],
//       status: 'delivered',
//       totalAmount: 357.70,
//       createdAt: '2025-04-15T10:30:00Z',
//       paymentMethod: 'Credit Card',
//       shippingAddress: {
//         fullName: 'John Farmer',
//         streetAddress: '123 Farm Road',
//         city: 'Agrville',
//         state: 'Midwest',
//         postalCode: '12345',
//         country: 'USA',
//         phoneNumber: '+1234567890'
//       }
//     }
//   ]
// };

// // Create an in-memory cart
// let cart: CartItem[] = [];

// // API service
// export const api = {
//   // Product APIs
//   getProducts: (): Promise<Product[]> => {
//     return Promise.resolve(products);
//   },
  
//   getProductById: (id: string): Promise<Product | undefined> => {
//     const product = products.find(p => p.id === id);
//     return Promise.resolve(product);
//   },
  
//   getProductsByCategory: (category: string): Promise<Product[]> => {
//     const filtered = products.filter(p => p.category === category);
//     return Promise.resolve(filtered);
//   },
  
//   getPromotedProducts: (): Promise<Product[]> => {
//     const promoted = products.filter(p => p.isPromoted);
//     return Promise.resolve(promoted);
//   },
  
//   // Cart APIs
//   getCart: (): Promise<CartItem[]> => {
//     return Promise.resolve(cart);
//   },
  
//   addToCart: (product: Product, quantity: number): Promise<CartItem[]> => {
//     const existingItem = cart.find(item => item.product.id === product.id);
    
//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.push({ product, quantity });
//     }
    
//     return Promise.resolve([...cart]);
//   },
  
//   updateCartItemQuantity: (productId: string, quantity: number): Promise<CartItem[]> => {
//     cart = cart.map(item => 
//       item.product.id === productId ? { ...item, quantity } : item
//     ).filter(item => item.quantity > 0);
    
//     return Promise.resolve([...cart]);
//   },
  
//   removeFromCart: (productId: string): Promise<CartItem[]> => {
//     cart = cart.filter(item => item.product.id !== productId);
//     return Promise.resolve([...cart]);
//   },
  
//   clearCart: (): Promise<CartItem[]> => {
//     cart = [];
//     return Promise.resolve([]);
//   },
  
//   // Order APIs
//   getOrders: (): Promise<Order[]> => {
//     return Promise.resolve(currentUser.orderHistory);
//   },
  
//   getOrderById: (id: string): Promise<Order | undefined> => {
//     const order = currentUser.orderHistory.find(o => o.id === id);
//     return Promise.resolve(order);
//   },
  
//   placeOrder: (items: CartItem[], address: Address, paymentMethod: string): Promise<Order> => {
//     // Calculate total amount
//     const totalAmount = items.reduce((sum, item) => 
//       sum + (item.product.price * item.quantity), 0);
    
//     // Create new order
//     const newOrder: Order = {
//       id: `ord${Date.now()}`,
//       items: [...items],
//       status: 'pending',
//       totalAmount,
//       createdAt: new Date().toISOString(),
//       estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//       paymentMethod,
//       shippingAddress: address
//     };
    
//     // Add to order history
//     currentUser.orderHistory.unshift(newOrder);
    
//     // Clear cart after order is placed
//     cart = [];
    
//     return Promise.resolve(newOrder);
//   },
  
//   // User APIs
//   getCurrentUser: (): Promise<User> => {
//     return Promise.resolve(currentUser);
//   },
  
//   updateUser: (updatedUser: Partial<User>): Promise<User> => {
//     Object.assign(currentUser, updatedUser);
//     return Promise.resolve({...currentUser});
//   },
  
//   addAddress: (address: Address): Promise<User> => {
//     currentUser.savedAddresses.push(address);
//     return Promise.resolve({...currentUser});
//   },
  
//   setDefaultAddress: (addressIndex: number): Promise<User> => {
//     if (addressIndex >= 0 && addressIndex < currentUser.savedAddresses.length) {
//       currentUser.defaultAddress = currentUser.savedAddresses[addressIndex];
//     }
//     return Promise.resolve({...currentUser});
//   }
// };


import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem, Order, User } from '../types';

const API_BASE_URL = 'https://ceekay-backend.onrender.com/api'; 
// const API_BASE_URL = 'http://localhost:5000/api'; 

interface LoginResponse {
  token: string;
  user: User;
}

interface SignupResponse {
  token: string;
  user: User;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
}

interface PaginatedResponse<T> {
  products?: T[];
  totalPages?: number;
  currentPage?: number;
  total?: number;
}

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Helper method to extract products from response
  private extractProducts<T>(response: T[] | PaginatedResponse<T>): T[] {
    if (Array.isArray(response)) {
      return response;
    }
    return response.products || [];
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData: SignupData): Promise<SignupResponse> {
    return this.makeRequest<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    return this.makeRequest<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async verifyToken(token: string): Promise<User> {
    return this.makeRequest<User>('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Product endpoints - updated to handle both array and paginated responses
  async getProducts(): Promise<Product[]> {
    const response = await this.makeRequest<Product[] | PaginatedResponse<Product>>('/products');
    return this.extractProducts(response);
  }

  async getPromotedProducts(): Promise<Product[]> {
    const response = await this.makeRequest<Product[] | PaginatedResponse<Product>>('/products/promoted');
    return this.extractProducts(response);
  }

  async getProductById(id: string): Promise<Product> {
    return this.makeRequest<Product>(`/products/${id}`);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const response = await this.makeRequest<Product[] | PaginatedResponse<Product>>(`/products/search?q=${encodeURIComponent(query)}`);
    return this.extractProducts(response);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await this.makeRequest<Product[] | PaginatedResponse<Product>>(`/products/category/${category}`);
    return this.extractProducts(response);
  }

  // New methods for paginated responses (if you want to access pagination metadata)
  async getProductsPaginated(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Product>> {
    const response = await this.makeRequest<Product[] | PaginatedResponse<Product>>(`/products?page=${page}&limit=${limit}`);
    if (Array.isArray(response)) {
      return { products: response };
    }
    return response;
  }

  async searchProductsPaginated(query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Product>> {
    const response = await this.makeRequest<Product[] | PaginatedResponse<Product>>(`/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    if (Array.isArray(response)) {
      return { products: response };
    }
    return response;
  }

  async getProductsByCategoryPaginated(category: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Product>> {
    const response = await this.makeRequest<Product[] | PaginatedResponse<Product>>(`/products/category/${category}?page=${page}&limit=${limit}`);
    if (Array.isArray(response)) {
      return { products: response };
    }
    return response;
  }

  // Cart endpoints (require authentication)
  async getCart(): Promise<CartItem[]> {
    return this.makeRequest<CartItem[]>('/cart');
  }

  async addToCart(product: Product, quantity: number): Promise<CartItem[]> {
    return this.makeRequest<CartItem[]>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ 
        productId: product.id, 
        quantity,
        product // Include product data for immediate UI update
      }),
    });
  }

  async updateCartItemQuantity(productId: string, quantity: number): Promise<CartItem[]> {
    return this.makeRequest<CartItem[]>('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string): Promise<CartItem[]> {
    return this.makeRequest<CartItem[]>('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  }

  async clearCart(): Promise<void> {
    return this.makeRequest<void>('/cart/clear', {
      method: 'DELETE',
    });
  }

  // Order endpoints (require authentication)
  async getOrders(): Promise<Order[]> {
    return this.makeRequest<Order[]>('/orders');
  }

  async getOrderById(id: string): Promise<Order> {
    return this.makeRequest<Order>(`/orders/${id}`);
  }

  async placeOrder(
    cart: CartItem[], 
    address: any, 
    paymentMethod: string
  ): Promise<Order> {
    return this.makeRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: cart,
        shippingAddress: address,
        paymentMethod,
      }),
    });
  }

  // User endpoints (require authentication)
  async getCurrentUser(): Promise<User> {
    return this.makeRequest<User>('/user/profile');
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    return this.makeRequest<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserAddresses(): Promise<any[]> {
    return this.makeRequest<any[]>('/user/addresses');
  }

  async addUserAddress(address: any): Promise<any> {
    return this.makeRequest<any>('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }

  async updateUserAddress(addressId: string, address: any): Promise<any> {
    return this.makeRequest<any>(`/user/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    });
  }

  async deleteUserAddress(addressId: string): Promise<void> {
    return this.makeRequest<void>(`/user/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }

  // Password reset endpoints
  async requestPasswordReset(email: string): Promise<void> {
    return this.makeRequest<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.makeRequest<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Wishlist endpoints (require authentication)
  async getWishlist(): Promise<Product[]> {
    return this.makeRequest<Product[]>('/user/wishlist');
  }

  async addToWishlist(productId: string): Promise<void> {
    return this.makeRequest<void>('/user/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: string): Promise<void> {
    return this.makeRequest<void>('/user/wishlist/remove', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  }
}

export const api = new ApiService();