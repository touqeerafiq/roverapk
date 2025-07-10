import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Searchbar, Card, Button, ActivityIndicator, Chip} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import {MainStackParamList} from '../../navigation/MainNavigator';
import {useAuth} from '../../contexts/AuthContext';
import {useLocation} from '../../contexts/LocationContext';
import {theme, commonStyles} from '../../styles/theme';
import {SERVICE_TYPES} from '../../config/constants';
import {api} from '../../api/client';

// Home screen component
const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {user} = useAuth();
  const {currentLocation, getCurrentLocation} = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nearbyProviders, setNearbyProviders] = useState([]);
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [selectedService, setSelectedService] = useState(SERVICE_TYPES.DOG_WALKING);

  // Fetch data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch all data
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // Get current location if not available
      if (!currentLocation) {
        await getCurrentLocation();
      }
      
      // Fetch data in parallel
      await Promise.all([
        fetchNearbyProviders(),
        fetchFeaturedProviders(),
        fetchRecentBookings(),
      ]);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch nearby providers
  const fetchNearbyProviders = async () => {
    try {
      // Mock data for now
      const mockProviders = [
        {
          id: '1',
          name: 'Sarah Johnson',
          rating: 4.9,
          reviewCount: 127,
          photo: 'https://randomuser.me/api/portraits/women/44.jpg',
          distance: 0.8,
          price: 25,
          services: [SERVICE_TYPES.DOG_WALKING, SERVICE_TYPES.BOARDING],
          isFavorite: true,
        },
        {
          id: '2',
          name: 'Michael Chen',
          rating: 4.7,
          reviewCount: 89,
          photo: 'https://randomuser.me/api/portraits/men/32.jpg',
          distance: 1.2,
          price: 22,
          services: [SERVICE_TYPES.DOG_WALKING, SERVICE_TYPES.DROP_IN],
          isFavorite: false,
        },
        {
          id: '3',
          name: 'Jessica Williams',
          rating: 4.8,
          reviewCount: 103,
          photo: 'https://randomuser.me/api/portraits/women/68.jpg',
          distance: 1.5,
          price: 28,
          services: [SERVICE_TYPES.DOG_WALKING, SERVICE_TYPES.BOARDING, SERVICE_TYPES.HOUSE_SITTING],
          isFavorite: false,
        },
      ];
      
      setNearbyProviders(mockProviders);
      
      // In a real app, we would fetch from API:
      // const response = await api.getProviders({
      //   latitude: currentLocation?.latitude,
      //   longitude: currentLocation?.longitude,
      //   radius: 10,
      //   service: selectedService,
      // });
      // setNearbyProviders(response.data);
    } catch (error) {
      console.log('Error fetching nearby providers:', error);
    }
  };

  // Fetch featured providers
  const fetchFeaturedProviders = async () => {
    try {
      // Mock data for now
      const mockFeatured = [
        {
          id: '4',
          name: 'David Rodriguez',
          rating: 5.0,
          reviewCount: 215,
          photo: 'https://randomuser.me/api/portraits/men/67.jpg',
          distance: 2.3,
          price: 30,
          services: [SERVICE_TYPES.DOG_WALKING, SERVICE_TYPES.BOARDING, SERVICE_TYPES.DAY_CARE],
          isFavorite: true,
          featured: true,
        },
        {
          id: '5',
          name: 'Emily Parker',
          rating: 4.9,
          reviewCount: 178,
          photo: 'https://randomuser.me/api/portraits/women/22.jpg',
          distance: 3.1,
          price: 27,
          services: [SERVICE_TYPES.DOG_WALKING, SERVICE_TYPES.HOUSE_SITTING],
          isFavorite: false,
          featured: true,
        },
      ];
      
      setFeaturedProviders(mockFeatured);
      
      // In a real app, we would fetch from API:
      // const response = await api.getProviders({
      //   featured: true,
      //   latitude: currentLocation?.latitude,
      //   longitude: currentLocation?.longitude,
      // });
      // setFeaturedProviders(response.data);
    } catch (error) {
      console.log('Error fetching featured providers:', error);
    }
  };

  // Fetch recent bookings
  const fetchRecentBookings = async () => {
    try {
      // Mock data for now
      const mockBookings = [
        {
          id: '101',
          service: SERVICE_TYPES.DOG_WALKING,
          provider: {
            id: '1',
            name: 'Sarah Johnson',
            photo: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          pet: {
            id: '201',
            name: 'Max',
            photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
          },
          date: new Date(Date.now() + 86400000), // tomorrow
          status: 'confirmed',
        },
        {
          id: '102',
          service: SERVICE_TYPES.BOARDING,
          provider: {
            id: '4',
            name: 'David Rodriguez',
            photo: 'https://randomuser.me/api/portraits/men/67.jpg',
          },
          pet: {
            id: '202',
            name: 'Bella',
            photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
          },
          date: new Date(Date.now() + 604800000), // next week
          status: 'confirmed',
        },
      ];
      
      setRecentBookings(mockBookings);
      
      // In a real app, we would fetch from API:
      // const response = await api.getBookings({
      //   status: 'upcoming',
      //   limit: 2,
      // });
      // setRecentBookings(response.data);
    } catch (error) {
      console.log('Error fetching recent bookings:', error);
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  };

  // Handle search
  const onSearch = () => {
    navigation.navigate('Search', {query: searchQuery});
    setSearchQuery('');
  };

  // Handle service selection
  const onServiceSelect = (service: string) => {
    setSelectedService(service);
    // Refetch providers with new service filter
    fetchNearbyProviders();
  };

  // Render service type item
  const renderServiceType = ({item}: {item: {id: string; title: string; icon: string}}) => (
    <TouchableOpacity
      style={[
        styles.serviceItem,
        selectedService === item.id && styles.selectedServiceItem,
      ]}
      onPress={() => onServiceSelect(item.id)}
    >
      <Icon
        name={item.icon}
        size={24}
        color={selectedService === item.id ? theme.colors.white : theme.colors.primary}
      />
      <Text
        style={[
          styles.serviceText,
          selectedService === item.id && styles.selectedServiceText,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  // Render provider card
  const renderProviderCard = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.providerCard}
      onPress={() => navigation.navigate('ProviderDetail', {providerId: item.id})}
    >
      <Card style={styles.card}>
        <View style={styles.favoriteButton}>
          <Icon
            name={item.isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={item.isFavorite ? theme.colors.secondary : theme.colors.white}
          />
        </View>
        
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <Image source={{uri: item.photo}} style={styles.providerImage} />
        
        <Card.Content style={styles.cardContent}>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.reviewCount}>({item.reviewCount})</Text>
            </View>
          </View>
          
          <View style={styles.providerDetails}>
            <View style={styles.detailItem}>
              <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>{item.distance} mi away</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="currency-usd" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>${item.price}/walk</Text>
            </View>
          </View>
          
          <View style={styles.serviceTagsContainer}>
            {item.services.map((service: string, index: number) => (
              <Chip
                key={index}
                style={styles.serviceTag}
                textStyle={styles.serviceTagText}
                mode="outlined"
              >
                {service === SERVICE_TYPES.DOG_WALKING
                  ? 'Walking'
                  : service === SERVICE_TYPES.BOARDING
                  ? 'Boarding'
                  : service === SERVICE_TYPES.DAY_CARE
                  ? 'Day Care'
                  : service === SERVICE_TYPES.DROP_IN
                  ? 'Drop-In'
                  : 'House Sitting'}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  // Render booking card
  const renderBookingCard = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate('BookingDetail', {bookingId: item.id})}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.bookingCardContent}>
          <Image source={{uri: item.pet.photo}} style={styles.petImage} />
          
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingTitle}>
              {item.service === SERVICE_TYPES.DOG_WALKING
                ? 'Dog Walking'
                : item.service === SERVICE_TYPES.BOARDING
                ? 'Boarding'
                : item.service === SERVICE_TYPES.DAY_CARE
                ? 'Day Care'
                : item.service === SERVICE_TYPES.DROP_IN
                ? 'Drop-In'
                : 'House Sitting'}
            </Text>
            
            <View style={styles.bookingDetails}>
              <View style={styles.bookingDetailItem}>
                <Icon name="calendar" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.bookingDetailText}>
                  {item.date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              
              <View style={styles.bookingDetailItem}>
                <Icon name="account" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.bookingDetailText}>{item.provider.name}</Text>
              </View>
              
              <View style={styles.bookingDetailItem}>
                <Icon name="dog" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.bookingDetailText}>{item.pet.name}</Text>
              </View>
            </View>
            
            <View style={styles.bookingStatus}>
              <View
                style={[
                  styles.statusIndicator,
                  {backgroundColor: theme.colors.success},
                ]}
              />
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

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
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'there'}!</Text>
            <Text style={styles.subGreeting}>Find the perfect care for your pet</Text>
          </View>
          
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="bell-outline" size={24} color={theme.colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search for pet care services"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={theme.colors.primary}
            onSubmitEditing={onSearch}
          />
        </View>
        
        {/* Service Types */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Services</Text>
          
          <FlatList
            horizontal
            data={[
              {id: SERVICE_TYPES.DOG_WALKING, title: 'Walking', icon: 'walk'},
              {id: SERVICE_TYPES.BOARDING, title: 'Boarding', icon: 'home'},
              {id: SERVICE_TYPES.DAY_CARE, title: 'Day Care', icon: 'dog-side'},
              {id: SERVICE_TYPES.DROP_IN, title: 'Drop-In', icon: 'door'},
              {id: SERVICE_TYPES.HOUSE_SITTING, title: 'House Sitting', icon: 'sofa'},
            ]}
            renderItem={renderServiceType}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
          />
        </View>
        
        {/* Upcoming Bookings */}
        {recentBookings.length > 0 && (
          <View style={styles.bookingsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
              <TouchableOpacity onPress={() => navigation.navigate('BookingsTab')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              horizontal
              data={recentBookings}
              renderItem={renderBookingCard}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bookingsList}
            />
          </View>
        )}
        
        {/* Featured Providers */}
        {featuredProviders.length > 0 && (
          <View style={styles.featuredContainer}>
            <Text style={styles.sectionTitle}>Featured Providers</Text>
            
            <FlatList
              horizontal
              data={featuredProviders}
              renderItem={renderProviderCard}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.providersList}
            />
          </View>
        )}
        
        {/* Nearby Providers */}
        <View style={styles.nearbyContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Providers</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {nearbyProviders.length > 0 ? (
            <FlatList
              horizontal
              data={nearbyProviders}
              renderItem={renderProviderCard}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.providersList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="map-marker-off" size={48} color={theme.colors.disabled} />
              <Text style={styles.emptyText}>No providers found nearby</Text>
              <Button
                mode="contained"
                onPress={fetchNearbyProviders}
                style={styles.retryButton}
              >
                Retry
              </Button>
            </View>
          )}
        </View>
        
        {/* Promo Banner */}
        <TouchableOpacity style={styles.promoBanner}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.promoGradient}
          >
            <View style={styles.promoContent}>
              <View>
                <Text style={styles.promoTitle}>Refer a Friend</Text>
                <Text style={styles.promoText}>
                  Get $20 credit when they book their first service
                </Text>
              </View>
              <Button
                mode="contained"
                style={styles.promoButton}
                labelStyle={styles.promoButtonLabel}
                buttonColor={theme.colors.white}
                textColor={theme.colors.primary}
              >
                Share
              </Button>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subGreeting: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.grey1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.secondary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  searchBar: {
    elevation: 2,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
  },
  servicesContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  servicesList: {
    paddingRight: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  selectedServiceItem: {
    backgroundColor: theme.colors.primary,
  },
  serviceText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  selectedServiceText: {
    color: theme.colors.white,
  },
  bookingsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  bookingsList: {
    paddingRight: 16,
  },
  bookingCard: {
    width: 280,
    marginRight: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    ...commonStyles.shadow,
  },
  bookingCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  bookingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  bookingDetails: {
    marginTop: 4,
  },
  bookingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bookingDetailText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  bookingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.success,
  },
  featuredContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  nearbyContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  providersList: {
    paddingRight: 16,
  },
  providerCard: {
    width: 240,
    marginRight: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: theme.colors.secondary,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  providerImage: {
    width: '100%',
    height: 140,
  },
  cardContent: {
    padding: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 2,
  },
  providerDetails: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  serviceTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  serviceTag: {
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: theme.colors.grey1,
  },
  serviceTagText: {
    fontSize: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: theme.colors.grey1,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    marginBottom: 16,
  },
  retryButton: {
    borderRadius: 8,
  },
  promoBanner: {
    marginTop: 32,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  promoGradient: {
    borderRadius: 12,
    padding: 16,
  },
  promoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  promoText: {
    fontSize: 14,
    color: theme.colors.white,
    opacity: 0.9,
    marginTop: 4,
    maxWidth: 200,
  },
  promoButton: {
    borderRadius: 8,
  },
  promoButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 24,
  },
});

export default HomeScreen;