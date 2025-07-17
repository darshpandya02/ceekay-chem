import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { useAppContext } from './context/AppContext';
import { Product } from './types';

interface ProductMap {
  [key: string]: Product;
}

// Define the route param types
type ProductDetailScreenRouteProp = RouteProp<{
  ProductDetail: { productId: string };
}, 'ProductDetail'>;

const ProductDetail = () => {
  const { products } = useAppContext();

  const PRODUCT_DATA: ProductMap = products.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {} as ProductMap);

  const route = useRoute<ProductDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { productId } = route.params;
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Find the product from the mock data
  const product = useMemo(() => {
    return products.find(p => p.id === productId);
  }, [productId]);

  // Calculate the discounted price if available
  const finalPrice = product?.discount 
    ? product.price * (1 - product.discount / 100) 
    : product?.price;

  // Handle the case where product is not found
  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Product not found
          </Text>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <Image source={{ uri: product.images[0] }} style={styles.image} />
        
        {product.isPromoted && (
          <View style={[styles.promotionBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.promotionText}>
              {product.discount}% OFF
            </Text>
          </View>
        )}
        
        <View style={styles.contentContainer}>
          <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
          <Text style={[styles.category, { color: colors.darkGray }]}>{product.category}</Text>
          
          <View style={styles.priceContainer}>
            {product.discount ? (
              <>
                <Text style={[styles.originalPrice, { color: colors.darkGray }]}>
                  ${product.price.toFixed(2)}
                </Text>
                <Text style={[styles.price, { color: colors.primary }]}>
                  ${finalPrice?.toFixed(2)}
                </Text>
              </>
            ) : (
              <Text style={[styles.price, { color: colors.primary }]}>
                ${product.price.toFixed(2)}
              </Text>
            )}
            <Text style={[styles.unit, { color: colors.darkGray }]}>/{product.unit}</Text>
          </View>
          
          <View style={styles.stockContainer}>
            <Text 
              style={[
                styles.stockText, 
                { 
                  color: product.stock > 100 
                    ? colors.success 
                    : product.stock > 0 
                      ? colors.warning 
                      : colors.danger 
                }
              ]}
            >
              {product.stock > 0 ? `In Stock (${product.stock} ${product.unit})` : 'Out of Stock'}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.text }]}>{product.description}</Text>
          
          <View style={styles.divider} />
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Specifications</Text>
          {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
            <View key={key} style={styles.specRow}>
              <Text style={[styles.specKey, { color: colors.darkGray }]}>{key}</Text>
              {/* <Text style={[styles.specValue, { color: colors.text }]}>{value}</Text> */}
            </View>
          ))}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => {
                // Add to cart functionality would go here
                alert(`Added ${product.name} to cart`);
              }}
            >
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  category: {
    fontSize: 14,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  unit: {
    fontSize: 14,
    marginLeft: 4,
  },
  stockContainer: {
    marginBottom: 16,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  specKey: {
    fontSize: 14,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  promotionBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  promotionText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ProductDetail;