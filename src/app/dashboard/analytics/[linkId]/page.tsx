
'use client'

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import AnalyticsView from "@/components/analytics/analytics-view";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Link as LinkType } from "@/types";
import { mockLinks as initialMockLinks } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiState } from "@/hooks/use-ai-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

const getLinkFromStorage = (linkId: string): LinkType | undefined | null => {
  if (typeof window === 'undefined') return undefined;
  try {
    const item = window.localStorage.getItem('mockLinksData');
    if (!item) {
        return initialMockLinks.find(l => l.id === linkId) || null;
    }
    const allLinks: LinkType[] = JSON.parse(item);
    return allLinks.find((l) => l.id === linkId) || null;
  } catch (error) {
    console.error("Failed to parse from localStorage", error);
    return initialMockLinks.find(l => l.id === linkId) || null;
  }
};


export default function AnalyticsPage() {
  const params = useParams();
  const linkId = Array.isArray(params.linkId) ? params.linkId[0] : params.linkId;
  const [link, setLink] = useState<LinkType | undefined | null>(undefined);
  const { status: aiStatus } = useAiState();
  const isAiConfigured = aiStatus === 'valid';

  useEffect(() => {
    if (linkId) {
      const foundLink = getLinkFromStorage(linkId);
      setLink(foundLink);
    }
  }, [linkId]);
  
  // This is the loading state. It shows a skeleton UI until the link data is fully loaded.
  if (link === undefined) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-10 w-3/4 mb-2" />
                <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="h-5 w-1/2" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full lg:col-span-2" />
                <Skeleton className="h-28 w-full" />
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-80 w-full lg:col-span-3" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  // If we've checked storage and the link is not there, show a 404.
  if (link === null) {
    notFound();
  }

  // Only render the main content if we have a valid link object.
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold font-headline tracking-tight">{link.title}</h1>
        <div className="flex items-center gap-2 mt-1">
          <a href={link.longUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate max-w-md">
            {link.useBase64Encoding ? atob(link.longUrl) : link.longUrl}
          </a>
          <Badge variant="secondary">{link.shortCode}</Badge>
        </div>
      </div>
      
      {!isAiConfigured && (
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>AI Features Disabled</AlertTitle>
            <AlertDescription>
                <div className="flex items-center justify-between">
                    <span>To enable AI-powered summaries and bot detection, please configure your API key in the settings.</span>
                    <Button asChild variant="secondary" size="sm">
                        <Link href="/dashboard/settings/ai">Configure AI</Link>
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
      )}
      
      {/* This check is crucial. It ensures AnalyticsView only renders when link is fully loaded. */}
      {link && <AnalyticsView link={link} />}

    </div>
  );
}
