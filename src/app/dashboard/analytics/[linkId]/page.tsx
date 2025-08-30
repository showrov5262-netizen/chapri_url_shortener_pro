'use client'

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import AnalyticsView from "@/components/analytics/analytics-view";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Link as LinkType } from "@/types";
import { mockLinks as initialMockLinks } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

// This tells Next.js to render this page on-demand on the server at request time,
// which is crucial for dynamic routes on Vercel to avoid 404 errors.
export const dynamic = 'force-dynamic';

const getLinkFromStorage = (linkId: string): LinkType | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const item = window.localStorage.getItem('mockLinksData');
    const allLinks = item ? JSON.parse(item) : initialMockLinks;
    return allLinks.find((l: LinkType) => l.id === linkId);
  } catch (error) {
    console.error(error);
    // Fallback to initial data if localStorage fails
    return initialMockLinks.find(l => l.id === linkId);
  }
};


export default function AnalyticsPage() {
  const params = useParams();
  const linkId = Array.isArray(params.linkId) ? params.linkId[0] : params.linkId;
  const [link, setLink] = useState<LinkType | undefined | null>(undefined);

  useEffect(() => {
    if (linkId) {
      // We set link state on the client after mount to ensure localStorage is available
      setLink(getLinkFromStorage(linkId));
    }
  }, [linkId]);
  
  // Render a loading skeleton while waiting for client-side data
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
        </div>
    );
  }

  // If the link is explicitly not found after checking, show 404
  if (link === null) {
    notFound();
  }

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
            {link.longUrl}
          </a>
          <Badge variant="secondary">{link.shortCode}</Badge>
        </div>
      </div>
      
      <AnalyticsView link={link} />
    </div>
  );
}
