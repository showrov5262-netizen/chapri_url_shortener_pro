'use server';
/**
 * @fileOverview A flow for summarizing link analytics using AI.
 *
 * - summarizeLinkAnalytics - A function that takes link analytics data and returns a concise summary.
 * - SummarizeLinkAnalyticsInput - The input type for the summarizeLinkAnalytics function.
 * - SummarizeLinkAnalyticsOutput - The return type for the summarizeLinkAnalytics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLinkAnalyticsInputSchema = z.object({
  clickCount: z.number().describe('The total number of clicks for the link.'),
  geographicData: z.string().describe('JSON string containing geographic data (country, city, region) of clicks.'),
  deviceData: z.string().describe('JSON string containing device information (desktop, mobile, tablet) of clicks.'),
  referrerData: z.string().describe('JSON string containing referrer information (direct, social media, email) of clicks.'),
  peakUsageTimes: z.string().describe('JSON string containing peak usage times of the link.'),
  botClickCount: z.number().describe('The number of bot clicks for the link.'),
  scannerClickCount: z.number().describe('The number of scanner clicks for the link.'),
});
export type SummarizeLinkAnalyticsInput = z.infer<typeof SummarizeLinkAnalyticsInputSchema>;

const SummarizeLinkAnalyticsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the link analytics, highlighting key trends and insights.'),
});
export type SummarizeLinkAnalyticsOutput = z.infer<typeof SummarizeLinkAnalyticsOutputSchema>;

export async function summarizeLinkAnalytics(input: SummarizeLinkAnalyticsInput): Promise<SummarizeLinkAnalyticsOutput> {
  return summarizeLinkAnalyticsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLinkAnalyticsPrompt',
  input: {schema: SummarizeLinkAnalyticsInputSchema},
  output: {schema: SummarizeLinkAnalyticsOutputSchema},
  prompt: `You are an AI assistant that summarizes link analytics data to provide quick insights.

  Here's the link analytics data:
  Total Clicks: {{{clickCount}}}
  Geographic Data: {{{geographicData}}}
  Device Data: {{{deviceData}}}
  Referrer Data: {{{referrerData}}}
  Peak Usage Times: {{{peakUsageTimes}}}
  Bot Clicks: {{{botClickCount}}}
  Scanner Clicks: {{{scannerClickCount}}}

  Provide a concise summary (2-3 sentences) highlighting key trends and insights, such as peak usage times, top referrers, and geographic distribution of clicks. Mention the number of bot and scanner clicks if they are significant (e.g., more than 10% of total clicks).`,
});

const summarizeLinkAnalyticsFlow = ai.defineFlow(
  {
    name: 'summarizeLinkAnalyticsFlow',
    inputSchema: SummarizeLinkAnalyticsInputSchema,
    outputSchema: SummarizeLinkAnalyticsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
