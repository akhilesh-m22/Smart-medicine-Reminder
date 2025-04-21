/**
 * _layout.tsx
 * 
 * Root layout component for the application using Expo Router.
 * This file defines the root stack for navigation in the application.
 * 
 * The Stack component from expo-router provides:
 * - Screen navigation capabilities
 * - Navigation history management
 * - Transitions between screens
 * 
 * This is the entry point for the app's navigation structure.
 */
import { Stack } from "expo-router";

/**
 * RootLayout Component
 * 
 * Provides the base navigation container for the app.
 * All screens and nested navigators will be children of this component.
 * 
 * @returns {JSX.Element} The Stack navigator component
 */
export default function RootLayout() {
  return <Stack />;
}
