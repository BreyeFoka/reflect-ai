"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addJournalEntry } from '@/lib/localStorage';
import { Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JournalEntryFormProps {
  onEntrySaved: () => void;
}

export function JournalEntryForm({ onEntrySaved }: JournalEntryFormProps) {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Empty Entry",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      addJournalEntry(content);
      toast({
        title: "Reflection Saved",
        description: "Your thoughts are safely stored.",
      });
      setContent('');
      onEntrySaved();
    } catch (error) {
      console.error("Failed to save entry:", error);
      toast({
        title: "Error",
        description: "Could not save your reflection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">New Reflection</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Reflect on your experiences, emotions, or goals..."
            rows={8}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary bg-card"
            aria-label="Journal Entry Input"
            disabled={isSaving}
          />
          <Button type="submit" disabled={isSaving || !content.trim()} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Send className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Reflection'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
