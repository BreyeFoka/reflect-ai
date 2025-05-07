"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { suggestJournalPrompts } from '@/ai/flows/suggest-journal-prompts';
import type { SuggestJournalPromptsInput } from '@/ai/flows/suggest-journal-prompts';
import { Lightbulb } from 'lucide-react';
import { getAllJournalContent } from '@/lib/localStorage';

export function PromptGenerator() {
  const [prompts, setPrompts] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isMounted = React.useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);


  const fetchPrompts = useCallback(async () => {
    if (!isMounted.current) return;
    setIsLoading(true);
    setPrompts(null);

    try {
      const pastEntries = getAllJournalContent();
      if (!pastEntries.trim()) {
         if (isMounted.current) {
            setPrompts("Write a few journal entries first, and I'll suggest some personalized prompts for you!");
            setIsLoading(false);
         }
        return;
      }

      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      let timeBasedTrigger: string | undefined = undefined;
      
      if (daysInMonth - currentDay <= 3) { 
        timeBasedTrigger = "end of month reflection";
      } else if (currentDay <= 3) {
         timeBasedTrigger = "start of month planning";
      }
      // Could add semester start/end based on common academic calendars if desired
      // e.g. if (currentDate.getMonth() === 0 && currentDay <= 15) timeBasedTrigger = "new semester start";

      const input: SuggestJournalPromptsInput = {
        pastEntries,
        timeBasedTrigger
      };
      
      const result = await suggestJournalPrompts(input);
      if (isMounted.current) {
        setPrompts(result.suggestedPrompts);
      }

    } catch (error) {
      console.error("Error generating prompts:", error);
      if (isMounted.current) {
        toast({
          title: "Prompt Generation Failed",
          description: "Could not generate prompts. Please try again later.",
          variant: "destructive",
        });
         setPrompts("Sorry, I couldn't generate prompts right now. Please try again in a bit.");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [toast]);

  return (
    <Card className="shadow-lg bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium text-card-foreground">AI Journal Prompts</CardTitle>
        <Lightbulb className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 text-muted-foreground">
          Need inspiration? Get AI-generated prompts based on your past reflections.
        </CardDescription>
        
        <Button onClick={fetchPrompts} disabled={isLoading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
          {isLoading ? 'Generating...' : 'Suggest Prompts'}
        </Button>

        {isLoading && (
          <div className="mt-6 space-y-2">
            <Skeleton className="h-5 w-full bg-muted" />
            <Skeleton className="h-5 w-5/6 bg-muted" />
            <Skeleton className="h-5 w-3/4 bg-muted" />
          </div>
        )}

        {prompts && !isLoading && (
          <div className="mt-6 space-y-3 text-sm text-card-foreground">
            <h4 className="font-semibold">Here are some ideas for your next entry:</h4>
            <ul className="list-disc list-inside space-y-2 pl-2">
              {prompts.split('\n').filter(p => p.trim().length > 0 && p.trim() !== '-').map((prompt, index) => (
                <li key={index} className="leading-relaxed">{prompt.replace(/^-\s*/, '').trim()}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
