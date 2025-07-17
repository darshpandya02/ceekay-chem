import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Order } from '../app/types';
import Colors from '../constants/Colors';

interface OrderItemProps {
  order: Order;
}

export const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const handlePress = () => {
    router.push({
      pathname: '/OrderDetail',
      params: { orderId: order.id },
    });
  };
  
  // Format date
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString();
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'processing':
        return colors.info;
      case 'shipped':
        return colors.primary;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.danger;
      default:
        return colors.darkGray;
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.background }]} 
      onPress={handlePress}
    >
      <View style={styles.header}>
        <Text style={[styles.orderId, { color: colors.text }]}>
          Order #{order.id.substring(order.id.length - 6)}
        </Text>
        <Text style={[styles.date, { color: colors.darkGray }]}>
          {formattedDate}
        </Text>
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.itemsContainer}>
          <Text style={[styles.itemCount, { color: colors.text }]}>
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </Text>
          <Text style={[styles.itemNames, { color: colors.darkGray }]} numberOfLines={1}>
            {order.items.map(item => item.product.name).join(', ')}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          <Text 
            style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(order.status) }
            ]}
          >
            {order.status.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.totalLabel, { color: colors.darkGray }]}>Total:</Text>
        <Text style={[styles.totalAmount, { color: colors.primary }]}>
          ${order.totalAmount.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemsContainer: {
    flex: 1,
  },
  itemCount: {
    fontSize: 14,
    marginBottom: 2,
  },
  itemNames: {
    fontSize: 12,
  },
  statusContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 14,
    marginRight: 5,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
