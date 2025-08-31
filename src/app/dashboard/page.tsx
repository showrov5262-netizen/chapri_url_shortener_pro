

'use client'

import { useState, useEffect } from "react";
import StatsCards from "@/components/dashboard/stats-cards";
import LinksTable from "@/components/dashboard/links-table";
import type { Link } from "@/types";
import { getLinks, addLink as apiAddLink, updateLink as apiUpdateLink, deleteLink as apiDeleteLink } from "@/lib/server-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // This effect runs only on the client-side
    const fetchLinks = async () => {
        try {
            const serverLinks = await getLinks();
            setLinks(serverLinks);
        } catch (error) {
            console.error("Failed to fetch links from server", error);
        } finally {
            setIsLoaded(true);
        }
    }
    fetchLinks();
  }, []);

  const addLink = async (newLinkData: Omit<Link, 'id' | 'createdAt' | 'clicks'>) => {
    try {
        const newLink = await apiAddLink(newLinkData);
        setLinks(prevLinks => [newLink, ...prevLinks]);
    } catch (error) {
        console.error("Failed to add link:", error);
    }
  };
  
  const updateLink = async (updatedLinkData: Link) => {
    try {
        const updatedLink = await apiUpdateLink(updatedLinkData);
        setLinks(prevLinks => prevLinks.map(link => link.id === updatedLink.id ? updatedLink : link));
    } catch (error) {
        console.error("Failed to update link:", error);
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
        await apiDeleteLink(linkId);
        setLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));
    } catch (error) {
        console.error("Failed to delete link:", error);
    }
  }

  if (!isLoaded) {
      return (
        <div className="flex flex-col gap-8">
            <div>
                <Skeleton className="h-10 w-1/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
            <div className="rounded-lg border shadow-sm">
                 <div className="p-4">
                    <Skeleton className="h-10 w-full" />
                 </div>
            </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your links and their performance.
        </p>
      </div>
      <StatsCards links={links} />
      <LinksTable 
        links={links} 
        onAddLink={addLink} 
        onUpdateLink={updateLink}
        onDeleteLink={deleteLink} 
      />
    </div>
  );
}
