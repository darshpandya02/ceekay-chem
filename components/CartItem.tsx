import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useAppContext } from '../app/context/AppContext';
import { CartItem as CartItemType } from '../app/types';
import Colors from '../constants/Colors';

interface CartItemProps {
  item: CartItemType;
}

export const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItemQuantity, removeFromCart } = useAppContext();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const handleIncrement = () => {
    updateCartItemQuantity(item.product.id, item.quantity + 1);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.product.id, item.quantity - 1);
    } else {
      removeFromCart(item.product.id);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.product.id);
  };
  
  // Calculate the item subtotal
  const subtotal = item.product.price * item.quantity;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: item.product.images[0] }} style={styles.image} />
      
      <View style={styles.detailsContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{item.product.name}</Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          ${item.product.price.toFixed(2)}/{item.product.unit}
        </Text>
        
        <View style={styles.actionsRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={[styles.quantityButton, { backgroundColor: colors.lightGray }]} 
              onPress={handleDecrement}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity 
              style={[styles.quantityButton, { backgroundColor: colors.lightGray }]} 
              onPress={handleIncrement}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={handleRemove}>
            <Text style={[styles.removeText, { color: colors.danger }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.subtotalContainer}>
        <Text style={[styles.subtotalLabel, { color: colors.darkGray }]}>Subtotal:</Text>
        <Text style={[styles.subtotalAmount, { color: colors.text }]}>
          ${subtotal.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
  removeText: {
    fontSize: 14,
  },
  subtotalContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingLeft: 10,
  },
  subtotalLabel: {
    fontSize: 12,
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
