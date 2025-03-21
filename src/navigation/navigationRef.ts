// src/navigation/navigationRef.ts
import { createRef } from 'react';
import { NavigationContainerRef, CommonActions } from '@react-navigation/native';

// Create a navigation reference that can be used outside of components
export const navigationRef = createRef<NavigationContainerRef<any>>();

// Navigation function that can be called from outside of React components
export function navigate(name: string, params?: object) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}

// Reset navigation stack and navigate to a route
export function reset(routes: { name: string; params?: object }[], index: number = 0) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index,
        routes,
      })
    );
  }
}

// Go back
export function goBack() {
  if (navigationRef.current) {
    navigationRef.current.goBack();
  }
}