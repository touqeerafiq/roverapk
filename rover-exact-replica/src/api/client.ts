import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {
  API_BASE_URL,
  API_TIMEOUT,
  API_VERSION,
  AUTH_TOKEN_KEY,
  ERROR_MESSAGES,
} from '../config/constants';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Platform': Platform.OS,
    'X-App-Version': DeviceInfo.getVersion(),
    'X-Device-Model': DeviceInfo.getModel(),
    'X-OS-Version': DeviceInfo.getSystemVersion(),
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Check network connection
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
    }
    
    // Get auth token
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    
    // Add auth token to headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
    }
    
    // Handle unauthorized errors (401)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token (implementation depends on your auth system)
        // For example:
        // const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        // const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        // const { token } = response.data;
        // await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        // originalRequest.headers.Authorization = `Bearer ${token}`;
        // return apiClient(originalRequest);
        
        // For now, just reject with auth error
        return Promise.reject(new Error(ERROR_MESSAGES.AUTHENTICATION_ERROR));
      } catch (refreshError) {
        // Clear auth data and reject
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        return Promise.reject(new Error(ERROR_MESSAGES.AUTHENTICATION_ERROR));
      }
    }
    
    // Handle server errors (5xx)
    if (error.response.status >= 500) {
      return Promise.reject(new Error(ERROR_MESSAGES.SERVER_ERROR));
    }
    
    // Handle other errors
    const errorMessage = error.response.data?.message || error.message || ERROR_MESSAGES.SERVER_ERROR;
    return Promise.reject(new Error(errorMessage));
  }
);

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  refreshToken: '/auth/refresh',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  
  // User
  userProfile: '/user/profile',
  updateProfile: '/user/profile',
  
  // Pets
  pets: '/pets',
  pet: (petId: string) => `/pets/${petId}`,
  
  // Providers
  providers: '/providers',
  provider: (providerId: string) => `/providers/${providerId}`,
  providerReviews: (providerId: string) => `/providers/${providerId}/reviews`,
  
  // Bookings
  bookings: '/bookings',
  booking: (bookingId: string) => `/bookings/${bookingId}`,
  cancelBooking: (bookingId: string) => `/bookings/${bookingId}/cancel`,
  
  // Messages
  conversations: '/conversations',
  conversation: (conversationId: string) => `/conversations/${conversationId}`,
  messages: (conversationId: string) => `/conversations/${conversationId}/messages`,
  
  // Walks
  walks: '/walks',
  walk: (walkId: string) => `/walks/${walkId}`,
  startWalk: (bookingId: string) => `/bookings/${bookingId}/start-walk`,
  endWalk: (walkId: string) => `/walks/${walkId}/end`,
  walkPath: (walkId: string) => `/walks/${walkId}/path`,
  
  // Payments
  paymentMethods: '/payment-methods',
  paymentMethod: (paymentMethodId: string) => `/payment-methods/${paymentMethodId}`,
  
  // Reviews
  reviews: '/reviews',
  review: (reviewId: string) => `/reviews/${reviewId}`,
  
  // Notifications
  notifications: '/notifications',
  notificationSettings: '/notifications/settings',
};

// API service functions
export const api = {
  // Auth
  login: (email: string, password: string) => 
    apiClient.post(endpoints.login, {email, password}),
  
  register: (userData: any) => 
    apiClient.post(endpoints.register, userData),
  
  forgotPassword: (email: string) => 
    apiClient.post(endpoints.forgotPassword, {email}),
  
  resetPassword: (token: string, password: string) => 
    apiClient.post(endpoints.resetPassword, {token, password}),
  
  // User
  getUserProfile: () => 
    apiClient.get(endpoints.userProfile),
  
  updateUserProfile: (profileData: any) => 
    apiClient.put(endpoints.updateProfile, profileData),
  
  // Pets
  getPets: () => 
    apiClient.get(endpoints.pets),
  
  getPet: (petId: string) => 
    apiClient.get(endpoints.pet(petId)),
  
  createPet: (petData: any) => 
    apiClient.post(endpoints.pets, petData),
  
  updatePet: (petId: string, petData: any) => 
    apiClient.put(endpoints.pet(petId), petData),
  
  deletePet: (petId: string) => 
    apiClient.delete(endpoints.pet(petId)),
  
  // Providers
  getProviders: (params?: any) => 
    apiClient.get(endpoints.providers, {params}),
  
  getProvider: (providerId: string) => 
    apiClient.get(endpoints.provider(providerId)),
  
  getProviderReviews: (providerId: string) => 
    apiClient.get(endpoints.providerReviews(providerId)),
  
  // Bookings
  getBookings: (params?: any) => 
    apiClient.get(endpoints.bookings, {params}),
  
  getBooking: (bookingId: string) => 
    apiClient.get(endpoints.booking(bookingId)),
  
  createBooking: (bookingData: any) => 
    apiClient.post(endpoints.bookings, bookingData),
  
  updateBooking: (bookingId: string, bookingData: any) => 
    apiClient.put(endpoints.booking(bookingId), bookingData),
  
  cancelBooking: (bookingId: string, reason?: string) => 
    apiClient.post(endpoints.cancelBooking(bookingId), {reason}),
  
  // Messages
  getConversations: () => 
    apiClient.get(endpoints.conversations),
  
  getConversation: (conversationId: string) => 
    apiClient.get(endpoints.conversation(conversationId)),
  
  getMessages: (conversationId: string) => 
    apiClient.get(endpoints.messages(conversationId)),
  
  sendMessage: (conversationId: string, message: string, attachments?: any[]) => 
    apiClient.post(endpoints.messages(conversationId), {message, attachments}),
  
  // Walks
  getWalks: (params?: any) => 
    apiClient.get(endpoints.walks, {params}),
  
  getWalk: (walkId: string) => 
    apiClient.get(endpoints.walk(walkId)),
  
  startWalk: (bookingId: string) => 
    apiClient.post(endpoints.startWalk(bookingId)),
  
  endWalk: (walkId: string, summary?: any) => 
    apiClient.post(endpoints.endWalk(walkId), summary),
  
  updateWalkPath: (walkId: string, coordinates: any[]) => 
    apiClient.post(endpoints.walkPath(walkId), {coordinates}),
  
  // Payments
  getPaymentMethods: () => 
    apiClient.get(endpoints.paymentMethods),
  
  addPaymentMethod: (paymentMethodData: any) => 
    apiClient.post(endpoints.paymentMethods, paymentMethodData),
  
  deletePaymentMethod: (paymentMethodId: string) => 
    apiClient.delete(endpoints.paymentMethod(paymentMethodId)),
  
  // Reviews
  createReview: (reviewData: any) => 
    apiClient.post(endpoints.reviews, reviewData),
  
  updateReview: (reviewId: string, reviewData: any) => 
    apiClient.put(endpoints.review(reviewId), reviewData),
  
  // Notifications
  getNotifications: () => 
    apiClient.get(endpoints.notifications),
  
  getNotificationSettings: () => 
    apiClient.get(endpoints.notificationSettings),
  
  updateNotificationSettings: (settings: any) => 
    apiClient.put(endpoints.notificationSettings, settings),
};