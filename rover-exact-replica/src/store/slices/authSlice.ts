import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

import {AUTH_TOKEN_KEY, FIREBASE_COLLECTION} from '../../config/constants';
import {apiClient} from '../../api/client';

// Define the state interface
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  error: string | null;
  token: string | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
  token: null,
};

// Login with email and password
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({email, password}: {email: string; password: string}, {rejectWithValue}) => {
    try {
      // Firebase authentication
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      
      // Store token
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      // Get user data from Firestore
      const userDoc = await firestore()
        .collection(FIREBASE_COLLECTION.USERS)
        .doc(userCredential.user.uid)
        .get();
      
      // Return user data and token
      return {
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          ...userDoc.data(),
        },
        token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Register with email and password
export const registerWithEmail = createAsyncThunk(
  'auth/registerWithEmail',
  async (
    {
      email,
      password,
      firstName,
      lastName,
      phone,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone: string;
    },
    {rejectWithValue}
  ) => {
    try {
      // Firebase authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      
      // Store token
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      // Create user profile in Firestore
      await firestore().collection(FIREBASE_COLLECTION.USERS).doc(userCredential.user.uid).set({
        firstName,
        lastName,
        email,
        phone,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      
      // Return user data and token
      return {
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          firstName,
          lastName,
          phone,
        },
        token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Login with Google
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, {rejectWithValue}) => {
    try {
      // Google Sign-In
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign-in with credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      const token = await userCredential.user.getIdToken();
      
      // Store token
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      // Check if user exists in Firestore
      const userDoc = await firestore()
        .collection(FIREBASE_COLLECTION.USERS)
        .doc(userCredential.user.uid)
        .get();
      
      // If user doesn't exist, create profile
      if (!userDoc.exists) {
        await firestore().collection(FIREBASE_COLLECTION.USERS).doc(userCredential.user.uid).set({
          firstName: userCredential.user.displayName?.split(' ')[0] || '',
          lastName: userCredential.user.displayName?.split(' ').slice(1).join(' ') || '',
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }
      
      // Get user data
      const userData = userDoc.exists ? userDoc.data() : {
        firstName: userCredential.user.displayName?.split(' ')[0] || '',
        lastName: userCredential.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
      };
      
      // Return user data and token
      return {
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          ...userData,
        },
        token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Google login failed');
    }
  }
);

// Login with Facebook
export const loginWithFacebook = createAsyncThunk(
  'auth/loginWithFacebook',
  async (_, {rejectWithValue}) => {
    try {
      // Facebook Login
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      
      // Get access token
      const data = await AccessToken.getCurrentAccessToken();
      
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }
      
      // Create a Facebook credential with the token
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      
      // Sign-in with credential
      const userCredential = await auth().signInWithCredential(facebookCredential);
      const token = await userCredential.user.getIdToken();
      
      // Store token
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      // Check if user exists in Firestore
      const userDoc = await firestore()
        .collection(FIREBASE_COLLECTION.USERS)
        .doc(userCredential.user.uid)
        .get();
      
      // If user doesn't exist, create profile
      if (!userDoc.exists) {
        await firestore().collection(FIREBASE_COLLECTION.USERS).doc(userCredential.user.uid).set({
          firstName: userCredential.user.displayName?.split(' ')[0] || '',
          lastName: userCredential.user.displayName?.split(' ').slice(1).join(' ') || '',
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }
      
      // Get user data
      const userData = userDoc.exists ? userDoc.data() : {
        firstName: userCredential.user.displayName?.split(' ')[0] || '',
        lastName: userCredential.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
      };
      
      // Return user data and token
      return {
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          ...userData,
        },
        token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Facebook login failed');
    }
  }
);

// Logout
export const logout = createAsyncThunk('auth/logout', async (_, {rejectWithValue}) => {
  try {
    // Sign out from Firebase
    await auth().signOut();
    
    // Remove token from storage
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    
    return null;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Logout failed');
  }
});

// Check auth state
export const checkAuthState = createAsyncThunk('auth/checkAuthState', async (_, {rejectWithValue}) => {
  try {
    // Get current user
    const currentUser = auth().currentUser;
    
    if (!currentUser) {
      return null;
    }
    
    // Get token
    const token = await currentUser.getIdToken();
    
    // Store token
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    
    // Get user data from Firestore
    const userDoc = await firestore()
      .collection(FIREBASE_COLLECTION.USERS)
      .doc(currentUser.uid)
      .get();
    
    // Return user data and token
    return {
      user: {
        id: currentUser.uid,
        email: currentUser.email,
        ...userDoc.data(),
      },
      token,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Authentication check failed');
  }
});

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    {
      firstName,
      lastName,
      phone,
      photoURL,
    }: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      photoURL?: string;
    },
    {getState, rejectWithValue}
  ) => {
    try {
      const {auth} = getState() as {auth: AuthState};
      
      if (!auth.user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Update user profile in Firestore
      await firestore().collection(FIREBASE_COLLECTION.USERS).doc(auth.user.id).update({
        ...(firstName && {firstName}),
        ...(lastName && {lastName}),
        ...(phone && {phone}),
        ...(photoURL && {photoURL}),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      
      // Return updated user data
      return {
        firstName: firstName || auth.user.firstName,
        lastName: lastName || auth.user.lastName,
        phone: phone || auth.user.phone,
        photoURL: photoURL || auth.user.photoURL,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, {rejectWithValue}) => {
    try {
      await auth().sendPasswordResetEmail(email);
      return email;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password reset failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login with email
    builder.addCase(loginWithEmail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginWithEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(loginWithEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Register with email
    builder.addCase(registerWithEmail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerWithEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(registerWithEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Login with Google
    builder.addCase(loginWithGoogle.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Login with Facebook
    builder.addCase(loginWithFacebook.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginWithFacebook.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(loginWithFacebook.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Check auth state
    builder.addCase(checkAuthState.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkAuthState.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      }
      state.error = null;
    });
    builder.addCase(checkAuthState.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });
    
    // Update profile
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
      state.error = null;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Reset password
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const {clearError} = authSlice.actions;

export default authSlice.reducer;