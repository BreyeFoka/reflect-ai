// src/ai/flows/suggest-journal-prompts.ts
'use server';
/**
 * @fileOverview An AI agent to suggest journal prompts to the user.
 *
 * - suggestJournalPrompts - A function that suggests journal prompts based on past entries and time-based triggers.
 * - SuggestJournalPromptsInput - The input type for the suggestJournalPrompts function.
 * - SuggestJournalPromptsOutput - The return type for the suggestJournalPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestJournalPromptsInputSchema = z.object({
  pastEntries: z
    .string()
    .describe(
      'The user past journal entries to get the context of the journaling and extract goals and patterns.'
    ),
  timeBasedTrigger: z
    .string()
    .describe(
      'The type of time-based trigger (e.g., end of month, new semester) to tailor the prompt to the current time.'
    )
    .optional(),
  userGoals: z
    .string()
    .describe(
      'The user current goals that the journal prompts should be aligned with.'
    )
    .optional(),
});
export type SuggestJournalPromptsInput = z.infer<typeof SuggestJournalPromptsInputSchema>;

const SuggestJournalPromptsOutputSchema = z.object({
  suggestedPrompts: z
    .string()
    .describe('The journal prompts suggested by the AI agent.'),
});
export type SuggestJournalPromptsOutput = z.infer<typeof SuggestJournalPromptsOutputSchema>;

export async function suggestJournalPrompts(
  input: SuggestJournalPromptsInput
): Promise<SuggestJournalPromptsOutput> {
  return suggestJournalPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestJournalPromptsPrompt',
  input: {schema: SuggestJournalPromptsInputSchema},
  output: {schema: SuggestJournalPromptsOutputSchema},
  prompt: `You are a personal growth companion, helping users explore new areas for self-reflection through journal prompts.

  Past Journal Entries: {{{pastEntries}}}
  Time-Based Trigger: {{{timeBasedTrigger}}}
  User Goals: {{{userGoals}}}

  Based on the provided information, suggest three thought-provoking and insightful journal prompts to help the user overcome writer's block and explore new areas for self-reflection.
  The prompts should be diverse and cover different aspects of personal growth, such as emotions, challenges, and values.
  Return the result as a string.
  `,
});

const suggestJournalPromptsFlow = ai.defineFlow(
  {
    name: 'suggestJournalPromptsFlow',
    inputSchema: SuggestJournalPromptsInputSchema,
    outputSchema: SuggestJournalPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
