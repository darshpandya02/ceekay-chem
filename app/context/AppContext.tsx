// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { Product, CartItem, Order, User } from '../types';
// import { api } from '../services/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// interface SignupData {
//   name: string;
//   email: string;
//   password: string;
//   phone?: string;
//   companyName?: string;
// }

// interface AppContextType {
//   products: Product[];
//   promotedProducts: Product[];
//   cart: CartItem[];
//   orders: Order[];
//   user: User | null;
//   isLoading: boolean;
//   error: string | null;
//   isAuthenticated: boolean;
  
//   // Product actions
//   fetchProducts: () => Promise<void>;
//   fetchProductById: (id: string) => Promise<Product | undefined>;
  
//   // Cart actions
//   addToCart: (product: Product, quantity: number) => Promise<void>;
//   updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
//   removeFromCart: (productId: string) => Promise<void>;
//   clearCart: () => Promise<void>;
  
//   // Order actions
//   fetchOrders: () => Promise<void>;
//   fetchOrderById: (id: string) => Promise<Order | undefined>;
//   placeOrder: (address: any, paymentMethod: string) => Promise<Order | undefined>;
  
//   // User actions
//   fetchCurrentUser: () => Promise<void>;
  
//   // Auth actions
//   login: (email: string, password: string) => Promise<void>;
//   signup: (userData: SignupData) => Promise<void>;
//   logout: () => Promise<void>;
//   checkAuthStatus: () => Promise<void>;
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [products, setProducts] = useState<Product[]>([]); 
//   const [promotedProducts, setPromotedProducts] = useState<Product[]>([]);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
//   // Product actions
//   const fetchProducts = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await api.getProducts();
//       console.log("data received from the api", data)
//       setProducts(data);
      
//       const promoted = await api.getPromotedProducts();
//       setPromotedProducts(promoted);
//     } catch (err) {
//       setError('Failed to fetch products');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const fetchProductById = async (id: string) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const product = await api.getProductById(id);
//       return product;
//     } catch (err) {
//       setError('Failed to fetch product details');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   // Cart actions
//   const addToCart = async (product: Product, quantity: number) => {
//     if (!isAuthenticated) {
//       setError('Please login to add items to cart');
//       return;
//     }
    
//     setIsLoading(true);
//     setError(null);
//     try {
//       const updatedCart = await api.addToCart(product, quantity);
//       setCart(updatedCart);
//     } catch (err) {
//       setError('Failed to add item to cart');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const updateCartItemQuantity = async (productId: string, quantity: number) => {
//     if (!isAuthenticated) {
//       setError('Please login to update cart');
//       return;
//     }
    
//     setIsLoading(true);
//     setError(null);
//     try {
//       const updatedCart = await api.updateCartItemQuantity(productId, quantity);
//       setCart(updatedCart);
//     } catch (err) {
//       setError('Failed to update cart');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const removeFromCart = async (productId: string) => {
//     if (!isAuthenticated) {
//       setError('Please login to remove items from cart');
//       return;
//     }
    
//     setIsLoading(true);
//     setError(null);
//     try {
//       const updatedCart = await api.removeFromCart(productId);
//       setCart(updatedCart);
//     } catch (err) {
//       setError('Failed to remove item from cart');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const clearCart = async () => {
//     if (!isAuthenticated) {
//       setError('Please login to clear cart');
//       return;
//     }
    
//     setIsLoading(true);
//     setError(null);
//     try {
//       await api.clearCart();
//       setCart([]);
//     } catch (err) {
//       setError('Failed to clear cart');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   // Order actions
//   const fetchOrders = async () => {
//     if (!isAuthenticated) {
//       setError('Please login to view orders');
//       return;
//     }
    
//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await api.getOrders();
//       setOrders(data);
//     } catch (err) {
//       setError('Failed to fetch orders');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const fetchOrderById = async (id: string) => {
//     if (!isAuthenticated) {
//       setError('Please login to view order details');
//       return;
//     }
    
//     setIsLoading(true);
//     setError(null);
//     try {
//       const order = await api.getOrderById(id);
//       return order;
//     } catch (err) {
//       setError('Failed to fetch order details');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const placeOrder = async (address: any, paymentMethod: string) => {
//     if (!isAuthenticated) {
//       setError('Please login to place an order');
//       return;
//     }
    
//     setIsLoading(true);
//     setError(null);
//     try {
//       if (cart.length === 0) {
//         setError('Cannot place an order with an empty cart');
//         return;
//       }
      
//       const order = await api.placeOrder(cart, address, paymentMethod);
//       await fetchOrders();
//       setCart([]);
//       return order;
//     } catch (err) {
//       setError('Failed to place order');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   // User actions
//   const fetchCurrentUser = async () => {
//     if (!isAuthenticated) {
//       return;
//     }
    
