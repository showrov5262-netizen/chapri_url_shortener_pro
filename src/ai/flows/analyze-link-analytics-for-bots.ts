'use server';
/**
 * @fileOverview A flow for analyzing link analytics and highlighting potential bot or scanner counts in the reports.
 *
 * - analyzeLinkAnalyticsForBots - A function that analyzes link analytics for bot traffic.
 * - AnalyzeLinkAnalyticsForBotsInput - The input type for the analyzeLinkAnalyticsForBots function.
 * - AnalyzeLinkAnalyticsForBotsOutput - The return type for the analyzeLinkAnalyticsForBots function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLinkAnalyticsForBotsInputSchema = z.object({
  linkId: z.string().describe('The ID of the link to analyze.'),
  clickData: z.string().describe('A summary of the click data for the link, including IP addresses, user agents, and referrers.'),
});
export type AnalyzeLinkAnalyticsForBotsInput = z.infer<typeof AnalyzeLinkAnalyticsForBotsInputSchema>;

const AnalyzeLinkAnalyticsForBotsOutputSchema = z.object({
  botCount: z.number().describe('The estimated number of bot clicks.'),
  scannerCount: z.number().describe('The estimated number of scanner clicks.'),
  potentialBots: z.array(z.string()).describe('A list of potential bot IP addresses.'),
  potentialScanners: z.array(z.string()).describe('A list of potential scanner IP addresses.'),
  summary: z.string().describe('A summary of the analysis, highlighting potential bot or scanner activity.'),
});
export type AnalyzeLinkAnalyticsForBotsOutput = z.infer<typeof AnalyzeLinkAnalyticsForBotsOutputSchema>;

export async function analyzeLinkAnalyticsForBots(input: AnalyzeLinkAnalyticsForBotsInput): Promise<AnalyzeLinkAnalyticsForBotsOutput> {
  return analyzeLinkAnalyticsForBotsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeLinkAnalyticsForBotsPrompt',
  input: {schema: AnalyzeLinkAnalyticsForBotsInputSchema},
  output: {schema: AnalyzeLinkAnalyticsForBotsOutputSchema},
  prompt: `You are an expert in analyzing link analytics data to identify and filter out bot traffic.

  Given the following link analytics data, analyze the data and identify potential bot and scanner activity.

  Link ID: {{{linkId}}}
  Click Data Summary: {{{clickData}}}

  Provide the estimated number of bot clicks, the estimated number of scanner clicks, a list of potential bot IP addresses, a list of potential scanner IP addresses, and a summary of the analysis, highlighting potential bot or scanner activity.

  Make sure you return your answer in JSON format.
  `,
});

const analyzeLinkAnalyticsForBotsFlow = ai.defineFlow(
  {
    name: 'analyzeLinkAnalyticsForBotsFlow',
    inputSchema: AnalyzeLinkAnalyticsForBotsInputSchema,
    outputSchema: AnalyzeLinkAnalyticsForBotsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
