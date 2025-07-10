import React, {useEffect} from 'react';
import {LogBox, StatusBar, Platform, UIManager} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as ReduxProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StripeProvider} from '@stripe/stripe-react-native';
import messaging from '@react-native-firebase/messaging';

import {store, persistor} from './src/store';
import {theme} from './src/styles/theme';
import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/contexts/AuthContext';
import {NotificationProvider} from './src/contexts/NotificationContext';
import {LocationProvider} from './src/contexts/LocationContext';
import {STRIPE_PUBLISHABLE_KEY} from './src/config/constants';
import {navigationRef} from './src/navigation/RootNavigation';
import {setupNotifications} from './src/services/notificationService';

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  'Animated: `useNativeDriver`',
]);

// Enable layout animations for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  useEffect(() => {
    // Hide splash screen after app is ready
    SplashScreen.hide();
    
    // Request notification permissions
    setupNotifications();
    
    // Set up background message handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message received:', remoteMessage);
      // Handle foreground notifications
    });
    
    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={theme}>
            <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
              <SafeAreaProvider>
                <AuthProvider>
                  <LocationProvider>
                    <NotificationProvider>
                      <NavigationContainer ref={navigationRef}>
                        <StatusBar
                          barStyle="dark-content"
                          backgroundColor={theme.colors.background}
                        />
                        <AppNavigator />
                      </NavigationContainer>
                    </NotificationProvider>
                  </LocationProvider>
                </AuthProvider>
              </SafeAreaProvider>
            </StripeProvider>
          </PaperProvider>
        </PersistGate>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
};

export default App;