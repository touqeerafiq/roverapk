import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, Searchbar, Chip, Avatar, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootState } from '../../store';
import { theme } from '../../utils/theme';
import { ServiceType } from '../../store/slices/bookingsSlice';

const serviceTypes = [
  { id: 1, type: ServiceType.DOG_WALKING, name: 'Dog Walking', icon: 'walk' },
  { id: 2, type: ServiceType.BOARDING, name: 'Boarding', icon: 'home' },
  { id: 3, type: ServiceType.DAY_CARE, name: 'Day Care', icon: 'dog-side' },
  { id: 4, type: ServiceType.DROP_IN, name: 'Drop-In Visits', icon: 'door' },
  { id: 5, type: ServiceType.HOUSE_SITTING, name: 'House Sitting', icon: 'sofa' },
];

// Mock data for service providers
const mockProviders = [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 4.9,
    reviewCount: 127,
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    services: [ServiceType.DOG_WALKING, ServiceType.DROP_IN],
    price: 25,
    distance: 0.8,
  },
  {
    id: '2',
    name: 'Michael Chen',
    rating: 4.8,
    reviewCount: 93,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    services: [ServiceType.BOARDING, ServiceType.DAY_CARE],
    price: 35,
    distance: 1.2,
  },
  {
    id: '3',
    name: 'Jessica Williams',
    rating: 4.7,
    reviewCount: 78,
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    services: [ServiceType.DOG_WALKING, ServiceType.HOUSE_SITTING],
    price: 30,
    distance: 1.5,
  },
  {
    id: '4',
    name: 'David Rodriguez',
    rating: 4.9,
    reviewCount: 112,
    photo: 'https://randomuser.me/api/portraits/men/75.jpg',
    services: [ServiceType.BOARDING, ServiceType.DAY_CARE, ServiceType.DOG_WALKING],
    price: 40,
    distance: 2.1,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState(mockProviders);

  useEffect(() => {
    // Simulate loading providers
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would filter providers based on the search query
  };

  const filterByService = (serviceType: ServiceType | null) => {
    setSelectedService(serviceType);
    
    if (serviceType === null) {
      setProviders(mockProviders);
    } else {
      const filtered = mockProviders.filter(provider => 
        provider.services.includes(serviceType)
      );
      setProviders(filtered);
    }
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.serviceItem,
        selectedService === item.type && styles.selectedServiceItem,
      ]}
      onPress={() => filterByService(item.type)}
    >
      <Icon
        name={item.icon}
        size={24}
        color={selectedService === item.type ? 'white' : theme.colors.primary}
      />
      <Text
        style={[
          styles.serviceText,
          selectedService === item.type && styles.selectedServiceText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProviderCard = ({ item }) => (
    <Card style={styles.providerCard} onPress={() => navigation.navigate('ServiceProvider', { providerId: item.id })}>
      <Card.Content style={styles.providerCardContent}>
        <Avatar.Image source={{ uri: item.photo }} size={80} />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFB400" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount})</Text>
          </View>
          <View style={styles.serviceChips}>
            {item.services.slice(0, 2).map((service, index) => (
              <Chip key={index} style={styles.serviceChip} textStyle={styles.chipText}>
                {serviceTypes.find(s => s.type === service)?.name}
              </Chip>
            ))}
            {item.services.length > 2 && (
              <Text style={styles.moreServices}>+{item.services.length - 2}</Text>
            )}
          </View>
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Starting at</Text>
          <Text style={styles.price}>${item.price}/night</Text>
        </View>
        <View style={styles.distanceContainer}>
          <Icon name="map-marker" size={16} color={theme.colors.primary} />
          <Text style={styles.distance}>{item.distance} mi</Text>
        </View>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hello, {user?.displayName || 'there'}!</Text>
          <Text style={styles.subtitle}>Find the perfect care for your pet</Text>
        </View>
      </View>
      
      <Searchbar
        placeholder="Search by location"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
        icon="map-marker"
      />
      
      <View style={styles.servicesContainer}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.chipContainer}>
          <Chip
            style={[styles.chip, selectedService === null && styles.selectedChip]}
            textStyle={[styles.chipText, selectedService === null && styles.selectedChipText]}
            onPress={() => filterByService(null)}
          >
            All
          </Chip>
          <FlatList
            data={serviceTypes}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
      
      <View style={styles.providersContainer}>
        <Text style={styles.sectionTitle}>Nearby Sitters</Text>
        
        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" color={theme.colors.primary} />
        ) : (
          <FlatList
            data={providers}
            renderItem={renderProviderCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.providersList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeContainer: {
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchBar: {
    marginHorizontal: 20,
    marginTop: -20,
    elevation: 4,
    borderRadius: 10,
  },
  servicesContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.text,
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.text,
  },
  selectedChipText: {
    color: 'white',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedServiceItem: {
    backgroundColor: theme.colors.primary,
  },
  serviceText: {
    marginLeft: 5,
    color: theme.colors.text,
  },
  selectedServiceText: {
    color: 'white',
  },
  providersContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  providersList: {
    paddingBottom: 20,
  },
  providerCard: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  providerCardContent: {
    flexDirection: 'row',
    padding: 10,
  },
  providerInfo: {
    marginLeft: 15,
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  reviewCount: {
    marginLeft: 5,
    color: '#757575',
  },
  serviceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceChip: {
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#F0F0F0',
    height: 24,
  },
  moreServices: {
    color: theme.colors.primary,
    marginLeft: 5,
    alignSelf: 'center',
  },
  cardActions: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: 12,
    color: '#757575',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    marginLeft: 5,
    color: '#757575',
  },
  loader: {
    marginTop: 50,
  },
});

export default HomeScreen;