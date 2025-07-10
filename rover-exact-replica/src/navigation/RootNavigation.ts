import {createRef} from 'react';
import {
  NavigationContainerRef,
  StackActions,
  CommonActions,
} from '@react-navigation/native';

// Create a navigation reference that can be used outside of components
export const navigationRef = createRef<NavigationContainerRef<any>>();

// Navigate to a specific screen
export function navigate(name: string, params?: object) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}

// Push a new route onto the stack
export function push(name: string, params?: object) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.push(name, params));
  }
}

// Replace the current screen
export function replace(name: string, params?: object) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.replace(name, params));
  }
}

// Go back to the previous screen
export function goBack() {
  if (navigationRef.current) {
    navigationRef.current.goBack();
  }
}

// Reset the navigation state
export function reset(routes: {name: string; params?: object}[], index = 0) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    );
  }
}

// Get the current route name
export function getCurrentRoute() {
  if (navigationRef.current) {
    return navigationRef.current.getCurrentRoute()?.name;
  }
  return null;
}

// Get the current route params
export function getCurrentParams() {
  if (navigationRef.current) {
    return navigationRef.current.getCurrentRoute()?.params;
  }
  return null;
}