// src/navigation/stacks/DeliveryStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DeliveryStackParamList } from '../../types/navigation';
import { theme } from '../../constants/theme';

// Screens
import DeliveryHomeScreen from '../../screens/delivery/DeliveryHomeScreen';
import DeliveryListScreen from '../../screens/delivery/DeliveryListScreen';
import VehicleQueuesScreen from '../../screens/delivery/VehicleQueuesScreen';
import CreateVehicleQueueScreen from '../../screens/delivery/CreateVehicleQueueScreen';
import CreateDeliveryScreen from '../../screens/delivery/CreateDeliveryScreen';
import DeliveryDetailsScreen from '../../screens/delivery/DeliveryDetailsScreen';
import CompleteDeliveryScreen from '../../screens/delivery/CompleteDeliveryScreen';

const Stack = createStackNavigator<DeliveryStackParamList>();

export const DeliveryStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="DeliveryHome"
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
        name="DeliveryHome"
        component={DeliveryHomeScreen}
        options={{
          title: 'Pengiriman Barang',
        }}
      />
      <Stack.Screen
        name="DeliveryList"
        component={DeliveryListScreen}
        options={{
          title: 'Daftar Pengiriman',
        }}
      />
      <Stack.Screen
        name="VehicleQueues"
        component={VehicleQueuesScreen}
        options={{
          title: 'Antrian Kendaraan',
        }}
      />
      <Stack.Screen
        name="CreateVehicleQueue"
        component={CreateVehicleQueueScreen}
        options={{
          title: 'Tambah Antrian Kendaraan',
        }}
      />
      <Stack.Screen
        name="CreateDelivery"
        component={CreateDeliveryScreen}
        options={{
          title: 'Buat Pengiriman',
        }}
      />
      <Stack.Screen
        name="DeliveryDetails"
        component={DeliveryDetailsScreen}
        options={{
          title: 'Detail Pengiriman',
        }}
      />
      <Stack.Screen
        name="CompleteDelivery"
        component={CompleteDeliveryScreen}
        options={{
          title: 'Selesaikan Pengiriman',
        }}
      />
    </Stack.Navigator>
  );
};