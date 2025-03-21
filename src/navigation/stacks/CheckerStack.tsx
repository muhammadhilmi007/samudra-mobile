// src/navigation/stacks/CheckerStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CheckerStackParamList } from '../../types/navigation';
import { theme } from '../../constants/theme';

// Screens
import CheckerHomeScreen from '../../screens/checker/CheckerHomeScreen';
import CheckerSTTScannerScreen from '../../screens/checker/CheckerSTTScannerScreen';
import CheckerPickupAssignScreen from '../../screens/checker/CheckerPickupAssignScreen';
import CheckerLoadingAssignScreen from '../../screens/checker/CheckerLoadingAssignScreen';
import CheckerDeliveryAssignScreen from '../../screens/checker/CheckerDeliveryAssignScreen';

const Stack = createStackNavigator<CheckerStackParamList>();

export const CheckerStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="CheckerHome"
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
        name="CheckerHome"
        component={CheckerHomeScreen}
        options={{
          title: 'Checker Panel',
        }}
      />
      <Stack.Screen
        name="CheckerSTTScanner"
        component={CheckerSTTScannerScreen}
        options={{
          title: 'Scan STT',
        }}
      />
      <Stack.Screen
        name="CheckerPickupAssign"
        component={CheckerPickupAssignScreen}
        options={{
          title: 'Penugasan Pengambilan',
        }}
      />
      <Stack.Screen
        name="CheckerLoadingAssign"
        component={CheckerLoadingAssignScreen}
        options={{
          title: 'Penugasan Muat',
        }}
      />
      <Stack.Screen
        name="CheckerDeliveryAssign"
        component={CheckerDeliveryAssignScreen}
        options={{
          title: 'Penugasan Pengiriman',
        }}
      />
    </Stack.Navigator>
  );
};