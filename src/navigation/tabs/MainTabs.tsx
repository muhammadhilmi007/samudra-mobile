// src/navigation/tabs/MainTabs.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootState } from '../../store';
import { MainTabsParamList } from '../../types/navigation';
import { theme } from '../../constants/theme';

// Stacks
import { DashboardStack } from '../stacks/DashboardStack';
import { PickupStack } from '../stacks/PickupStack';
import { STTStack } from '../stacks/STTStack';
import { WarehouseStack } from '../stacks/WarehouseStack';
import { DeliveryStack } from '../stacks/DeliveryStack';
import { CheckerStack } from '../stacks/CheckerStack';

const Tab = createMaterialBottomTabNavigator<MainTabsParamList>();

export const MainTabs: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Define access based on user role
  const hasPickupAccess = user?.role?.permissions?.includes('pickup:access');
  const hasWarehouseAccess = user?.role?.permissions?.includes('warehouse:access');
  const hasDeliveryAccess = user?.role?.permissions?.includes('delivery:access');
  const hasCheckerAccess = user?.role?.permissions?.includes('checker:access');
  
  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      shifting={true}
      sceneAnimationEnabled={false}
      activeColor={theme.colors.surface}
      inactiveColor={theme.colors.background}
      barStyle={{ backgroundColor: theme.colors.primary }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={24} />
          ),
        }}
      />
      
      {hasPickupAccess && (
        <Tab.Screen
          name="PickupTab"
          component={PickupStack}
          options={{
            tabBarLabel: 'Pickup',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="truck-delivery" color={color} size={24} />
            ),
          }}
        />
      )}
      
      <Tab.Screen
        name="STTTab"
        component={STTStack}
        options={{
          tabBarLabel: 'STT',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="file-document" color={color} size={24} />
          ),
        }}
      />
      
      {hasWarehouseAccess && (
        <Tab.Screen
          name="WarehouseTab"
          component={WarehouseStack}
          options={{
            tabBarLabel: 'Gudang',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="warehouse" color={color} size={24} />
            ),
          }}
        />
      )}
      
      {hasDeliveryAccess && (
        <Tab.Screen
          name="DeliveryTab"
          component={DeliveryStack}
          options={{
            tabBarLabel: 'Delivery',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="truck-fast" color={color} size={24} />
            ),
          }}
        />
      )}
      
      {hasCheckerAccess && (
        <Tab.Screen
          name="CheckerTab"
          component={CheckerStack}
          options={{
            tabBarLabel: 'Checker',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="checkbox-marked-circle" color={color} size={24} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};