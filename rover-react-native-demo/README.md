# Rover React Native App

This is a React Native implementation of the Rover dog boarding and walking app. This project demonstrates how to rebuild a native Android app using React Native for cross-platform compatibility.

## Project Structure

```
rover-react-native/
├── src/
│   ├── assets/           # Images, fonts, and other static assets
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Shared components
│   │   ├── pets/         # Pet-related components
│   │   ├── bookings/     # Booking-related components
│   │   ├── messages/     # Messaging components
│   │   └── profile/      # Profile components
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Screen components
│   │   ├── auth/         # Authentication screens
│   │   ├── main/         # Main app screens
│   │   ├── pets/         # Pet management screens
│   │   ├── bookings/     # Booking screens
│   │   ├── messages/     # Messaging screens
│   │   ├── providers/    # Service provider screens
│   │   └── profile/      # User profile screens
│   ├── services/         # API and service integrations
│   ├── store/            # Redux store configuration
│   │   └── slices/       # Redux slices
│   └── utils/            # Utility functions and constants
├── App.tsx              # Main app component
├── index.js             # Entry point
└── package.json         # Dependencies and scripts
```

## Features

- **Authentication**: User login, registration, and profile management
- **Pet Management**: Add, edit, and manage pet profiles
- **Service Booking**: Book dog walking, boarding, and other services
- **Messaging**: Real-time chat between pet owners and service providers
- **Location Tracking**: Track dog walks in real-time with maps
- **Payments**: Process payments for services
- **Notifications**: Receive updates on bookings and messages

## Technology Stack

- **React Native**: Core framework for cross-platform mobile development
- **TypeScript**: Type-safe JavaScript
- **Redux**: State management with Redux Toolkit
- **React Navigation**: Navigation and routing
- **React Native Paper**: Material Design components
- **React Native Maps**: Map integration for location tracking
- **Firebase**: Authentication, database, storage, and messaging

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rover-react-native.git
   cd rover-react-native
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the Metro bundler:
   ```
   npm start
   # or
   yarn start
   ```

4. Run on Android:
   ```
   npm run android
   # or
   yarn android
   ```

5. Run on iOS (macOS only):
   ```
   npm run ios
   # or
   yarn ios
   ```

## Development

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
API_URL=https://your-api-url.com
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Firebase Configuration

1. Create a Firebase project
2. Add Android and iOS apps to your Firebase project
3. Download the configuration files:
   - `google-services.json` for Android (place in `android/app/`)
   - `GoogleService-Info.plist` for iOS (place in `ios/YourAppName/`)

## Building for Production

### Android

```
cd android
./gradlew assembleRelease
```

The APK will be generated at `android/app/build/outputs/apk/release/app-release.apk`

### iOS

Build using Xcode or:

```
cd ios
pod install
xcodebuild -workspace YourAppName.xcworkspace -scheme YourAppName -configuration Release -sdk iphoneos build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original Rover app for inspiration
- React Native community for the excellent tools and libraries