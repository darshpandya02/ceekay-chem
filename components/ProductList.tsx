import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { Product } from '../app/types';
import { ProductCard } from './ProductCard';
import { useAppContext } from '../app/context/AppContext';

interface ProductListProps {
  products: Product[];
  title?: string;
  horizontal?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  title,
  horizontal = false 
}) => {
  const { addToCart } = useAppContext();
  
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };
  
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <FlatList
        data={products}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={horizontal ? styles.horizontalItem : styles.verticalItem}>
            <ProductCard 
              product={item} 
              onAddToCart={() => handleAddToCart(item)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  horizontalItem: {
    width: 220,
    marginHorizontal: 8,
  },
  verticalItem: {
    paddingHorizontal: 15,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#888',
  },
});