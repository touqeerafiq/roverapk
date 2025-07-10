import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../utils/theme';

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    breed: string;
    age: number;
    photoURL?: string;
  };
  onEdit?: () => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onEdit }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('PetProfile', { petId: pet.id });
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          {pet.photoURL ? (
            <Image source={{ uri: pet.photoURL }} style={styles.petImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="dog" size={40} color="#CCCCCC" />
            </View>
          )}
        </View>
        
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>{pet.breed}</Text>
          <Text style={styles.petAge}>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</Text>
        </View>
        
        {onEdit && (
          <IconButton
            icon="pencil"
            size={20}
            onPress={onEdit}
            style={styles.editButton}
          />
        )}
      </View>
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
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  petInfo: {
    marginLeft: 15,
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  petAge: {
    fontSize: 14,
    color: '#757575',
  },
  editButton: {
    margin: 0,
  },
});

export default PetCard;