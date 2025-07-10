import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// Based on the Rover app's color scheme from the APK analysis
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00A699', // Rover's primary teal color
    secondary: '#FF5A5F', // Rover's accent color
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#484848',
    error: '#FF5A5F',
    success: '#00A699',
    warning: '#FFB400',
    info: '#007A87',
    disabled: '#CCCCCC',
    placeholder: '#767676',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  fonts: {
    ...DefaultTheme.fonts,
  },
  roundness: 8,
};