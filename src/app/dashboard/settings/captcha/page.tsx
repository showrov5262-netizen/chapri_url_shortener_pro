import CaptchaConfigView from "@/components/settings/captcha-config-view";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CaptchaSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
       <div>
        <Link href="/dashboard/settings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Settings
        </Link>
        <h1 className="text-3xl font-bold font-headline tracking-tight">CAPTCHA Configuration</h1>
        <p className="text-muted-foreground">
            Protect your links from bots by requiring a CAPTCHA verification.
        </p>
      </div>
      <CaptchaConfigView />
    </div>
  );
}
