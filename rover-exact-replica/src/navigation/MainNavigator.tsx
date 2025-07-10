import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Platform} from 'react-native';

import HomeScreen from '../screens/home/HomeScreen';
import BookingsScreen from '../screens/booking/BookingsScreen';
import MessagesScreen from '../screens/messages/MessagesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SearchScreen from '../screens/home/SearchScreen';
import ProviderDetailScreen from '../screens/providers/ProviderDetailScreen';
import BookingDetailScreen from '../screens/booking/BookingDetailScreen';
import CreateBookingScreen from '../screens/booking/CreateBookingScreen';
import PaymentScreen from '../screens/booking/PaymentScreen';
import BookingConfirmationScreen from '../screens/booking/BookingConfirmationScreen';
import ConversationScreen from '../screens/messages/ConversationScreen';
import PetProfileScreen from '../screens/pets/PetProfileScreen';
import AddPetScreen from '../screens/pets/AddPetScreen';
import EditPetScreen from '../screens/pets/EditPetScreen';
import WalkTrackingScreen from '../screens/tracking/WalkTrackingScreen';
import WalkSummaryScreen from '../screens/tracking/WalkSummaryScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import PaymentMethodsScreen from '../screens/payments/PaymentMethodsScreen';
import AddPaymentMethodScreen from '../screens/payments/AddPaymentMethodScreen';
import AccountScreen from '../screens/profile/AccountScreen';
import HelpScreen from '../screens/settings/HelpScreen';
import ReviewScreen from '../screens/booking/ReviewScreen';
import {theme} from '../styles/theme';

// Define the tab param list
export type MainTabParamList = {
  HomeTab: undefined;
  BookingsTab: undefined;
  MessagesTab: undefined;
  ProfileTab: undefined;
};

// Define the stack param list
export type MainStackParamList = {
  Home: undefined;
  Search: {query?: string; filters?: object};
  ProviderDetail: {providerId: string};
  CreateBooking: {providerId: string; serviceType: string};
  Payment: {bookingId: string};
  BookingConfirmation: {bookingId: string};
  Bookings: undefined;
  BookingDetail: {bookingId: string};
  Messages: undefined;
  Conversation: {conversationId: string; recipientId?: string};
  Profile: undefined;
  PetProfile: {petId: string};
  AddPet: undefined;
  EditPet: {petId: string};
  WalkTracking: {bookingId: string};
  WalkSummary: {walkId: string};
  Notifications: undefined;
  Settings: undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  Account: undefined;
  Help: undefined;
  Review: {bookingId: string; providerId: string};
};

// Create the stack navigator
const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Home Stack
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ProviderDetail" component={ProviderDetailScreen} />
      <Stack.Screen name="CreateBooking" component={CreateBookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    </Stack.Navigator>
  );
};

// Bookings Stack
const BookingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Bookings" component={BookingsScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="WalkTracking" component={WalkTrackingScreen} />
      <Stack.Screen name="WalkSummary" component={WalkSummaryScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
    </Stack.Navigator>
  );
};

// Messages Stack
const MessagesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
};

// Profile Stack
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="PetProfile" component={PetProfileScreen} />
      <Stack.Screen name="AddPet" component={AddPetScreen} />
      <Stack.Screen name="EditPet" component={EditPetScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'BookingsTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MessagesTab') {
            iconName = focused ? 'message' : 'message-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsStack}
        options={{
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesStack}
        options={{
          tabBarLabel: 'Messages',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;