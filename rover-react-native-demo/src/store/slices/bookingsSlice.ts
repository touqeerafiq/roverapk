import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ServiceType {
  DOG_WALKING = 'dog_walking',
  BOARDING = 'boarding',
  DAY_CARE = 'day_care',
  DROP_IN = 'drop_in',
  HOUSE_SITTING = 'house_sitting',
}

interface Booking {
  id: string;
  petIds: string[];
  serviceProviderId: string;
  ownerId: string;
  serviceType: ServiceType;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  price: number;
  notes?: string;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  walkDetails?: {
    distance: number;
    duration: number;
    path: Array<{
      latitude: number;
      longitude: number;
      timestamp: string;
    }>;
  };
}

interface BookingsState {
  bookings: Booking[];
  activeBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  activeBooking: null,
  isLoading: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    fetchBookingsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBookingsSuccess: (state, action: PayloadAction<Booking[]>) => {
      state.isLoading = false;
      state.bookings = action.payload;
      state.error = null;
    },
    fetchBookingsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex((booking) => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
        if (state.activeBooking?.id === action.payload.id) {
          state.activeBooking = action.payload;
        }
      }
    },
    deleteBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter((booking) => booking.id !== action.payload);
      if (state.activeBooking?.id === action.payload) {
        state.activeBooking = null;
      }
    },
    setActiveBooking: (state, action: PayloadAction<string>) => {
      state.activeBooking = state.bookings.find((booking) => booking.id === action.payload) || null;
    },
    clearActiveBooking: (state) => {
      state.activeBooking = null;
    },
    updateWalkDetails: (state, action: PayloadAction<{ bookingId: string; walkDetails: Booking['walkDetails'] }>) => {
      const { bookingId, walkDetails } = action.payload;
      const booking = state.bookings.find((b) => b.id === bookingId);
      if (booking) {
        booking.walkDetails = walkDetails;
        if (state.activeBooking?.id === bookingId) {
          state.activeBooking.walkDetails = walkDetails;
        }
      }
    },
  },
});

export const {
  fetchBookingsStart,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  addBooking,
  updateBooking,
  deleteBooking,
  setActiveBooking,
  clearActiveBooking,
  updateWalkDetails,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;