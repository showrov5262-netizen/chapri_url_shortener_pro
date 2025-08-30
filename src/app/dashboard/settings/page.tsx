import FeatureToggles from "@/components/settings/feature-toggles";
import { mockSettings } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Loader } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage global defaults for your link shortener features and security.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
            <CardTitle>AI Provider Configuration</CardTitle>
            <CardDescription>
                Manage the API key for the generative AI features in this application.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/dashboard/settings/ai">
                    <Button variant="outline">
                        Configure AI Settings
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle>Loading Pages</CardTitle>
            <CardDescription>
                Customize what users see during a redirect delay.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/dashboard/settings/loading-pages">
                    <Button variant="outline">
                        Manage Loading Pages
                        <Loader className="h-4 w-4 mr-2" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </div>
      <FeatureToggles initialSettings={mockSettings} />
    </div>
  );
}