//     setIsLoading(true);
//     setError(null);
//     try {
//       const userData = await api.getCurrentUser();
//       setUser(userData);
//       setOrders(userData.orderHistory || []);
//     } catch (err) {
//       setError('Failed to fetch user data');
//       console.error(err);
//       // If user fetch fails, might be auth issue
//       await logout();
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   // Auth actions
//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await api.login(email, password);
      
//       // Store auth token
//       await AsyncStorage.setItem('authToken', response.token);
      
//       // Set user data
//       setUser(response.user);
//       setIsAuthenticated(true);
      
//       // Fetch user-specific data
//       await fetchCurrentUser();
      
//       // Fetch cart if exists
//       try {
//         const cartData = await api.getCart();
//         setCart(cartData);
//       } catch (cartErr) {
//         console.log('No cart found or error fetching cart:', cartErr);
//       }
      
//     } catch (err) {
//       setError('Invalid credentials');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const signup = async (userData: SignupData) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await api.signup(userData);
      
//       // Store auth token
//       await AsyncStorage.setItem('authToken', response.token);
      
//       // Set user data
//       setUser(response.user);
//       setIsAuthenticated(true);
      
//       // Initialize empty cart for new user
//       setCart([]);
//       setOrders([]);
      
//     } catch (err) {
//       setError('Failed to create account');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const logout = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // Call logout API if needed
//       await api.logout();
      
//       // Clear auth token
//       await AsyncStorage.removeItem('authToken');
      
//       // Clear user data
//       setUser(null);
//       setIsAuthenticated(false);
//       setCart([]);
//       setOrders([]);
      
//     } catch (err) {
//       console.error('Logout error:', err);
//       // Clear local data even if API call fails
//       await AsyncStorage.removeItem('authToken');
//       setUser(null);
//       setIsAuthenticated(false);
//       setCart([]);
//       setOrders([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const checkAuthStatus = async () => {
//     setIsLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       if (token) {
//         // Verify token with API
//         const userData = await api.verifyToken(token);
//         setUser(userData);
//         setIsAuthenticated(true);
        
//         // Fetch user-specific data
//         await fetchCurrentUser();
        
//         // Fetch cart if exists
//         try {
//           const cartData = await api.getCart();
//           setCart(cartData);
//         } catch (cartErr) {
//           console.log('No cart found or error fetching cart:', cartErr);
//         }
//       }
//     } catch (err) {
//       console.log('Auth check failed:', err);
//       // Clear invalid token
//       await AsyncStorage.removeItem('authToken');
//       setUser(null);
//       setIsAuthenticated(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     // Check auth status on app start
//     checkAuthStatus();
//     // Always fetch products (public data)
//     fetchProducts();
//   }, []);
  
//   const value = {
//     products,
//     promotedProducts,
//     cart,
//     orders,
//     user,
//     isLoading,
//     error,
//     isAuthenticated,
//     fetchProducts,
//     fetchProductById,
//     addToCart,
//     updateCartItemQuantity,
//     removeFromCart,
//     clearCart,
//     fetchOrders,
//     fetchOrderById,
//     placeOrder,
//     fetchCurrentUser,
//     login,
//     signup,
//     logout,
//     checkAuthStatus
//   };
  
//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (context === undefined) {
//     throw new Error('useAppContext must be used within an AppProvider');
//   }
//   return context;
// };

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Cart, Order, User } from '../types';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
}

interface AppContextType {
  products: Product[];
  promotedProducts: Product[];
  cart: Cart | null; // Changed from CartItem[] to Cart | null
  orders: Order[];
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Product actions
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | undefined>;
  
  // Cart actions
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Order actions
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<Order | undefined>;
  placeOrder: (address: any, paymentMethod: string) => Promise<Order | undefined>;
  
