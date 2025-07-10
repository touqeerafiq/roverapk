// API Constants
export const API_BASE_URL = 'https://api.rover.com';
export const API_TIMEOUT = 30000; // 30 seconds
export const API_VERSION = 'v2';

// Authentication
export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const TOKEN_EXPIRY_KEY = 'token_expiry';

// Firebase
export const FIREBASE_COLLECTION = {
  USERS: 'users',
  PETS: 'pets',
  BOOKINGS: 'bookings',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  PROVIDERS: 'providers',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  WALKS: 'walks',
};

// Stripe
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51HZL5mJHXUGJ7HbVIAjAWFCCsmSJtV0MKxPpiNUgEMCuBUZKkYQwxrkryR8eiMU9iFvNWaQUBFAKwXD1Qwi7L5Zw00SWxS5jZm';

// App Settings
export const APP_SETTINGS = {
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr'],
  DEFAULT_RADIUS: 10, // miles
  MAX_RADIUS: 50, // miles
  MAX_IMAGES_PER_PET: 5,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_REVIEW_LENGTH: 500,
};

// Service Types
export const SERVICE_TYPES = {
  DOG_WALKING: 'dog_walking',
  BOARDING: 'boarding',
  DAY_CARE: 'day_care',
  DROP_IN: 'drop_in',
  HOUSE_SITTING: 'house_sitting',
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  NEW_MESSAGE: 'new_message',
  BOOKING_REQUEST: 'booking_request',
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',
  PAYMENT_PROCESSED: 'payment_processed',
  REVIEW_RECEIVED: 'review_received',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  PETS: 'pets',
  RECENT_SEARCHES: 'recent_searches',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  NOTIFICATION_SETTINGS: 'notification_settings',
  LAST_LOCATION: 'last_location',
};

// Deep Link Prefixes
export const DEEP_LINK_PREFIX = 'rover://';
export const DEEP_LINK_PATHS = {
  BOOKING: 'booking',
  PROVIDER: 'provider',
  MESSAGE: 'message',
  PET: 'pet',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please log in again.',
  PERMISSION_DENIED: 'Permission denied. Please check your app settings.',
  LOCATION_ERROR: 'Unable to get your location. Please check your settings.',
  PAYMENT_ERROR: 'Payment processing failed. Please try again or use a different payment method.',
};