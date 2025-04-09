import React, { useContext, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { RemindersContext, Reminder } from "./ReminderContext";

export default function ViewRemindersScreen({ navigation }: { navigation: any }) {
  const { reminders, deleteReminder } = useContext(RemindersContext);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

      reminders.forEach((reminder) => {
        const reminderTime = reminder.time;
        if (reminderTime === currentTime) {
          Alert.alert("Medicine Reminder", `It's time to take your medicine: ${reminder.name}`);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [reminders]);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteReminder(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background} />
      
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Medicine Reminders</Text>
        </View>
        
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.reminderCard}>
              <View style={styles.cardGradient}>
                <View style={styles.reminderContent}>
                  <View>
                    <Text style={styles.medicineName}>{item.name}</Text>
                    <Text style={styles.reminderDetails}>
                      <Text style={styles.labelText}>Dosage: </Text>
                      {item.dosage}
                    </Text>
                    <Text style={styles.reminderDetails}>
                      <Text style={styles.labelText}>Time: </Text>
                      {item.time}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#FF6347" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reminders yet.</Text>
              <Text style={styles.emptySubText}>Add your first medicine reminder!</Text>
            </View>
          }
        />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Go Back</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#3b5998',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  reminderCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  cardGradient: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  reminderContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicineName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  reminderDetails: {
    fontSize: 16,
    marginBottom: 4,
    color: "#555",
  },
  labelText: {
    fontWeight: "bold",
    color: "#4c669f",
  },
  deleteButton: {
    padding: 10,
  },
  emptyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
    fontWeight: "bold",
  },
  emptySubText: {
    fontSize: 14,
    color: "#777",
    marginTop: 8,
  },
  backButton: {
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 10,
    backgroundColor: '#2196F3',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
