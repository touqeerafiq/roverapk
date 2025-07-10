import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Text, Button, FAB, Portal, Dialog, ActivityIndicator } from 'react-native-paper';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';

import { theme } from '../../utils/theme';
import { updateWalkDetails } from '../../store/slices/bookingsSlice';
import { RootState } from '../../store';

// Mock location data for demonstration
const mockLocations = [
  { latitude: 37.78825, longitude: -122.4324, timestamp: new Date().toISOString() },
  { latitude: 37.78845, longitude: -122.4334, timestamp: new Date().toISOString() },
  { latitude: 37.78865, longitude: -122.4344, timestamp: new Date().toISOString() },
  { latitude: 37.78885, longitude: -122.4354, timestamp: new Date().toISOString() },
  { latitude: 37.78905, longitude: -122.4364, timestamp: new Date().toISOString() },
];

const WalkTrackingScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingId } = route.params || {};
  
  const mapRef = useRef(null);
  const [isTracking, setIsTracking] = useState(false);
  const [walkPath, setWalkPath] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [walkDistance, setWalkDistance] = useState(0);
  const [walkDuration, setWalkDuration] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // In a real app, we would get the booking from the Redux store
  const booking = useSelector((state: RootState) => 
    state.bookings.bookings.find(b => b.id === bookingId)
  );
  
  // Mock location tracking
  useEffect(() => {
    let interval;
    let locationIndex = 0;
    
    if (isTracking) {
      interval = setInterval(() => {
        if (locationIndex < mockLocations.length) {
          const newLocation = mockLocations[locationIndex];
          
          setCurrentLocation(newLocation);
          setWalkPath(prevPath => [...prevPath, newLocation]);
          
          // Calculate distance (simplified)
          if (locationIndex > 0) {
            const prevLocation = mockLocations[locationIndex - 1];
            const segmentDistance = calculateDistance(
              prevLocation.latitude,
              prevLocation.longitude,
              newLocation.latitude,
              newLocation.longitude
            );
            setWalkDistance(prevDistance => prevDistance + segmentDistance);
          }
          
          locationIndex++;
        } else {
          clearInterval(interval);
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);
  
  // Update duration while tracking
  useEffect(() => {
    let interval;
    
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setWalkDuration(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);
  
  const startWalk = () => {
    setIsTracking(true);
    setStartTime(Date.now());
    setWalkPath([]);
    setWalkDistance(0);
    setWalkDuration(0);
    
    // Set initial location
    setCurrentLocation(mockLocations[0]);
    setWalkPath([mockLocations[0]]);
  };
  
  const stopWalk = () => {
    setDialogVisible(true);
  };
  
  const confirmEndWalk = async () => {
    setLoading(true);
    setDialogVisible(false);
    
    try {
      // In a real app, this would save to the backend
      const walkDetails = {
        distance: walkDistance,
        duration: walkDuration,
        path: walkPath,
      };
      
      // Update Redux store
      dispatch(updateWalkDetails({
        bookingId,
        walkDetails,
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsTracking(false);
      Alert.alert('Success', 'Walk completed successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save walk data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const cancelEndWalk = () => {
    setDialogVisible(false);
  };
  
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${remainingSeconds}s`;
  };
  
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Simplified distance calculation (Haversine formula)
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    
    return distance;
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };
  
  return (
    <View style={styles.container}>
      {currentLocation ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          region={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation
          followsUserLocation
        >
          {walkPath.length > 0 && (
            <Polyline
              coordinates={walkPath}
              strokeWidth={4}
              strokeColor={theme.colors.primary}
            />
          )}
          
          {walkPath.length > 0 && (
            <Marker
              coordinate={walkPath[0]}
              title="Start"
              pinColor="green"
            />
          )}
          
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Current"
            >
              <View style={styles.currentLocationMarker}>
                <Icon name="map-marker" size={30} color={theme.colors.primary} />
              </View>
            </Marker>
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="map-marker-distance" size={24} color={theme.colors.primary} />
          <Text style={styles.statValue}>{walkDistance.toFixed(2)} km</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Icon name="clock-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.statValue}>{formatDuration(walkDuration)}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
      </View>
      
      <FAB
        style={[
          styles.fab,
          isTracking ? styles.stopFab : styles.startFab,
        ]}
        icon={isTracking ? 'stop' : 'play'}
        label={isTracking ? 'End Walk' : 'Start Walk'}
        onPress={isTracking ? stopWalk : startWalk}
      />
      
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={cancelEndWalk}>
          <Dialog.Title>End Walk</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to end this walk?</Text>
            <Text style={styles.dialogStats}>
              Distance: {walkDistance.toFixed(2)} km
            </Text>
            <Text style={styles.dialogStats}>
              Duration: {formatDuration(walkDuration)}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelEndWalk}>Cancel</Button>
            <Button onPress={confirmEndWalk} loading={loading}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  statsContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  startFab: {
    backgroundColor: theme.colors.primary,
  },
  stopFab: {
    backgroundColor: theme.colors.error,
  },
  currentLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogStats: {
    marginTop: 10,
    fontSize: 14,
  },
});

export default WalkTrackingScreen;