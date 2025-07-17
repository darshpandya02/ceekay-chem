import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Product } from '../app/types';
import Colors from '../constants/Colors';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const handlePress = () => {
    router.navigate({
    pathname: '/ProductDetail',
    params: { productId: product.id },
  });
  };
  
  // Calculate the discounted price if available
  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;
  
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.background }]} 
      onPress={handlePress}
    >
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      
      {product.isPromoted && (
        <View style={[styles.promotionBadge, { backgroundColor: colors.accent }]}>
          <Text style={styles.promotionText}>
            {product.discount}% OFF
          </Text>
        </View>
      )}
      
      <View style={styles.contentContainer}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        
        <Text style={[styles.category, { color: colors.darkGray }]}>
          {product.category}
        </Text>
        
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            {product.discount ? (
              <>
                <Text style={[styles.originalPrice, { color: colors.darkGray }]}>
                  ${product.price.toFixed(2)}
                </Text>
                <Text style={[styles.price, { color: colors.primary }]}>
                  ${finalPrice.toFixed(2)}
                </Text>
              </>
            ) : (
              <Text style={[styles.price, { color: colors.primary }]}>
                ${product.price.toFixed(2)}
              </Text>
            )}
            <Text style={[styles.unit, { color: colors.darkGray }]}>
              /{product.unit}
            </Text>
          </View>
          
          <View style={styles.stockContainer}>
            <Text 
              style={[
                styles.stockText, 
                { color: product.stock > 100 ? colors.success : colors.warning }
              ]}
            >
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>
        
        {onAddToCart && (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onAddToCart}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  unit: {
    fontSize: 12,
    marginLeft: 2,
  },
  stockContainer: {},
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  promotionBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  promotionText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
});