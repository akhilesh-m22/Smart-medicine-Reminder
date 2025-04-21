/**
 * AddReminderScreen.tsx
 * 
 * This component provides a form interface for users to add new medication reminders.
 * Features:
 * - Input fields for medicine name and dosage
 * - Time selection with hour, minute, and AM/PM pickers
 * - Slot selection for the physical medicine dispenser
 * - Validation for medicine names and dosages
 * 
 * The component uses the RemindersContext to add new reminders to the global state.
 */
import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { RemindersContext } from "./ReminderContext";
import RNPickerSelect from 'react-native-picker-select';

/**
 * List of valid medications with their dosage ranges
 * Each medication object contains:
 * - name: Name of the medication
 * - minDosage: Minimum recommended dosage
 * - maxDosage: Maximum recommended dosage
 */
const validMedicines = [
  { name: "Paracetamol", minDosage: 1, maxDosage: 2 }, // Example: 1-2 tablets
  { name: "Vitamin C", minDosage: 1, maxDosage: 1 },   // Example: 1 tablet
  { name: "Ibuprofen", minDosage: 1, maxDosage: 3 },   // Example: 1-3 tablets
  { name: "Metformin", minDosage: 1, maxDosage: 2 },   // For diabetes
  { name: "Glibenclamide", minDosage: 1, maxDosage: 2 }, // For diabetes
  { name: "Aspirin", minDosage: 1, maxDosage: 2 },     // For heart health
  { name: "Atorvastatin", minDosage: 1, maxDosage: 1 }, // For cholesterol
  { name: "Losartan", minDosage: 1, maxDosage: 1 },    // For blood pressure
  { name: "Amlodipine", minDosage: 1, maxDosage: 1 },  // For blood pressure
  { name: "Omeprazole", minDosage: 1, maxDosage: 1 },  // For acid reflux
  { name: "Pantoprazole", minDosage: 1, maxDosage: 1 }, // For acid reflux
  { name: "Cetirizine", minDosage: 1, maxDosage: 1 },  // For allergies
  { name: "Loratadine", minDosage: 1, maxDosage: 1 },  // For allergies
  { name: "Amoxicillin", minDosage: 1, maxDosage: 3 }, // For bacterial infections
  { name: "Azithromycin", minDosage: 1, maxDosage: 1 }, // For bacterial infections
  { name: "Salbutamol", minDosage: 1, maxDosage: 2 },  // For asthma
  { name: "Montelukast", minDosage: 1, maxDosage: 1 }, // For asthma/allergies
  { name: "Clopidogrel", minDosage: 1, maxDosage: 1 }, // For blood thinning
  { name: "Warfarin", minDosage: 1, maxDosage: 1 },    // For blood thinning
  { name: "Levothyroxine", minDosage: 1, maxDosage: 1 }, // For thyroid
  { name: "Insulin", minDosage: 1, maxDosage: 2 },     // For diabetes
];

/**
 * AddReminderScreen Component
 * 
 * @param {object} navigation - React Navigation object used for screen transitions
 * @returns {JSX.Element} Rendered component
 */
