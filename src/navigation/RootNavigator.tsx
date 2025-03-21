// src/navigation/RootNavigator.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from '../store';
import { RootStackParamList } from '../types/navigation';

// Stacks
import { AuthStack } from './stacks/AuthStack';
import { MainTabs } from './tabs/MainTabs';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  
  // Optional: If you want to show a splash screen while checking auth
  if (isLoading) {
    return null; // Or return a splash screen component
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
};