import type { Link } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon, MousePointerClick, TrendingUp } from "lucide-react";

export default function StatsCards({ links }: { links: Link[] }) {
  const totalLinks = links.length;
  const totalClicks = links.reduce((acc, link) => acc + link.clicks.length, 0);
  const averageClicks = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Links</CardTitle>
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLinks.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Number of shortened links created
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          <MousePointerClick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Across all of your links
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Clicks / Link</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageClicks.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Average performance of a link
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
