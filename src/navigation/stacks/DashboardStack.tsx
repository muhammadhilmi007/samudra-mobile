// src/navigation/stacks/DashboardStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DashboardStackParamList } from '../../types/navigation';
import { theme } from '../../constants/theme';

// Screens
import DashboardScreen from '../../screens/dashboard/DashboardScreen';
import ProfileScreen from '../../screens/dashboard/ProfileScreen';
import SettingsScreen from '../../screens/dashboard/SettingsScreen';

const Stack = createStackNavigator<DashboardStackParamList>();

export const DashboardStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil Saya',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Pengaturan',
        }}
      />
    </Stack.Navigator>
  );
};