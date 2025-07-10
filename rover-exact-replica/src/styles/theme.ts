import {DefaultTheme} from 'react-native-paper';
import {Platform} from 'react-native';

// Exact color palette from the Rover app
const colors = {
  primary: '#00A699', // Teal
  primaryLight: '#B2E5E3',
  primaryDark: '#008489',
  secondary: '#FF5A5F', // Coral
  secondaryLight: '#FF9EA3',
  secondaryDark: '#E00007',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#FF5A5F',
  text: '#484848',
  textSecondary: '#767676',
  textLight: '#9B9B9B',
  border: '#DDDDDD',
  disabled: '#CCCCCC',
  placeholder: '#767676',
  success: '#00A699',
  warning: '#FFB400',
  info: '#007A87',
  overlay: 'rgba(0, 0, 0, 0.5)',
  black: '#000000',
  white: '#FFFFFF',
  grey1: '#F5F5F5',
  grey2: '#EEEEEE',
  grey3: '#DDDDDD',
  grey4: '#BBBBBB',
  grey5: '#999999',
  transparent: 'transparent',
};

// Font configuration to match Rover app
const fontConfig = {
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '200' as const,
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700' as const,
    },
  },
  android: {
    regular: {
      fontFamily: 'Roboto',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Roboto-Medium',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Roboto-Light',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Roboto-Thin',
      fontWeight: '200' as const,
    },
    bold: {
      fontFamily: 'Roboto-Bold',
      fontWeight: '700' as const,
    },
  },
};

// Create the theme with exact Rover app specifications
export const theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  fonts: Platform.select(fontConfig),
  animation: {
    scale: 1.0,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
};

// Common styles used throughout the app
export const commonStyles = {
  shadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  strongShadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
};