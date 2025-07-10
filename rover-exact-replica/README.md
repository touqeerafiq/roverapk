# Rover App - React Native Replica

This project is an exact replica of the Rover pet care app, rebuilt using React Native. It includes all screens, functionality, and backend services of the original app.

## Features

- **Authentication**: Email/password login, social login (Google, Facebook), registration, password reset
- **Pet Management**: Add, edit, and manage pet profiles with photos and care instructions
- **Service Booking**: Book dog walking, boarding, day care, drop-in visits, and house sitting
- **Provider Discovery**: Find and filter pet care providers by location, service type, and availability
- **Messaging**: Real-time chat with service providers
- **Walk Tracking**: GPS tracking for dog walks with photo updates
- **Payments**: Secure payment processing with multiple payment methods
- **Reviews & Ratings**: Rate and review service providers
- **Notifications**: Push notifications for booking updates and messages

## Tech Stack

- **React Native**: Core framework for cross-platform mobile development
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management
- **React Navigation**: Navigation and routing
- **Firebase**: Authentication, database, storage, and messaging
- **React Native Maps**: Location and mapping functionality
- **Stripe**: Payment processing
- **React Native Paper**: UI components
- **Formik & Yup**: Form handling and validation

## Project Structure

```
src/
├── api/            # API client and service functions
├── assets/         # Images, fonts, and other static assets
├── components/     # Reusable UI components
├── config/         # Configuration files and constants
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── navigation/     # Navigation configuration
├── screens/        # App screens organized by feature
├── services/       # Business logic and services
├── store/          # Redux store, slices, and actions
├── styles/         # Global styles and themes
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- CocoaPods (for iOS dependencies)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rover-react-native.git
   cd rover-react-native
   ```

2. Install dependencies:
   ```
   yarn install
   # or
   npm install
   ```

3. Install iOS dependencies:
   ```
   cd ios && pod install && cd ..
   ```

4. Create a `.env` file in the root directory with your API keys:
   ```
   API_BASE_URL=https://api.example.com
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

### Running the App

#### iOS

```
yarn ios
# or
npm run ios
```

#### Android

```
yarn android
# or
npm run android
```

## Building for Production

### Android

```
yarn build:android
# or
npm run build:android
```

This will generate an APK file in `android/app/build/outputs/apk/release/`.

### iOS

Build the app using Xcode by opening the `.xcworkspace` file in the `ios` directory.

## Testing

```
yarn test
# or
npm test
```

## License

This project is for educational purposes only. The original Rover app and its assets are owned by Rover.com.

## Acknowledgements

- [React Native](https://reactnative.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase](https://firebase.google.com/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [React Native Paper](https://callstack.github.io/react-native-paper/)