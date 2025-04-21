/**
 * ReminderContext.tsx
 * 
 * This file defines the React Context used for global state management
 * of medicine reminders throughout the application.
 * 
 * It provides a centralized way to:
 * - Store all medication reminders
 * - Add new reminders
 * - Delete existing reminders
 */
import { createContext } from 'react';

/**
 * Reminder Interface
 * 
 * Defines the structure of a medication reminder object
 * 
 * @property {string} id - Unique identifier for the reminder
 * @property {string} name - Name of the medication
 * @property {string} dosage - Dosage information (e.g., "1 tablet")
 * @property {string} time - Time to take the medication in format "HH:MM AM/PM"
 * @property {string} slot - Medicine slot number in the dispenser
 */
export interface Reminder {
  id: string;
  name: string;
  dosage: string;
  time: string;
  slot: string; // Added slot property
}

/**
 * RemindersContextType Interface
 * 
 * Defines the structure of the context object
 * 
 * @property {Reminder[]} reminders - Array of all medication reminders
 * @property {Function} addReminder - Function to add a new reminder
 * @property {Function} deleteReminder - Function to delete an existing reminder by ID
 */
export interface RemindersContextType {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
}

/**
 * RemindersContext
 * 
 * React Context for global state management of reminders.
 * Initialized with empty default values that will be overridden
 * by the actual provider in index.tsx.
 */
export const RemindersContext = createContext<RemindersContextType>({
  reminders: [],
  addReminder: () => {},
  deleteReminder: () => {},
});
