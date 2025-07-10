import React, {createContext, useContext, useEffect, useState} from 'react';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {RootState, AppDispatch} from '../store';
import {
  setCurrentLocation,
  setLocationPermission,
  setLocationError,
} from '../store/slices/locationSlice';
import {STORAGE_KEYS} from '../config/constants';

// Define location type
interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
}

// Define context type
interface LocationContextType {
  currentLocation: Location | null;
  hasPermission: boolean;
  error: string | null;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Location | null>;
  startTracking: () => void;
  stopTracking: () => void;
  isTracking: boolean;
}

// Create context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Location provider component
export const LocationProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {currentLocation, hasPermission, error} = useSelector(
    (state: RootState) => state.location
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Request location permission
  const requestPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'ios') {
        const status = await Geolocation.requestAuthorization('whenInUse');
        const hasPermission = status === 'granted';
        dispatch(setLocationPermission(hasPermission));
        return hasPermission;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Rover needs access to your location to find nearby services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        dispatch(setLocationPermission(hasPermission));
        return hasPermission;
      }
    } catch (err: any) {
      dispatch(setLocationError(err.message));
      return false;
    }
  };

  // Get current location
  const getCurrentLocation = async (): Promise<Location | null> => {
    setIsLoading(true);
    
    try {
      // Check permission
      if (!hasPermission) {
        const permissionGranted = await requestPermission();
        if (!permissionGranted) {
          setIsLoading(false);
          return null;
        }
      }
      
      // Get location
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              heading: position.coords.heading,
              speed: position.coords.speed,
              timestamp: position.timestamp,
            };
            
            // Save to Redux
            dispatch(setCurrentLocation(location));
            
            // Save to AsyncStorage
            AsyncStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify(location));
            
            setIsLoading(false);
            resolve(location);
          },
          (error) => {
            dispatch(setLocationError(error.message));
            setIsLoading(false);
            reject(error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
      });
    } catch (err: any) {
      dispatch(setLocationError(err.message));
      setIsLoading(false);
      return null;
    }
  };

  // Start location tracking
  const startTracking = async () => {
    // Check permission
    if (!hasPermission) {
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to track your walk.',
          [{text: 'OK'}]
        );
        return;
      }
    }
    
    // Start watching position
    const id = Geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        };
        
        // Save to Redux
        dispatch(setCurrentLocation(location));
      },
      (error) => {
        dispatch(setLocationError(error.message));
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // minimum distance (meters) between updates
        interval: 5000, // minimum time (milliseconds) between updates
        fastestInterval: 2000, // fastest rate app can handle updates
      }
    );
    
    setWatchId(id);
    setIsTracking(true);
  };

  // Stop location tracking
  const stopTracking = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  };

  // Load last known location on mount
  useEffect(() => {
    const loadLastLocation = async () => {
      try {
        const locationJson = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
        if (locationJson) {
          const location = JSON.parse(locationJson);
          dispatch(setCurrentLocation(location));
        }
      } catch (err) {
        console.log('Error loading last location:', err);
      }
    };
    
    loadLastLocation();
    
    // Check permission on mount
    requestPermission();
    
    // Cleanup
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [dispatch]);

  // Context value
  const value = {
    currentLocation,
    hasPermission,
    error,
    isLoading,
    requestPermission,
    getCurrentLocation,
    startTracking,
    stopTracking,
    isTracking,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

// Custom hook to use location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};