export default function AddReminderScreen({ navigation }: { navigation: any }) {
  // Replace with your ESP32 IP address
  const ESP32_IP = "192.168.241.163";
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedAmPm, setSelectedAmPm] = useState<string>("AM");
  const [selectedSlot, setSelectedSlot] = useState<string>("1");
  
  // Access addReminder function from context
  const { addReminder } = useContext(RemindersContext);

  // Data for dropdown pickers
  const hours = Array.from({ length: 12 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1) }));
  const minutes = Array.from({ length: 60 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i }));
  const ampm = [{ label: "AM", value: "AM" }, { label: "PM", value: "PM" }];
  const slots = [{ label: "Slot 1", value: "1" }, { label: "Slot 2", value: "2" }];

  /**
   * Validates the medicine name and dosage
   * Checks if the medicine exists in the valid medicines list
   * Verifies if the dosage is within the recommended range
   * 
   * @returns {boolean} Whether the medicine and dosage are valid
   */
  const validateMedicine = () => {
    const medicine = validMedicines.find(
      (med) => med.name.toLowerCase() === medicineName.trim().toLowerCase()
    );
    if (!medicine) {
      Alert.alert("Error", "Invalid medicine name. Please enter a valid medicine.");
      return false;
    }

    const dosageValue = parseFloat(dosage);
    if (isNaN(dosageValue) || dosageValue < medicine.minDosage || dosageValue > medicine.maxDosage) {
      Alert.alert(
        "Error",
        `Invalid dosage. The recommended dosage for ${medicine.name} is between ${medicine.minDosage} and ${medicine.maxDosage} tablets.`
      );
      return false;
    }

    return true;
  };

  /**
   * Handles the reminder creation process
   * Validates inputs, creates a new reminder object, and adds it to the global state
   * Resets the form fields after successful addition
   */
  const handleAddReminder = () => {
    if (!medicineName.trim() || !dosage.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (selectedHour === null || selectedMinute === null || selectedAmPm === null) {
      Alert.alert("Error", "There was a problem with the time selection. Please try again.");
      return;
    }

    if (!validateMedicine()) {
      return;
    }

    const formattedTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} ${selectedAmPm}`;

    addReminder({ 
      id: Date.now().toString(), 
      name: medicineName, 
      dosage, 
      time: formattedTime,
      slot: selectedSlot 
    });
    // convert selected time to 24h
    const hour24 = selectedAmPm === 'PM' ? (selectedHour % 12) + 12 : (selectedHour % 12);
    const minute = selectedMinute;
    // Send update to ESP32 with time params
    fetch(
      `http://${ESP32_IP}/update?name=${encodeURIComponent(medicineName)}` +
      `&slot=${selectedSlot}&hour=${hour24}&minute=${minute}`
    )
      .then(res => console.log('ESP32 response', res.status))
      .catch(err => console.error('Error sending to ESP32', err));
    Alert.alert("Success", "Reminder added successfully!");
    setMedicineName("");
    setDosage("");
    setSelectedHour(12);
    setSelectedMinute(0);
    setSelectedAmPm("AM");
    setSelectedSlot("1");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Add New Reminder</Text>
            <Text style={styles.subHeader}>Enter your medication details below</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Medicine Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="medical" size={20} color="#4c669f" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Medicine Name"
                  placeholderTextColor="#aaa"
                  value={medicineName}
                  onChangeText={setMedicineName}
                />
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Dosage</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="fitness" size={20} color="#4c669f" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Dosage (e.g., 1 tablet)"
                  placeholderTextColor="#aaa"
                  value={dosage}
                  onChangeText={setDosage}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Slot Number</Text>
              <View style={styles.slotContainer}>
                <Ionicons name="file-tray-full" size={20} color="#4c669f" style={styles.inputIcon} />
                <View style={styles.slotPickerContainer}>
                  <RNPickerSelect
                    placeholder={{}}
                    items={slots}
                    onValueChange={(value: string) => {
                      if (value !== null) {
                        setSelectedSlot(value);
                      }
                    }}
                    value={selectedSlot}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                  <Text style={styles.selectedDisplayText}>Slot {selectedSlot}</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.timeLabel}>Reminder Time</Text>
            <View style={styles.timeContainer}>
              <View style={[styles.pickerWrapper, styles.hourWrapper]}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    placeholder={{}}
                    items={hours}
                    onValueChange={(value: number) => {
                      if (value !== null) {
                        setSelectedHour(value);
                      }
                    }}
                    value={selectedHour}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                  <Text style={styles.selectedDisplayText}>{selectedHour}</Text>
                </View>
              </View>
              
              <View style={[styles.pickerWrapper, styles.minuteWrapper]}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    placeholder={{}}
                    items={minutes}
                    onValueChange={(value: number) => {
                      if (value !== null) {
                        setSelectedMinute(value);
                      }
                    }}
                    value={selectedMinute}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                  <Text style={styles.selectedDisplayText}>
                    {selectedMinute.toString().padStart(2, '0')}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.pickerWrapper, styles.ampmWrapper]}>
                <Text style={styles.pickerLabel}>AM/PM</Text>
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    placeholder={{}}
                    items={ampm}
                    onValueChange={(value: string) => {
                      if (value !== null) {
                        setSelectedAmPm(value);
                      }
                    }}
                    value={selectedAmPm}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                  <Text style={styles.selectedDisplayText}>{selectedAmPm}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddReminder}
            >
              <View style={[styles.buttonGradient, styles.addButtonGradient]}>
                <Text style={styles.buttonText}>Add Reminder</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <View style={[styles.buttonGradient, styles.backButtonGradient]}>
                <Text style={styles.buttonText}>Go Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 30,
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
  subHeader: {
    color: "#e0e0e0",
    fontSize: 16,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    color: '#333',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 5,
  },
  pickerWrapper: {
    alignItems: 'center',
  },
  hourWrapper: {
    width: '28%',
  },
  minuteWrapper: {
    width: '33%',
  },
  ampmWrapper: {
    width: '33%',
  },
  pickerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  pickerContainer: {
    width: '100%',
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  selectedDisplayText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    paddingVertical: 10,
    zIndex: 1,
  },
  buttonGroup: {
    marginTop: 10,
  },
  addButton: {
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backButton: {
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
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
  addButtonGradient: {
    backgroundColor: '#4CAF50',
  },
  backButtonGradient: {
    backgroundColor: '#9e9e9e',
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  slotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  slotPickerContainer: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'transparent',
    paddingRight: 30,
    textAlign: 'center',
    height: 45,
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'transparent',
    paddingRight: 30,
    textAlign: 'center',
    height: 45,
    width: '100%',
  },
  iconContainer: {
    top: '50%',
    right: 5,
    marginTop: -10,
  },
});
