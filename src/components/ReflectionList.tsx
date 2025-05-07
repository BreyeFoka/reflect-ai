"use client";

import React, { useMemo } from 'react';
import type { JournalEntry } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO, compareDesc } from 'date-fns';
import { ScrollText } from 'lucide-react';

interface ReflectionListProps {
  entries: JournalEntry[];
  isLoading: boolean;
}

interface GroupedEntries {
  [key: string]: JournalEntry[];
}

export function ReflectionList({ entries, isLoading }: ReflectionListProps) {
  const groupedEntries = useMemo(() => {
    if (!entries || entries.length === 0) return {};
    // Entries are already sorted by timestamp descending from localStorage getter
    return entries.reduce((acc: GroupedEntries, entry) => {
      try {
        const monthYear = format(parseISO(entry.date), 'MMMM yyyy');
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(entry); // Entries within a month will retain their reverse chrono order
      } catch (error) {
        console.error("Error parsing date for entry:", entry, error);
      }
      return acc;
    }, {});
  }, [entries]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-7 w-1/3 mb-4" />
            <div className="space-y-4">
              {[...Array(2)].map((_, j) => (
                <Card key={j}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const monthKeys = Object.keys(groupedEntries);

  if (monthKeys.length === 0) {
    return (
      <Card className="text-center py-12 shadow-md">
        <CardContent className="flex flex-col items-center gap-4">
          <ScrollText className="h-16 w-16 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">No reflections yet.</p>
          <p className="text-sm text-muted-foreground">Start by writing your first journal entry above!</p>
        </CardContent>
      </Card>
    );
  }
  
  // Sort monthKeys so that most recent months appear first
  const sortedMonthKeys = monthKeys.sort((a, b) => {
    // Create a comparable date from "MMMM yyyy" string.
    // Using the first day of the month for comparison.
    const dateA = parseISO(`01 ${a}`); 
    const dateB = parseISO(`01 ${b}`);
    return compareDesc(dateA, dateB); // compareDesc for reverse chronological
  });


  return (
    <div className="space-y-8">
      {sortedMonthKeys.map((monthYear) => (
        <section key={monthYear} aria-labelledby={`month-${monthYear.replace(/\s+/g, '-')}`}>
          <h3 id={`month-${monthYear.replace(/\s+/g, '-')}`} className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
            {monthYear}
          </h3>
          <div className="space-y-4">
            {groupedEntries[monthYear].map((entry) => (
              <Card key={entry.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">
                    {format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                  <CardDescription>
                    {format(parseISO(entry.date), 'p')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
