// src/navigation/stacks/WarehouseStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WarehouseStackParamList } from '../../types/navigation';
import { theme } from '../../constants/theme';

// Screens
import WarehouseHomeScreen from '../../screens/warehouse/WarehouseHomeScreen';
import TruckQueuesScreen from '../../screens/warehouse/TruckQueuesScreen';
import CreateTruckQueueScreen from '../../screens/warehouse/CreateTruckQueueScreen';
import LoadingListScreen from '../../screens/warehouse/LoadingListScreen';
import CreateLoadingScreen from '../../screens/warehouse/CreateLoadingScreen';
import LoadingDetailsScreen from '../../screens/warehouse/LoadingDetailsScreen';

const Stack = createStackNavigator<WarehouseStackParamList>();

export const WarehouseStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="WarehouseHome"
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
        name="WarehouseHome"
        component={WarehouseHomeScreen}
        options={{
          title: 'Gudang',
        }}
      />
      <Stack.Screen
        name="TruckQueues"
        component={TruckQueuesScreen}
        options={{
          title: 'Antrian Truck',
        }}
      />
      <Stack.Screen
        name="CreateTruckQueue"
        component={CreateTruckQueueScreen}
        options={{
          title: 'Tambah Antrian Truck',
        }}
      />
      <Stack.Screen
        name="LoadingList"
        component={LoadingListScreen}
        options={{
          title: 'Daftar Muat Barang',
        }}
      />
      <Stack.Screen
        name="CreateLoading"
        component={CreateLoadingScreen}
        options={{
          title: 'Buat Muat Barang',
        }}
      />
      <Stack.Screen
        name="LoadingDetails"
        component={LoadingDetailsScreen}
        options={{
          title: 'Detail Muat Barang',
        }}
      />
    </Stack.Navigator>
  );
};