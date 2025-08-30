import ApiKeyConfig from "@/components/settings/api-key-config";
import FeatureToggles from "@/components/settings/feature-toggles";
import { mockSettings } from "@/lib/data";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage global defaults for your link shortener features and security.
        </p>
      </div>
      <ApiKeyConfig />
      <FeatureToggles initialSettings={mockSettings} />
    </div>
  );
}
