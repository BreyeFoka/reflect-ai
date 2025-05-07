"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { JournalEntryForm } from '@/components/JournalEntryForm';
import { ReflectionList } from '@/components/ReflectionList';
import { PromptGenerator } from '@/components/PromptGenerator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getJournalEntries } from '@/lib/localStorage';
import type { JournalEntry } from '@/types';
import { BookOpenText, BrainCircuit, Feather } from 'lucide-react';

export default function HomePage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setEntries(getJournalEntries());
      setIsLoadingEntries(false);
    }
  }, []);

  const handleEntrySaved = useCallback(() => {
    if (typeof window !== 'undefined') {
      setEntries(getJournalEntries());
    }
  }, []);

  if (!isClient) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-lg text-foreground">Loading ReflectAI...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-primary">ReflectAI</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-10 md:gap-12">
          <section aria-labelledby="journal-entry-section">
            <h2 id="journal-entry-section" className="sr-only">New Journal Entry</h2>
            <JournalEntryForm onEntrySaved={handleEntrySaved} />
          </section>

          <section aria-labelledby="ai-prompts-section">
             <h2 id="ai-prompts-section" className="sr-only">AI Generated Prompts</h2>
            <PromptGenerator />
          </section>

          <section aria-labelledby="reflections-section">
            <div className="flex items-center gap-3 mb-6">
              <BookOpenText className="h-7 w-7 text-primary" />
              <h2 id="reflections-section" className="text-2xl font-semibold text-foreground">
                Your Reflections
              </h2>
            </div>
            <ReflectionList entries={entries} isLoading={isLoadingEntries} />
          </section>
        </div>
      </main>

      <footer className="py-8 mt-16 border-t border-border/40 bg-background/95">
        <div className="container max-w-5xl text-center text-sm text-muted-foreground px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} ReflectAI. Cultivate self-awareness, one reflection at a time.</p>
          <p className="mt-1">Powered by AI <Feather className="inline h-4 w-4 text-primary" />, designed for your growth.</p>
        </div>
      </footer>
    </div>
  );
}
