import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { RemindersContext } from "./ReminderContext"; // Updated import
import RNPickerSelect from 'react-native-picker-select';

// Expanded list of valid medicines and their dosage ranges
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

export default function AddReminderScreen({ navigation }: { navigation: any }) {
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedAmPm, setSelectedAmPm] = useState<string>("AM");
  const { addReminder } = useContext(RemindersContext);

  const hours = Array.from({ length: 12 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1) }));
  const minutes = Array.from({ length: 60 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i }));
  const ampm = [{ label: "AM", value: "AM" }, { label: "PM", value: "PM" }];

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

    addReminder({ id: Date.now().toString(), name: medicineName, dosage, time: formattedTime });
    Alert.alert("Success", "Reminder added successfully!");
    setMedicineName("");
    setDosage("");
    setSelectedHour(12);
    setSelectedMinute(0);
    setSelectedAmPm("AM");
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
