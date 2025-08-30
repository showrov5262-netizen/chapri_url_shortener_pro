import StatsCards from "@/components/dashboard/stats-cards";
import LinksTable from "@/components/dashboard/links-table";
import { mockLinks } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your links and their performance.
        </p>
      </div>
      <StatsCards links={mockLinks} />
      <LinksTable links={mockLinks} />
    </div>
  );
}
