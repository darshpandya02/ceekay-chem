import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  useColorScheme,
  Alert
} from 'react-native';
import { useAppContext } from './context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const { cart, user, placeOrder } = useAppContext();
  const [placing, setPlacing] = React.useState(false);
  const [orderError, setOrderError] = React.useState<string | null>(null);

  // Ship to the customer's default saved address, falling back to a sample one
  const shippingAddress = React.useMemo(() => {
    const saved = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
    return saved
      ? { street: saved.street, city: saved.city, state: saved.state, zipCode: saved.zipCode, country: saved.country }
      : { street: '123 Market St', city: 'San Francisco', state: 'CA', zipCode: '94105', country: 'USA' };
  }, [user]);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  // Use cart's calculated totalAmount or calculate from items
  const totalPrice = React.useMemo(() => {
    if (!cart) return 0;
    // Use the pre-calculated totalAmount from Cart interface
    return cart.totalAmount;
  }, [cart]);

  const handleConfirmOrder = async () => {
    setPlacing(true);
    setOrderError(null);
    try {
      const order = await placeOrder(shippingAddress, 'Cash on Delivery');
      if (!order) {
        setOrderError('Could not place the order. Please try again.');
        return;
      }
      Alert.alert('Order Confirmed', 'Thank you for your purchase!');
      router.navigate({ pathname: '/(tabs)/order' });
    } finally {
      setPlacing(false);
    }
  };

  // Early return if cart is empty or null
  if (!cart || cart.items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
        <View style={styles.emptyCart}>
          <Text style={[styles.emptyCartText, { color: colors.text }]}>
            Your cart is empty
          </Text>
          <TouchableOpacity 
            style={[styles.confirmButton, { backgroundColor: colors.primary }]} 
            onPress={() => router.navigate({ pathname: '/(tabs)' })}
          >
            <Text style={styles.confirmButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>

      <ScrollView style={styles.cartSummary}>
        {cart.items.map((item) => (
          <View key={item.id || `${typeof item.product === 'string' ? item.product : item.product.id}`} style={styles.itemRow}>
            <Text style={[styles.itemText, { color: colors.text }]}>
              {typeof item.product === 'string' ? 'Product' : item.product.name} × {item.quantity}
            </Text>
            <Text style={[styles.itemPrice, { color: colors.text }]}>
              ${(item.subtotal || item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.text }]}>
            Total Items: {cart.totalItems}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.text }]}>Total</Text>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>
            ${totalPrice.toFixed(2)}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Shipping Info</Text>
          <Text style={[styles.infoText, { color: colors.darkGray }]}>{user?.name || 'Guest'}</Text>
          <Text style={[styles.infoText, { color: colors.darkGray }]}>{shippingAddress.street}</Text>
          <Text style={[styles.infoText, { color: colors.darkGray }]}>
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
          </Text>
        </View>

        <View style={styles.cartInfo}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cart Details</Text>
          <Text style={[styles.infoText, { color: colors.darkGray }]}>
            Cart ID: {cart.id}
          </Text>
          <Text style={[styles.infoText, { color: colors.darkGray }]}>
            Created: {new Date(cart.createdAt).toLocaleDateString()}
          </Text>
          <Text style={[styles.infoText, { color: colors.darkGray }]}>
            Last Updated: {new Date(cart.updatedAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.confirmButton, { backgroundColor: colors.primary }]} 
          onPress={handleConfirmOrder}
          disabled={placing}
        >
          <Text style={styles.confirmButtonText}>{placing ? 'Placing Order...' : 'Confirm Order'}</Text>
        </TouchableOpacity>
        {orderError ? (
          <Text style={[styles.infoText, { color: colors.danger, marginTop: 10 }]}>{orderError}</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  cartSummary: {
    flex: 1,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyCartText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 18,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  userInfo: {
    marginBottom: 20,
  },
  cartInfo: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 2,
  },
  confirmButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});