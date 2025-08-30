import LoadingPagesView from "@/components/settings/loading-pages-view";
import { mockLoadingPages, mockSettings } from "@/lib/data";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function LoadingPagesSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/dashboard/settings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Settings
        </Link>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Loading Pages</h1>
        <p className="text-muted-foreground">
          Configure a custom loading page to show users during a meta refresh redirect delay.
        </p>
      </div>
      <LoadingPagesView 
        initialSettings={mockSettings.loadingPageSettings}
        loadingPages={mockLoadingPages}
      />
    </div>
  );
}
