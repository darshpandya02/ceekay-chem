import React from 'react';
import axios from 'axios';
import { TextInput, Button, Alert } from 'react-native';
import { 
  View, 
  Text, 
  StyleSheet, 
  SectionList,
  ActivityIndicator, 
  RefreshControl,
  useColorScheme,
  FlatList
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { ProductCard } from '../../components/ProductCard';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '../types';
import { router } from 'expo-router';
import { GROQ_API_KEY } from '@env';

export default function HomeScreen() {
  const [query, setQuery] = React.useState('');
  const [aiResponse, setAiResponse] = React.useState('');
  const [loadingResponse, setLoadingResponse] = React.useState(false);
  const { 
    products, 
    promotedProducts, 
    isLoading, 
    error, 
    fetchProducts,
    user,
    addToCart 
  } = useAppContext();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [refreshing, setRefreshing] = React.useState(false);
  
  const handleSendToGroq = async () => {
    if (!query.trim()) {
      Alert.alert('Please enter a query.');
      return;
    }
  
    try {
      setLoadingResponse(true);
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192', // Or use 'llama3-70b-8192' if needed
          messages: [
            { role: 'system', content: 'You are a ai sales agent for an chemical wholesaler company - Ceekay Enterprise. The company sells the following products - 2 2 Dichlorodiethyl Ether (DCEE), Sodium Sulphide Yellow Flakes 60% 30ppm, Potassium Bicarbonate, Phosphoric Acid, Ammonium Chloride. Give responses to the client queries accordingly.' },
            { role: 'user', content: query }
          ],
          temperature: 0.7,
          max_tokens: 200
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
        }
      );
  
      setAiResponse(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error('Groq API error:', error);
      Alert.alert('Error getting response from Groq');
    } finally {
      setLoadingResponse(false);
    }
  };
  

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    router.navigate({
    pathname: '/cart',});
  };
  
  // Create sections for SectionList
  const sections = React.useMemo(() => {
    const categoryMap: Record<string, Product[]> = {};
    console.log("the fetched products",products)
    products.forEach(product => {
      if (!categoryMap[product.category]) {
        categoryMap[product.category] = [];
      }
      categoryMap[product.category].push(product);
    });
    
    const sectionsArray = Object.entries(categoryMap).map(([category, products]) => ({
      title: category,
      data: products,
      horizontal: false
    }));
    
    // Add promotions section at the beginning if available
    if (promotedProducts.length > 0) {
      sectionsArray.unshift({
        title: "Special Promotions",
        data: promotedProducts,
        horizontal: true
      });
    }
    
    return sectionsArray;
  }, [products, promotedProducts]);
  
  if (isLoading && !refreshing) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // ListHeaderComponent={
        //   <View style={styles.headerContainer}>
        //     <Text style={[styles.welcomeText, { color: colors.text }]}>
        //       Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}!
        //     </Text>
        //     <Text style={[styles.subtitleText, { color: colors.darkGray }]}>
        //       Find the best fertilizers for your crops
        //     </Text>
        //   </View>
        // }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={[styles.welcomeText, { color: colors.text }]}>
              Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}!
            </Text>
            <Text style={[styles.subtitleText, { color: colors.darkGray }]}>
              Find the best fertilizers for your crops
            </Text>

            <TextInput
              placeholder="Ask a question (e.g. Best fertilizer for tomatoes)"
              value={query}
              onChangeText={setQuery}
              style={{
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 10,
                marginVertical: 10,
                borderWidth: 1,
                borderColor: '#ccc',
              }}
              multiline
            />
            <Button title="Get AI Recommendation" onPress={handleSendToGroq} disabled={loadingResponse} />
            {loadingResponse && <ActivityIndicator style={{ marginTop: 10 }} />}
            {aiResponse ? (
              <View style={{ marginTop: 15 }}>
                <Text style={{ fontWeight: 'bold', color: colors.text }}>AI Suggestion:</Text>
                <Text style={{ color: colors.text }}>{aiResponse}</Text>
              </View>
            ) : null}
          </View>
        }
        renderSectionHeader={({ section }) => {
            if (section.horizontal) {
              return (
                <View>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {section.title}
                  </Text>
                    <FlatList
                    horizontal
                    data={section.data}
                    keyExtractor={(item: Product) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 15, paddingBottom: 10 }}
                    renderItem={({ item }: { item: Product }) => (
                      <View style={styles.horizontalItem}>
                        <ProductCard 
                          product={item} 
                          onAddToCart={() => handleAddToCart(item)} 
                        />
                      </View>
                    )}
                  />
                </View>
              );
            }
              // Default section title for vertical sections
          return (
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
          );
        }}

        renderItem={({ item, section }) => {
          if (section.horizontal) return null; // Rendered separately
          return (
            <View style={styles.verticalItem}>
              <ProductCard 
                product={item} 
                onAddToCart={() => handleAddToCart(item)}
              />
            </View>
          );
        }}
        renderSectionFooter={() => <View style={styles.sectionSeparator} />}
        SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  headerContainer: {
    padding: 15,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  horizontalItem: {
    width: 220,
    marginHorizontal: 8,
  },
  verticalItem: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionSeparator: {
    height: 10,
  }
});