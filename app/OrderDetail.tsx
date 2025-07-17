import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Order } from './types';
import { useColorScheme } from 'react-native';
import Colors from './../constants/Colors';
import { useAppContext } from './context/AppContext';

type RootStackParamList = {
  OrderDetail: { orderId: string };
};

type OrderDetailRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;

interface OrderMap {
  [key: string]: Order;
}

const OrderDetail: React.FC = () => {

const { orders } = useAppContext();

const ORDER_DATA: OrderMap = orders.reduce((map, order) => {
  map[order.id] = order;
  return map;
}, {} as OrderMap);

  const route = useRoute<OrderDetailRouteProp>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { orderId } = route.params;
  const order = ORDER_DATA[orderId];

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text }}>Order not found</Text>
      </View>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleString();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Order #{order.id}</Text>
      <Text style={[styles.subHeader, { color: colors.darkGray }]}>Placed on: {orderDate}</Text>

      {/* Items Section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Items</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.itemQty, { color: colors.darkGray }]}>Qty: {item.quantity}</Text>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>
                ${item.price.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Shipping Address */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Shipping Address</Text>
        <Text style={{ color: colors.text }}>{order.shippingAddress.id}</Text>
        <Text style={{ color: colors.text }}>{order.shippingAddress.street}</Text>
        <Text style={{ color: colors.text }}>
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
        </Text>
        <Text style={{ color: colors.text }}>{order.shippingAddress.country}</Text>
      </View>

      {/* Payment Info */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Payment Method</Text>
        <Text style={{ color: colors.text }}>{order.paymentMethod}</Text>
      </View>

      {/* Order Summary */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Order Summary</Text>
        <Text style={{ color: colors.text }}>Status: {order.status.toUpperCase()}</Text>
        <Text style={[styles.totalText, { color: colors.primary }]}>
          Total: ${order.totalAmount.toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemQty: {
    fontSize: 14,
    marginVertical: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
});

export default OrderDetail;
