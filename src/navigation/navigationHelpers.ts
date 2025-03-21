// src/navigation/navigationHelpers.ts
import { navigationRef } from './navigationRef';

/**
 * Check if navigation is ready
 * @returns Whether the navigation container is ready
 */
export const isNavigationReady = (): boolean => {
  return navigationRef.current !== null;
};

/**
 * Navigate to a screen
 * @param name Name of the route
 * @param params Parameters to pass to the route
 */
export const navigate = (name: string, params?: object): void => {
  if (isNavigationReady()) {
    navigationRef.current?.navigate(name, params);
  } else {
    console.warn('Navigation attempted before navigation container was ready');
  }
};

/**
 * Reset the navigation stack and navigate to a route
 * @param routes Array of routes to set
 * @param index Index of the active route
 */
export const reset = (routes: { name: string; params?: object }[], index: number = 0): void => {
  if (isNavigationReady()) {
    navigationRef.current?.reset({ index, routes });
  } else {
    console.warn('Navigation reset attempted before navigation container was ready');
  }
};

/**
 * Go back to the previous screen
 */
export const goBack = (): void => {
  if (isNavigationReady() && navigationRef.current?.canGoBack()) {
    navigationRef.current?.goBack();
  } else {
    console.warn('Cannot go back or navigation container is not ready');
  }
};

/**
 * Navigate to a nested stack screen
 * @param stack Stack name
 * @param screen Screen name within the stack
 * @param params Parameters to pass to the screen
 */
export const navigateToStack = (stack: string, screen: string, params?: object): void => {
  if (isNavigationReady()) {
    navigationRef.current?.navigate(stack, { screen, params });
  } else {
    console.warn('Stack navigation attempted before navigation container was ready');
  }
};

/**
 * Navigate to the appropriate screen from a notification
 * This requires special handling to navigate through nested navigators
 * @param screenName Destination screen name
 * @param params Parameters to pass to the screen
 */
export const navigateFromNotification = (screenName: string, params: any): void => {
  if (!isNavigationReady()) {
    console.warn('Navigation from notification attempted before navigation container was ready');
    return;
  }

  // Map screen names to their parent stacks/tabs
  const screenToStackMap: Record<string, { tab: string; stack: string }> = {
    // Dashboard screens
    'Dashboard': { tab: 'DashboardTab', stack: 'Dashboard' },
    'Profile': { tab: 'DashboardTab', stack: 'Profile' },
    'Settings': { tab: 'DashboardTab', stack: 'Settings' },
    
    // STT screens
    'STTHome': { tab: 'STTTab', stack: 'STTHome' },
    'STTSearch': { tab: 'STTTab', stack: 'STTSearch' },
    'STTScanner': { tab: 'STTTab', stack: 'STTScanner' },
    'STTDetails': { tab: 'STTTab', stack: 'STTDetails' },
    'CreateSTT': { tab: 'STTTab', stack: 'CreateSTT' },
    
    // Pickup screens
    'PickupHome': { tab: 'PickupTab', stack: 'PickupHome' },
    'PickupRequests': { tab: 'PickupTab', stack: 'PickupRequests' },
    'PickupRequestDetails': { tab: 'PickupTab', stack: 'PickupRequestDetails' },
    'CreatePickup': { tab: 'PickupTab', stack: 'CreatePickup' },
    'PickupDetails': { tab: 'PickupTab', stack: 'PickupDetails' },
    'CompletePickup': { tab: 'PickupTab', stack: 'CompletePickup' },
    
    // Warehouse screens
    'WarehouseHome': { tab: 'WarehouseTab', stack: 'WarehouseHome' },
    'TruckQueues': { tab: 'WarehouseTab', stack: 'TruckQueues' },
    'CreateTruckQueue': { tab: 'WarehouseTab', stack: 'CreateTruckQueue' },
    'LoadingList': { tab: 'WarehouseTab', stack: 'LoadingList' },
    'CreateLoading': { tab: 'WarehouseTab', stack: 'CreateLoading' },
    'LoadingDetails': { tab: 'WarehouseTab', stack: 'LoadingDetails' },
    
    // Delivery screens
    'DeliveryHome': { tab: 'DeliveryTab', stack: 'DeliveryHome' },
    'DeliveryList': { tab: 'DeliveryTab', stack: 'DeliveryList' },
    'VehicleQueues': { tab: 'DeliveryTab', stack: 'VehicleQueues' },
    'CreateVehicleQueue': { tab: 'DeliveryTab', stack: 'CreateVehicleQueue' },
    'CreateDelivery': { tab: 'DeliveryTab', stack: 'CreateDelivery' },
    'DeliveryDetails': { tab: 'DeliveryTab', stack: 'DeliveryDetails' },
    'CompleteDelivery': { tab: 'DeliveryTab', stack: 'CompleteDelivery' },
    
    // Checker screens
    'CheckerHome': { tab: 'CheckerTab', stack: 'CheckerHome' },
    'CheckerSTTScanner': { tab: 'CheckerTab', stack: 'CheckerSTTScanner' },
    'CheckerPickupAssign': { tab: 'CheckerTab', stack: 'CheckerPickupAssign' },
    'CheckerLoadingAssign': { tab: 'CheckerTab', stack: 'CheckerLoadingAssign' },
    'CheckerDeliveryAssign': { tab: 'CheckerTab', stack: 'CheckerDeliveryAssign' },
  };
  
  // Find the mapping for the requested screen
  const screenMapping = screenToStackMap[screenName];
  
  if (screenMapping) {
    // Navigate to the tab first, then to the specific screen within the stack
    navigationRef.current?.navigate(screenMapping.tab, {
      screen: screenMapping.stack,
      params,
    });
  } else {
    // Fallback to direct navigation if mapping not found
    navigationRef.current?.navigate(screenName, params);
  }
};

