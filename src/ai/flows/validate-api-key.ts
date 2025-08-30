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
  
  // Trim whitespace from the API key, which is a common copy-paste error.
  const trimmedApiKey = input.apiKey.trim();
  if (!trimmedApiKey) {
    return { isValid: false, error: "API key is empty." };
  }

  const testAi = genkit({
    plugins: [googleAI({ apiKey: trimmedApiKey })],
  });

  try {
    // A lightweight, low-cost operation to check if the key works.
    await testAi.generate({
        model: 'gemini-pro', // Using a stable model for validation
        prompt: "test",
        config: {
            maxOutputTokens: 1,
            temperature: 0
        }
    });
    return { isValid: true };
  } catch (e: any) {
    console.error("API Key validation failed:", e);
    // Provide a more user-friendly error message
    let errorMessage = "An unknown error occurred.";
    if (e.message) {
      if (e.message.includes('API key not valid')) {
        errorMessage = 'The provided API key is not valid. Please check the key and try again.';
      } else if (e.message.includes('500')) {
        errorMessage = `[Google AI Server Error]: ${e.message}. This may be a temporary issue with the service. Please try again later.`;
      } else {
        errorMessage = e.message;
      }
    }
    return { isValid: false, error: errorMessage };
  }
}
