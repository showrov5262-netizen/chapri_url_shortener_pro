
'use client'

import { useState, useEffect } from "react";
import StatsCards from "@/components/dashboard/stats-cards";
import LinksTable from "@/components/dashboard/links-table";
import { mockLinks as initialMockLinks } from "@/lib/data";
import type { Link } from "@/types";

// In a real app, this would be an API call to a database.
// For this prototype, we use localStorage to simulate persistence.
const useLinksState = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // This effect runs only on the client-side
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem('mockLinksData');
        // Initialize with default mock data if localStorage is empty
        if (!item) {
          window.localStorage.setItem('mockLinksData', JSON.stringify(initialMockLinks));
          setLinks(initialMockLinks);
        } else {
          setLinks(JSON.parse(item));
        }
      } catch (error) {
        console.error("Failed to parse links from localStorage", error);
        setLinks(initialMockLinks);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  const updateLinks = (newLinks: Link[]) => {
    setLinks(newLinks);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('mockLinksData', JSON.stringify(newLinks));
      } catch (error) {
        console.error("Failed to save links to localStorage", error);
      }
    }
  };

  return { links, updateLinks, isLoaded };
};

export default function DashboardPage() {
  const { links, updateLinks, isLoaded } = useLinksState();

  const addLink = (newLinkData: Omit<Link, 'id' | 'createdAt' | 'clicks'>) => {
    const newLink: Link = {
      ...newLinkData,
      id: `link-${Date.now()}`,
      createdAt: new Date().toISOString(),
      clicks: [],
    };
    updateLinks([newLink, ...links]);
  };
  
  const updateLink = (updatedLinkData: Link) => {
    updateLinks(links.map(link => link.id === updatedLinkData.id ? updatedLinkData : link));
  };

  const deleteLink = (linkId: string) => {
    updateLinks(links.filter(link => link.id !== linkId));
  }

  if (!isLoaded) {
      return <div>Loading links...</div>; // Or a proper skeleton loader
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
