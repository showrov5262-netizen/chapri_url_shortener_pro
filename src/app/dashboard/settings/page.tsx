import FeatureToggles from "@/components/settings/feature-toggles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage global defaults for your link shortener features and security.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <CardTitle>CAPTCHA Configuration</CardTitle>
            <CardDescription>
                Set up Google reCAPTCHA to protect your links from bots.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/dashboard/settings/captcha">
                    <Button variant="outline">
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Configure CAPTCHA
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </div>
      <FeatureToggles />
    </div>
  );
}
