// src/navigation/stacks/STTStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { STTStackParamList } from '../../types/navigation';
import { theme } from '../../constants/theme';

// Screens
import STTHomeScreen from '../../screens/stt/STTHomeScreen';
import STTSearchScreen from '../../screens/stt/STTSearchScreen';
import STTScannerScreen from '../../screens/stt/STTScannerScreen';
import STTDetailsScreen from '../../screens/stt/STTDetailsScreen';
import CreateSTTScreen from '../../screens/stt/CreateSTTScreen';

const Stack = createStackNavigator<STTStackParamList>();

export const STTStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="STTHome"
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
        name="STTHome"
        component={STTHomeScreen}
        options={{
          title: 'Surat Tanda Terima',
        }}
      />
      <Stack.Screen
        name="STTSearch"
        component={STTSearchScreen}
        options={{
          title: 'Cari STT',
        }}
      />
      <Stack.Screen
        name="STTScanner"
        component={STTScannerScreen}
        options={{
          title: 'Scan Barcode STT',
        }}
      />
      <Stack.Screen
        name="STTDetails"
        component={STTDetailsScreen}
        options={{
          title: 'Detail STT',
        }}
      />
      <Stack.Screen
        name="CreateSTT"
        component={CreateSTTScreen}
        options={{
          title: 'Buat STT Baru',
        }}
      />
    </Stack.Navigator>
  );
};