'use client'

import { useState, useEffect } from "react";
import type { Link } from "@/types";
import { summarizeLinkAnalytics } from "@/ai/flows/summarize-link-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, FileText } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useAiState } from "@/hooks/use-ai-state";

function processAnalyticsData(link: Link) {
  const geoData: { [key: string]: number } = {};
  const deviceData: { [key: string]: number } = {};
  const referrerData: { [key: string]: number } = {};
  const peakUsage: { [key: string]: number } = {};

  link.clicks.forEach(click => {
    geoData[click.country] = (geoData[click.country] || 0) + 1;
    deviceData[click.device] = (deviceData[click.device] || 0) + 1;
    referrerData[click.referrer] = (referrerData[click.referrer] || 0) + 1;
    const hour = new Date(click.clickedAt).getHours();
    const hourKey = `${hour}:00-${hour+1}:00`;
    peakUsage[hourKey] = (peakUsage[hourKey] || 0) + 1;
  });

  return {
    geographicData: JSON.stringify(geoData),
    deviceData: JSON.stringify(deviceData),
    referrerData: JSON.stringify(referrerData),
    peakUsageTimes: JSON.stringify(peakUsage),
  };
}

export default function SummaryCard({ link }: { link: Link }) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { status: aiStatus } = useAiState();
  const isAiConfigured = aiStatus === 'valid';

  useEffect(() => {
    if (!isAiConfigured) {
        setSummary("AI is not configured. Please add a valid API key in settings to enable summaries.");
        setLoading(false);
        return;
    }
    
    // Only run if the link data is available.
    if (!link || !link.id) return;

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const processedData = processAnalyticsData(link);
        const botClicks = link.clicks.filter(c => c.isBot).length;
        const result = await summarizeLinkAnalytics({
          clickCount: link.clicks.length,
          ...processedData,
          botClickCount: botClicks,
          scannerClickCount: 0, // Assuming scanner clicks are a subset of bot clicks for now
        });
        setSummary(result.summary);
      } catch (e) {
        console.error(e);
        setError("Failed to generate summary.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [link, isAiConfigured]);

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Summary</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
}