/**
 * Navigate to the login screen
 */
export const navigateToLogin = (): void => {
  reset([{ name: 'Auth', params: { screen: 'Login' } }]);
};

/**
 * Navigate to the main app after login
 */
export const navigateToMainApp = (): void => {
  reset([{ name: 'MainTabs' }]);
};

/**
 * Create a deep link handler for the app
 * @param url Deep link URL
 * @returns Whether the deep link was handled
 */
export const handleDeepLink = (url: string): boolean => {
  if (!url || !isNavigationReady()) {
    return false;
  }
  
  // Parse the URL
  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
  
  if (pathSegments.length === 0) {
    return false;
  }
  
  // Handle different deep link patterns
  switch (pathSegments[0]) {
    case 'stt':
      if (pathSegments.length > 1) {
        // Example: samudra://stt/STT-123456
        navigateFromNotification('STTDetails', { id: pathSegments[1] });
        return true;
      }
      navigateFromNotification('STTHome', {});
      return true;
      
    case 'pickup':
      if (pathSegments.length > 1) {
        // Example: samudra://pickup/PU-123456
        navigateFromNotification('PickupDetails', { id: pathSegments[1] });
        return true;
      }
      navigateFromNotification('PickupHome', {});
      return true;
      
    case 'delivery':
      if (pathSegments.length > 1) {
        // Example: samudra://delivery/DEL-123456
        navigateFromNotification('DeliveryDetails', { id: pathSegments[1] });
        return true;
      }
      navigateFromNotification('DeliveryHome', {});
      return true;
      
    case 'warehouse':
      if (pathSegments.length > 1) {
        // Example: samudra://warehouse/loading/LOAD-123456
        if (pathSegments[1] === 'loading' && pathSegments.length > 2) {
          navigateFromNotification('LoadingDetails', { id: pathSegments[2] });
          return true;
        }
      }
      navigateFromNotification('WarehouseHome', {});
      return true;
      
    case 'scan':
      // Example: samudra://scan
      navigateFromNotification('STTScanner', {});
      return true;
      
    case 'profile':
      // Example: samudra://profile
      navigateFromNotification('Profile', {});
      return true;
      
    case 'settings':
      // Example: samudra://settings
      navigateFromNotification('Settings', {});
      return true;
      
    default:
      return false;
  }
};