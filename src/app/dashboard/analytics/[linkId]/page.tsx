import { mockLinks } from "@/lib/data";
import { notFound } from "next/navigation";
import AnalyticsView from "@/components/analytics/analytics-view";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage({ params }: { params: { linkId: string } }) {
  const link = mockLinks.find((l) => l.id === params.linkId);

  if (!link) {
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
