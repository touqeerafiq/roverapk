import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, IconButton, ActivityIndicator, FAB} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {launchCamera} from 'react-native-image-picker';
import BackgroundTimer from 'react-native-background-timer';

import {MainStackParamList} from '../../navigation/MainNavigator';
import {useLocation} from '../../contexts/LocationContext';
import {theme, commonStyles} from '../../styles/theme';
import {api} from '../../api/client';

// Define route params
type WalkTrackingScreenRouteProp = RouteProp<MainStackParamList, 'WalkTracking'>;

// Walk tracking screen component
const WalkTrackingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<WalkTrackingScreenRouteProp>();
  const {bookingId} = route.params;
  const {
    currentLocation,
    hasPermission,
    requestPermission,
    startTracking,
    stopTracking,
    isTracking,
  } = useLocation();
  
  const mapRef = useRef<MapView>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [walkStarted, setWalkStarted] = useState(false);
  const [walkId, setWalkId] = useState<string | null>(null);
  const [walkPath, setWalkPath] = useState<any[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [booking, setBooking] = useState<any>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  
  // Fetch booking details on mount
  useEffect(() => {
    fetchBookingDetails();
    
    // Request location permission if not granted
    if (!hasPermission) {
      requestPermission();
    }
    
    // Cleanup on unmount
    return () => {
      if (timerInterval !== null) {
        BackgroundTimer.clearInterval(timerInterval);
      }
      stopTracking();
    };
  }, []);
  
  // Update walk path when location changes
  useEffect(() => {
    if (walkStarted && !isPaused && currentLocation) {
      // Add location to path
      const newLocation = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        timestamp: new Date().toISOString(),
      };
      
      setWalkPath((prevPath) => {
        const newPath = [...prevPath, newLocation];
        
        // Calculate distance
        if (prevPath.length > 0) {
          const lastLocation = prevPath[prevPath.length - 1];
          const segmentDistance = calculateDistance(
            lastLocation.latitude,
            lastLocation.longitude,
            newLocation.latitude,
            newLocation.longitude
          );
          setDistance((prevDistance) => prevDistance + segmentDistance);
        }
        
        return newPath;
      });
      
      // Update walk path on server
      if (walkId) {
        updateWalkPath();
      }
      
      // Center map on current location
      centerMapOnLocation();
    }
  }, [currentLocation, walkStarted, isPaused]);
  
  // Fetch booking details
  const fetchBookingDetails = async () => {
    setIsLoading(true);
    try {
      // Mock data for now
      const mockBooking = {
        id: bookingId,
        service: 'dog_walking',
        status: 'confirmed',
        date: new Date(),
        startTime: '14:00',
        endTime: '15:00',
        duration: 60, // minutes
        notes: 'Please make sure to bring water for Max.',
        provider: {
          id: '1',
          name: 'Sarah Johnson',
          photo: 'https://randomuser.me/api/portraits/women/44.jpg',
          phone: '(555) 123-4567',
        },
        pet: {
          id: '201',
          name: 'Max',
          breed: 'Golden Retriever',
          age: 3,
          photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
        },
        owner: {
          id: '101',
          name: 'John Smith',
          phone: '(555) 987-6543',
          address: '123 Main St, Anytown, USA',
        },
      };
      
      setBooking(mockBooking);
      
      // In a real app, we would fetch from API:
      // const response = await api.getBooking(bookingId);
      // setBooking(response.data);
    } catch (error) {
      console.log('Error fetching booking details:', error);
      Alert.alert('Error', 'Failed to load booking details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Start walk
  const startWalk = async () => {
    try {
      // Check location permission
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
      
      // Start location tracking
      startTracking();
      
      // Start timer
      const interval = BackgroundTimer.setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
      
      setTimerInterval(interval);
      
      // Set start time
      const now = new Date();
      setStartTime(now);
      
      // Set initial location
      if (currentLocation) {
        const initialLocation = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          timestamp: now.toISOString(),
        };
        setWalkPath([initialLocation]);
      }
      
      // Start walk on server
      // In a real app, we would call API:
      // const response = await api.startWalk(bookingId);
      // setWalkId(response.data.walkId);
      
      // Mock walk ID for now
      setWalkId('w-' + Date.now().toString());
      
      setWalkStarted(true);
      
      // Center map on current location
      centerMapOnLocation();
    } catch (error) {
      console.log('Error starting walk:', error);
      Alert.alert('Error', 'Failed to start walk. Please try again.');
    }
  };
  
  // Pause walk
  const pauseWalk = () => {
    setIsPaused(true);
    
    // Pause timer
    if (timerInterval !== null) {
      BackgroundTimer.clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };
  
  // Resume walk
  const resumeWalk = () => {
    setIsPaused(false);
    
    // Resume timer
    const interval = BackgroundTimer.setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  // End walk
  const endWalk = async () => {
    try {
      // Confirm end walk
      Alert.alert(
        'End Walk',
        'Are you sure you want to end this walk?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'End Walk',
            onPress: async () => {
              // Stop location tracking
              stopTracking();
              
              // Stop timer
              if (timerInterval !== null) {
                BackgroundTimer.clearInterval(timerInterval);
                setTimerInterval(null);
              }
              
              // End walk on server
              // In a real app, we would call API:
              // const response = await api.endWalk(walkId, {
              //   endTime: new Date().toISOString(),
              //   distance,
              //   duration: elapsedTime,
              //   path: walkPath,
              //   photos,
              // });
              
              // Navigate to walk summary
              navigation.replace('WalkSummary', {
                walkId: walkId || 'w-' + Date.now().toString(),
              });
            },
          },
        ]
      );
    } catch (error) {
      console.log('Error ending walk:', error);
      Alert.alert('Error', 'Failed to end walk. Please try again.');
    }
  };
  
  // Take photo
  const takePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
      });
      
      if (result.assets && result.assets.length > 0) {
        const photo = result.assets[0];
        
        // Add location and timestamp to photo
        const photoWithMetadata = {
          ...photo,
          location: currentLocation,
          timestamp: new Date().toISOString(),
        };
        
        // Add to photos array
        setPhotos((prevPhotos) => [...prevPhotos, photoWithMetadata]);
        
        // In a real app, we would upload to server:
        // await api.uploadWalkPhoto(walkId, photoWithMetadata);
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };
  
  // Update walk path on server
  const updateWalkPath = async () => {
    try {
      // In a real app, we would call API:
      // await api.updateWalkPath(walkId, walkPath);
    } catch (error) {
      console.log('Error updating walk path:', error);
    }
  };
  
  // Center map on current location
  const centerMapOnLocation = () => {
    if (mapRef.current && currentLocation) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };
  
  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };
  
  // Convert degrees to radians
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };
  
  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  };
  
  // Format distance in kilometers
  const formatDistance = (km: number) => {
    if (km < 0.1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(2)} km`;
  };
  
  // Show photo modal
  const showPhoto = (photo: any) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton
          followsUserLocation
          initialRegion={{
            latitude: currentLocation?.latitude || 37.7749,
            longitude: currentLocation?.longitude || -122.4194,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {/* Walk Path */}
          {walkPath.length > 1 && (
            <Polyline
              coordinates={walkPath}
              strokeWidth={4}
              strokeColor={theme.colors.primary}
            />
          )}
          
          {/* Start Marker */}
          {walkPath.length > 0 && (
            <Marker
              coordinate={walkPath[0]}
              title="Start"
              pinColor={theme.colors.success}
            />
          )}
          
          {/* Photo Markers */}
          {photos.map((photo, index) => (
            <Marker
              key={index}
              coordinate={photo.location}
              title={`Photo ${index + 1}`}
              onPress={() => showPhoto(photo)}
            >
              <View style={styles.photoMarker}>
                <Icon name="camera" size={16} color={theme.colors.white} />
              </View>
            </Marker>
          ))}
        </MapView>
        
        {/* Center Button */}
        <TouchableOpacity
          style={styles.centerButton}
          onPress={centerMapOnLocation}
        >
          <Icon name="crosshairs-gps" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Walk Info Panel */}
      <View style={styles.infoPanel}>
        {/* Pet Info */}
        <View style={styles.petInfoContainer}>
          <Image
            source={{uri: booking?.pet.photo}}
            style={styles.petImage}
          />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{booking?.pet.name}</Text>
            <Text style={styles.petBreed}>{booking?.pet.breed}</Text>
          </View>
        </View>
        
        {/* Walk Stats */}
        <View style={styles.statsContainer}>
          {/* Time */}
          <View style={styles.statItem}>
            <Icon name="clock-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
          
          {/* Distance */}
          <View style={styles.statItem}>
            <Icon name="map-marker-distance" size={20} color={theme.colors.primary} />
            <Text style={styles.statValue}>{formatDistance(distance)}</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          
          {/* Photos */}
          <View style={styles.statItem}>
            <Icon name="camera-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.statValue}>{photos.length}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {!walkStarted ? (
            // Start Walk Button
            <Button
              mode="contained"
              onPress={startWalk}
              style={styles.startButton}
              contentStyle={styles.buttonContent}
              icon="play"
            >
              Start Walk
            </Button>
          ) : (
            // Walk Controls
            <View style={styles.walkControls}>
              {isPaused ? (
                // Resume Button
                <Button
                  mode="contained"
                  onPress={resumeWalk}
                  style={[styles.controlButton, styles.resumeButton]}
                  contentStyle={styles.buttonContent}
                  icon="play"
                >
                  Resume
                </Button>
              ) : (
                // Pause Button
                <Button
                  mode="contained"
                  onPress={pauseWalk}
                  style={[styles.controlButton, styles.pauseButton]}
                  contentStyle={styles.buttonContent}
                  icon="pause"
                >
                  Pause
                </Button>
              )}
              
              {/* End Walk Button */}
              <Button
                mode="contained"
                onPress={endWalk}
                style={[styles.controlButton, styles.endButton]}
                contentStyle={styles.buttonContent}
                icon="stop"
              >
                End Walk
              </Button>
            </View>
          )}
        </View>
      </View>
      
      {/* Camera FAB */}
      {walkStarted && !isPaused && (
        <FAB
          style={styles.cameraFab}
          icon="camera"
          color={theme.colors.white}
          onPress={takePhoto}
        />
      )}
      
      {/* Photo Modal */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowPhotoModal(false)}
              style={styles.closeButton}
            />
            
            {selectedPhoto && (
              <Image
                source={{uri: selectedPhoto.uri}}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
            
            {selectedPhoto && (
              <Text style={styles.photoTimestamp}>
                {new Date(selectedPhoto.timestamp).toLocaleTimeString()}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centerButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  infoPanel: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    ...commonStyles.shadow,
  },
  petInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  petInfo: {
    marginLeft: 12,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  petBreed: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  actionContainer: {
    marginBottom: 8,
  },
  startButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  walkControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    flex: 1,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  pauseButton: {
    backgroundColor: theme.colors.warning,
  },
  resumeButton: {
    backgroundColor: theme.colors.success,
  },
  endButton: {
    backgroundColor: theme.colors.error,
  },
  cameraFab: {
    position: 'absolute',
    bottom: 200,
    right: 16,
    backgroundColor: theme.colors.primary,
  },
  photoMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '70%',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  modalImage: {
    width: '100%',
    height: '90%',
    borderRadius: 8,
  },
  photoTimestamp: {
    textAlign: 'center',
    marginTop: 8,
    color: theme.colors.textSecondary,
  },
});

export default WalkTrackingScreen;