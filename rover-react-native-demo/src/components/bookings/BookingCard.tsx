import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

import { theme } from '../../utils/theme';
import { BookingStatus, ServiceType } from '../../store/slices/bookingsSlice';

interface BookingCardProps {
  booking: {
    id: string;
    serviceType: ServiceType;
    status: BookingStatus;
    startDate: string;
    endDate: string;
    price: number;
    serviceProvider: {
      id: string;
      name: string;
      photoURL?: string;
    };
    pets: Array<{
      id: string;
      name: string;
      photoURL?: string;
    }>;
  };
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('BookingDetails', { bookingId: booking.id });
  };

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.DOG_WALKING:
        return 'walk';
      case ServiceType.BOARDING:
        return 'home';
      case ServiceType.DAY_CARE:
        return 'dog-side';
      case ServiceType.DROP_IN:
        return 'door';
      case ServiceType.HOUSE_SITTING:
        return 'sofa';
      default:
        return 'calendar';
    }
  };

  const getServiceName = (type: ServiceType) => {
    switch (type) {
      case ServiceType.DOG_WALKING:
        return 'Dog Walking';
      case ServiceType.BOARDING:
        return 'Boarding';
      case ServiceType.DAY_CARE:
        return 'Day Care';
      case ServiceType.DROP_IN:
        return 'Drop-In Visit';
      case ServiceType.HOUSE_SITTING:
        return 'House Sitting';
      default:
        return 'Service';
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return '#FFB400';
      case BookingStatus.CONFIRMED:
        return theme.colors.primary;
      case BookingStatus.IN_PROGRESS:
        return '#007AFF';
      case BookingStatus.COMPLETED:
        return '#4CAF50';
      case BookingStatus.CANCELLED:
        return theme.colors.error;
      default:
        return '#757575';
    }
  };

  const getStatusName = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'Pending';
      case BookingStatus.CONFIRMED:
        return 'Confirmed';
      case BookingStatus.IN_PROGRESS:
        return 'In Progress';
      case BookingStatus.COMPLETED:
        return 'Completed';
      case BookingStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.serviceInfo}>
            <Icon name={getServiceIcon(booking.serviceType)} size={20} color={theme.colors.primary} />
            <Text style={styles.serviceType}>{getServiceName(booking.serviceType)}</Text>
          </View>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(booking.status) + '20' }]}
            textStyle={{ color: getStatusColor(booking.status) }}
          >
            {getStatusName(booking.status)}
          </Chip>
        </View>
        
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={16} color="#757575" style={styles.dateIcon} />
          <Text style={styles.dateText}>
            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.providerContainer}>
          <Avatar.Image
            source={
              booking.serviceProvider.photoURL
                ? { uri: booking.serviceProvider.photoURL }
                : require('../../assets/default-avatar.png')
            }
            size={40}
          />
          <View style={styles.providerInfo}>
            <Text style={styles.providerLabel}>Service Provider</Text>
            <Text style={styles.providerName}>{booking.serviceProvider.name}</Text>
          </View>
        </View>
        
        <View style={styles.petsContainer}>
          <Text style={styles.petsLabel}>Pets</Text>
          <View style={styles.petAvatars}>
            {booking.pets.map((pet, index) => (
              <Avatar.Image
                key={pet.id}
                source={
                  pet.photoURL
                    ? { uri: pet.photoURL }
                    : require('../../assets/default-pet.png')
                }
                size={30}
                style={[styles.petAvatar, { zIndex: booking.pets.length - index }]}
              />
            ))}
            <Text style={styles.petNames}>
              {booking.pets.map(pet => pet.name).join(', ')}
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.price}>${booking.price}</Text>
          <Icon name="chevron-right" size={24} color="#BBBBBB" />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  cardContent: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusChip: {
    height: 28,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateIcon: {
    marginRight: 5,
  },
  dateText: {
    color: '#757575',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 15,
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  providerInfo: {
    marginLeft: 10,
  },
  providerLabel: {
    fontSize: 12,
    color: '#757575',
  },
  providerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  petsContainer: {
    marginBottom: 15,
  },
  petsLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 5,
  },
  petAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petAvatar: {
    marginRight: -10,
    borderWidth: 2,
    borderColor: 'white',
  },
  petNames: {
    marginLeft: 15,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default BookingCard;