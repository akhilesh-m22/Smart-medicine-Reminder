/**
 * Main entry point for the Smart Medicine Reminder application
 * Sets up navigation and global state management for reminders
 */
import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AddReminderScreen from "./AddReminderScreen";
import ViewRemindersScreen from "./ViewRemindersScreen";
import { RemindersContext, Reminder } from "./ReminderContext";

// Create the navigation stack for the application
const Stack = createStackNavigator();

/**
 * HomeScreen Component
 * 
 * Displays the main landing screen of the application with:
 * - Real-time clock display
 * - App logo and title
 * - Navigation buttons to add and view reminders
 * 
 * @param {object} navigation - Navigation object from React Navigation
 */
function HomeScreen({ navigation }: { navigation: any }) {
  // State to track and display current time
  const [currentTime, setCurrentTime] = useState("");

  /**
   * Effect hook to update the clock display every second
   * Sets up interval and cleans it up when component unmounts
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.clockContainer}>
        <Text style={styles.clock}>{currentTime}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Smart Medicine Reminder</Text>
        <Text style={styles.subtitle}>Never miss your medication again</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate("AddReminder")}
          >
            <View style={[styles.buttonGradient, styles.addButton]}>
              <Text style={styles.buttonText}>Add Reminder</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate("ViewReminders")}
          >
            <View style={[styles.buttonGradient, styles.viewButton]}>
              <Text style={styles.buttonText}>View Reminders</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/**
 * App Component - Root component of the application
 * 
 * Provides:
 * - Global state management through RemindersContext
 * - Navigation structure with Stack Navigator
 * 
 * @returns {JSX.Element} The complete application with navigation and state management
 */
export default function App() {
  // Initialize reminders state array
  const [reminders, setReminders] = useState<Reminder[]>([]);

  /**
   * Adds a new reminder to the global state
   * @param {Reminder} reminder - New reminder object to be added
   */
  const addReminder = (reminder: Reminder) => {
    setReminders((prevReminders) => [...prevReminders, reminder]);
  };

  /**
   * Deletes a reminder from the global state by ID
   * @param {string} id - ID of the reminder to be deleted
   */
  const deleteReminder = (id: string) => {
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== id));
  };

  return (
      <RemindersContext.Provider value={{ reminders, addReminder, deleteReminder }}>
        <Stack.Navigator 
          initialRouteName="Home" 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' } 
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddReminder" component={AddReminderScreen} />
          <Stack.Screen name="ViewReminders" component={ViewRemindersScreen} />
        </Stack.Navigator>
      </RemindersContext.Provider>
  );
}

/**
 * Styles for components in the application
 * Defines layout, colors, shadows, and text formatting
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b5998",
    position: "relative",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  clockContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clock: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    marginBottom: 30,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  addButton: {
    backgroundColor: "#4CAF50",
  },
  viewButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
