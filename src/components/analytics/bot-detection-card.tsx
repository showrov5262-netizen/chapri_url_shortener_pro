'use client'

import { useState, useEffect } from "react";
import type { Link } from "@/types";
import { analyzeLinkAnalyticsForBots } from "@/ai/flows/analyze-link-analytics-for-bots";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useAiState } from "@/hooks/use-ai-state";

function formatClickData(link: Link) {
    // Return a string summary of the first 50 clicks for brevity in the prompt
    return link.clicks.slice(0, 50).map(c => 
        `IP: ${c.ipAddress}, Agent: ${c.browser}/${c.os}, Referrer: ${c.referrer}`
    ).join('; ');
}

export default function BotDetectionCard({ link }: { link: Link }) {
  const [botCount, setBotCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { status: aiStatus } = useAiState();
  const isAiConfigured = aiStatus === 'valid';

  useEffect(() => {
    // If AI is not set up, just show the mock count and stop.
    if (!isAiConfigured) {
        const mockBotCount = link.clicks.filter(c => c.isBot).length;
        setBotCount(mockBotCount);
        setLoading(false);
        return;
    }
    
    // Only run if the link data is available.
    if (!link || !link.id) return;
    
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the Genkit flow
        const result = await analyzeLinkAnalyticsForBots({
          linkId: link.id,
          clickData: formatClickData(link),
        });
        // In a real scenario, you'd use result.botCount.
        // For mock data, we use our pre-calculated bot count for consistency.
        const mockBotCount = link.clicks.filter(c => c.isBot).length;
        setBotCount(mockBotCount);
      } catch (e) {
        console.error(e);
        setError("Failed to analyze bot traffic.");
        // Fallback to mock data on error
        const mockBotCount = link.clicks.filter(c => c.isBot).length;
        setBotCount(mockBotCount);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [link, isAiConfigured]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bot & Scanner Clicks</CardTitle>
        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
            <Skeleton className="h-8 w-1/2" />
        ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
        ) : (
            <div className="text-2xl font-bold">{botCount}</div>
        )}
        <p className="text-xs text-muted-foreground">
          Estimated non-human clicks filtered
        </p>
      </CardContent>
    </Card>
  );
}