  // User actions
  fetchCurrentUser: () => Promise<void>;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]); 
  const [promotedProducts, setPromotedProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null); // Changed from CartItem[] to Cart | null
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Helper function to calculate cart totals
  const calculateCartTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.subtotal || item.price * item.quantity), 0);
    return { totalItems, totalAmount };
  };

  // Helper function to create/update cart object
  const createCartObject = (items: CartItem[], existingCart?: Cart | null): Cart => {
    const { totalItems, totalAmount } = calculateCartTotals(items);
    const now = new Date().toISOString();
    
    return {
      id: existingCart?.id || `cart_${Date.now()}`, // Generate ID if not exists
      user: user?.id || '', // User ID from current user
      items: items.map(item => ({
        ...item,
        subtotal: item.subtotal || item.price * item.quantity,
        addedAt: item.addedAt || now
      })),
      totalItems,
      totalAmount,
      createdAt: existingCart?.createdAt || now,
      updatedAt: now
    };
  };
  
  // Product actions
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getProducts();
      console.log("data received from the api", data)
      setProducts(data);
      
      const promoted = await api.getPromotedProducts();
      setPromotedProducts(promoted);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchProductById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const product = await api.getProductById(id);
      return product;
    } catch (err) {
      setError('Failed to fetch product details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cart actions
  const addToCart = async (product: Product, quantity: number) => {
    if (!isAuthenticated) {
      setError('Please login to add items to cart');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const updatedCartItems = await api.addToCart(product, quantity);
      const updatedCart = createCartObject(updatedCartItems, cart);
      setCart(updatedCart);
    } catch (err) {
      setError('Failed to add item to cart');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateCartItemQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      setError('Please login to update cart');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const updatedCartItems = await api.updateCartItemQuantity(productId, quantity);
      const updatedCart = createCartObject(updatedCartItems, cart);
      setCart(updatedCart);
    } catch (err) {
      setError('Failed to update cart');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) {
      setError('Please login to remove items from cart');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const updatedCartItems = await api.removeFromCart(productId);
      const updatedCart = createCartObject(updatedCartItems, cart);
      setCart(updatedCart);
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearCart = async () => {
    if (!isAuthenticated) {
      setError('Please login to clear cart');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await api.clearCart();
      setCart(null); // Set to null instead of empty array
    } catch (err) {
      setError('Failed to clear cart');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Order actions
  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setError('Please login to view orders');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const data = user?.role === 'admin' ? await api.getAllOrders() : await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchOrderById = async (id: string) => {
    if (!isAuthenticated) {
      setError('Please login to view order details');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const order = await api.getOrderById(id);
      return order;
    } catch (err) {
      setError('Failed to fetch order details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const placeOrder = async (address: any, paymentMethod: string) => {
    if (!isAuthenticated) {
      setError('Please login to place an order');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      if (!cart || cart.items.length === 0) {
        setError('Cannot place an order with an empty cart');
        return;
      }
      
      const order = await api.placeOrder(cart.items, address, paymentMethod); // Pass cart.items
      await fetchOrders();
      setCart(null); // Set to null instead of empty array
      return order;
    } catch (err) {
      setError('Failed to place order');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // User actions
  const fetchCurrentUser = async () => {
    if (!isAuthenticated) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
      setOrders(userData.orderHistory || []);
    } catch (err) {
      setError('Failed to fetch user data');
      console.error(err);
      // If user fetch fails, might be auth issue
      await logout();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Auth actions
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.login(email, password);
      
      // Store auth token
      await AsyncStorage.setItem('authToken', response.token);
      
      // Set user data
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Fetch user-specific data
      await fetchCurrentUser();
      
      // Fetch cart if exists
      try {
        const cartData = await api.getCart();
        const cartObject = createCartObject(cartData);
        setCart(cartObject);
      } catch (cartErr) {
        console.log('No cart found or error fetching cart:', cartErr);
        setCart(null);
      }
      
    } catch (err) {
      setError('Invalid credentials');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.signup(userData);
      
      // Store auth token
      await AsyncStorage.setItem('authToken', response.token);
      
      // Set user data
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Initialize empty cart for new user
      setCart(null);
      setOrders([]);
      
    } catch (err) {
      setError('Failed to create account');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call logout API if needed
      await api.logout();
      
      // Clear auth token
      await AsyncStorage.removeItem('authToken');
      
      // Clear user data
      setUser(null);
      setIsAuthenticated(false);
      setCart(null);
      setOrders([]);
      
    } catch (err) {
      console.error('Logout error:', err);
      // Clear local data even if API call fails
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      setCart(null);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Verify token with API
        const userData = await api.verifyToken(token);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Fetch user-specific data
        await fetchCurrentUser();
        
        // Fetch cart if exists
        try {
          const cartData = await api.getCart();
          const cartObject = createCartObject(cartData);
          setCart(cartObject);
        } catch (cartErr) {
          console.log('No cart found or error fetching cart:', cartErr);
          setCart(null);
        }
      }
    } catch (err) {
      console.log('Auth check failed:', err);
      // Clear invalid token
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Check auth status on app start
    checkAuthStatus();
    // Always fetch products (public data)
    fetchProducts();
  }, []);
  
  const value = {
    products,
    promotedProducts,
    cart,
    orders,
    user,
    isLoading,
    error,
    isAuthenticated,
    fetchProducts,
    fetchProductById,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    fetchOrders,
    fetchOrderById,
    placeOrder,
    fetchCurrentUser,
    login,
    signup,
    logout,
    checkAuthStatus
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};