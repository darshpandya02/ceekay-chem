import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { CartItemComponent } from '../../components/CartItem';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const router = useRouter();
  const { cart, isLoading, error, clearCart } = useAppContext();
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  // Calculate the total price with null safety
  const totalPrice = React.useMemo(() => {
    if (!cart || !cart.items) return 0;
    // Use the pre-calculated totalAmount from Cart interface
    return cart.totalAmount;
  }, [cart]);
  
  // Get cart items with null safety
  const cartItems = cart?.items || [];
  const cartItemsCount = cart?.totalItems || 0;
  
  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => clearCart() }
      ]
    );
  };
  
  const handleCheckout = () => {
    router.navigate({
      pathname: '/Checkout'
    });
  };
  
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Your Cart</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={[styles.clearText, { color: colors.danger }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.darkGray }]}>
            Your cart is empty
          </Text>
          <TouchableOpacity 
            style={[styles.shopButton, { backgroundColor: colors.primary }]}
            onPress={() => router.navigate({pathname: '/(tabs)'})}
          >
            <Text style={styles.shopButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.cartList}>
            {cartItems.map((item) => (
              <CartItemComponent 
                key={item.id || `${typeof item.product === 'string' ? item.product : item.product.id}`} 
                item={item} 
              />
            ))}
          </ScrollView>
          
          <View 
            style={[
              styles.summaryContainer, 
              { backgroundColor: colors.background, borderTopColor: colors.lightGray }
            ]}
          >
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.text }]}>
                Subtotal ({cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'})
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
            
            {/* Additional cart info */}
            {cart && (
              <View style={styles.cartInfoContainer}>
                <Text style={[styles.cartInfoText, { color: colors.darkGray }]}>
                  Cart ID: {cart.id}
                </Text>
                <Text style={[styles.cartInfoText, { color: colors.darkGray }]}>
                  Last Updated: {new Date(cart.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
              onPress={handleCheckout}
              disabled={cartItems.length === 0}
            >
              <Text style={styles.checkoutButtonText}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
  },
  shopButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cartList: {
    flex: 1,
    padding: 15,
  },
  summaryContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartInfoContainer: {
    marginBottom: 15,
  },
  cartInfoText: {
    fontSize: 12,
    marginBottom: 2,
  },
  checkoutButton: {
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});