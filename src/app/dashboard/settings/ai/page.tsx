import AiConfigView from "@/components/settings/ai-config-view";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AiSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
       <div>
        <Link href="/dashboard/settings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Settings
        </Link>
        <h1 className="text-3xl font-bold font-headline tracking-tight">AI Configuration</h1>
        <p className="text-muted-foreground">
            Manage and verify your connection to AI providers.
        </p>
      </div>
      <AiConfigView />
    </div>
  );
}
