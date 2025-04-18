import { createContext } from 'react';

// Define the Reminder interface
export interface Reminder {
  id: string;
  name: string;
  dosage: string;
  time: string;
  slot: string; // Added slot property
}

// Define the context type
export interface RemindersContextType {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
}

// Create and export the context
export const RemindersContext = createContext<RemindersContextType>({
  reminders: [],
  addReminder: () => {},
  deleteReminder: () => {},
});
