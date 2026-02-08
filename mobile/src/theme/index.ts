import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import { MD3LightTheme } from "react-native-paper";

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#1DA1F2",
    secondary: "#14171A",
    error: "#E0245E",
    background: "#FFFFFF",
    surface: "#F7F9FA",
    onSurface: "#14171A",
    onBackground: "#657786",
    outline: "#E1E8ED",
  },
};

export const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: paperTheme.colors.primary,
    background: paperTheme.colors.background,
    card: paperTheme.colors.surface,
    text: paperTheme.colors.onSurface,
    border: paperTheme.colors.outline,
    notification: paperTheme.colors.primary,
  },
};

export const theme = paperTheme;

export type AppTheme = typeof theme;
