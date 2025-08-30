'use server';
/**
 * @fileOverview A flow for validating if a given Gemini API key is functional.
 *
 * - validateApiKey - A function that checks the validity of a Gemini API key.
 * - ValidateApiKeyInput - The input type for the validateApiKey function.
 * - ValidateApiKeyOutput - The return type for the validateApiKey function.
 */

import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const ValidateApiKeyInputSchema = z.object({
  apiKey: z.string().describe('The Gemini API key to validate.'),
});
export type ValidateApiKeyInput = z.infer<typeof ValidateApiKeyInputSchema>;

const ValidateApiKeyOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the API key is valid or not.'),
  error: z.string().optional().describe('An error message if the key is invalid.'),
});
export type ValidateApiKeyOutput = z.infer<typeof ValidateApiKeyOutputSchema>;

export async function validateApiKey(input: ValidateApiKeyInput): Promise<ValidateApiKeyOutput> {
  // This flow does not need to be defined with ai.defineFlow because it creates its own
  // temporary Genkit instance to test the provided key.

  const testAi = genkit({
    plugins: [googleAI({ apiKey: input.apiKey })],
  });

  try {
    // A lightweight, low-cost operation to check if the key works.
    await testAi.generate({
        model: 'googleai/gemini-pro',
        prompt: "test",
        config: {
            maxOutputTokens: 1
        }
    });
    return { isValid: true };
  } catch (e: any) {
    console.error("API Key validation failed:", e.message);
    return { isValid: false, error: e.message };
  }
}
