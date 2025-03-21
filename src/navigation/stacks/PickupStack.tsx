// src/navigation/stacks/PickupStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PickupStackParamList } from '../../types/navigation';
import { theme } from '../../constants/theme';

// Screens
import PickupHomeScreen from '../../screens/pickup/PickupHomeScreen';
import PickupRequestsScreen from '../../screens/pickup/PickupRequestsScreen';
import PickupRequestDetailsScreen from '../../screens/pickup/PickupRequestDetailsScreen';
import CreatePickupScreen from '../../screens/pickup/CreatePickupScreen';
import PickupDetailsScreen from '../../screens/pickup/PickupDetailsScreen';
import CompletePickupScreen from '../../screens/pickup/CompletePickupScreen';

const Stack = createStackNavigator<PickupStackParamList>();

export const PickupStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="PickupHome"
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
        name="PickupHome"
        component={PickupHomeScreen}
        options={{
          title: 'Pengambilan Barang',
        }}
      />
      <Stack.Screen
        name="PickupRequests"
        component={PickupRequestsScreen}
        options={{
          title: 'Permintaan Pengambilan',
        }}
      />
      <Stack.Screen
        name="PickupRequestDetails"
        component={PickupRequestDetailsScreen}
        options={{
          title: 'Detail Permintaan',
        }}
      />
      <Stack.Screen
        name="CreatePickup"
        component={CreatePickupScreen}
        options={{
          title: 'Buat Pengambilan',
        }}
      />
      <Stack.Screen
        name="PickupDetails"
        component={PickupDetailsScreen}
        options={{
          title: 'Detail Pengambilan',
        }}
      />
      <Stack.Screen
        name="CompletePickup"
        component={CompletePickupScreen}
        options={{
          title: 'Selesaikan Pengambilan',
        }}
      />
    </Stack.Navigator>
  );
};