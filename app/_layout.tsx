import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from './context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetail" options={{ title: 'Product Details' }} />
        <Stack.Screen name="OrderDetail" options={{ title: 'Order Details' }} />
        <Stack.Screen name="Checkout" options={{ title: 'Checkout' }} />
      </Stack>
    </AppProvider>
  );
}