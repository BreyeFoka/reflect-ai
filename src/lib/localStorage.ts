"use client";

import type { JournalEntry } from '@/types';

const ENTRIES_KEY = 'reflectai-journal-entries';

export function getJournalEntries(): JournalEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedEntries = localStorage.getItem(ENTRIES_KEY);
    if (storedEntries) {
      const parsedEntries = JSON.parse(storedEntries) as JournalEntry[];
      // Ensure entries are sorted by timestamp descending (most recent first)
      return parsedEntries.sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (error) {
    console.error("Error parsing journal entries from localStorage:", error);
    // localStorage.removeItem(ENTRIES_KEY); // Optionally clear corrupted data
  }
  return [];
}

export function saveJournalEntry(entry: JournalEntry): void {
  if (typeof window === 'undefined') {
    return;
  }
  const entries = getJournalEntries();
  // Add new entry and re-sort to maintain descending order by timestamp
  const updatedEntries = [...entries.filter(e => e.id !== entry.id), entry].sort((a, b) => b.timestamp - a.timestamp);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));
}

export function addJournalEntry(newEntryContent: string): JournalEntry {
  const newEntry: JournalEntry = {
    id: crypto.randomUUID(),
    content: newEntryContent,
    date: new Date().toISOString(),
    timestamp: Date.now(),
  };
  saveJournalEntry(newEntry);
  return newEntry;
}

export function getAllJournalContent(): string {
  if (typeof window === 'undefined') {
    return "";
  }
  const entries = getJournalEntries();
  // Sort by timestamp ascending to give chronological context to AI
  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  return sortedEntries.map(entry => `Date: ${new Date(entry.date).toLocaleDateString()}\n${entry.content}`).join("\n\n---\n\n");
}
