'use client'

import { useState } from "react";
import StatsCards from "@/components/dashboard/stats-cards";
import LinksTable from "@/components/dashboard/links-table";
import { mockLinks } from "@/lib/data";
import type { Link } from "@/types";

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>(mockLinks);

  const addLink = (newLinkData: Omit<Link, 'id' | 'createdAt' | 'clicks' | 'shortCode'>) => {
    const newLink: Link = {
      ...newLinkData,
      id: (links.length + 2).toString(),
      shortCode: newLinkData.shortCode || Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString(),
      clicks: [],
    };
    setLinks(prevLinks => [newLink, ...prevLinks]);
  };

  const deleteLink = (linkId: string) => {
    setLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));
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
      <LinksTable links={links} onAddLink={addLink} onDeleteLink={deleteLink} />
    </div>
  );
}
