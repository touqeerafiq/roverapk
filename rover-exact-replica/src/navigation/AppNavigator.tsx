import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector, useDispatch} from 'react-redux';
import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import {RootState} from '../store';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import DeepLinkHandler from '../components/DeepLinkHandler';
import {setNotification} from '../store/slices/notificationsSlice';
import {STORAGE_KEYS} from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the stack navigator
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const {isAuthenticated, isLoading} = useSelector((state: RootState) => state.auth);
  const {onboardingCompleted} = useSelector((state: RootState) => state.app);

  // Handle incoming notifications
  useEffect(() => {
    // Handle notifications when app is in foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        dispatch(setNotification(remoteMessage));
      }
    });

    // Check for initial notification (app opened from a notification)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          dispatch(setNotification(remoteMessage));
        }
      });

    return unsubscribe;
  }, [dispatch]);

  // Check if onboarding is completed
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
        if (value !== null) {
          // We have data!!
          console.log('Onboarding status:', value);
        }
      } catch (error) {
        // Error retrieving data
        console.log('Error checking onboarding status:', error);
      }
    };

    checkOnboarding();
  }, []);

  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          // Auth flow
          !onboardingCompleted ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )
        ) : (
          // Main app flow
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
      
      {/* Handle deep links */}
      <DeepLinkHandler />
    </>
  );
};

export default AppNavigator;