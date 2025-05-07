export interface JournalEntry {
  id: string;
  content: string;
  date: string; // ISO string
  timestamp: number;
  // Optional fields for future enhancements
  // themes?: string[];
  // sentiment?: string;
}
