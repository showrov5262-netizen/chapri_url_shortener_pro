import LoadingPagesView from "@/components/settings/loading-pages-view";
import { mockLoadingPages, mockSettings } from "@/lib/data";

export default function LoadingPagesSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
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
