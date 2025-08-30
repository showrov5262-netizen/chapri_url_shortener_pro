'use client'

import { useState } from "react";
import type { Settings } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "../ui/input";

export default function FeatureToggles({ initialSettings }: { initialSettings: Settings }) {
  const [settings, setSettings] = useState(initialSettings);

  const handleToggle = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] as any }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({...prev, [id]: value }));
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Global Security Settings</CardTitle>
          <CardDescription>
            Default security settings for all newly created links.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="bot-detection" className="flex flex-col gap-1">
                <span>Bot Detection</span>
                <span className="font-normal text-muted-foreground text-xs">
                    Enable AI-powered bot filtering.
                </span>
            </Label>
            <Switch
              id="botDetection"
              checked={settings.botDetection}
              onCheckedChange={() => handleToggle('botDetection')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-scanner" className="flex flex-col gap-1">
                <span>Email Scanner Protection</span>
                <span className="font-normal text-muted-foreground text-xs">
                    Protect against preview bots in emails.
                </span>
            </Label>
            <Switch
              id="emailScannerProtection"
              checked={settings.emailScannerProtection}
              onCheckedChange={() => handleToggle('emailScannerProtection')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="captcha" className="flex flex-col gap-1">
                <span>CAPTCHA Verification</span>
                 <span className="font-normal text-muted-foreground text-xs">
                    Require users to solve a CAPTCHA.
                </span>
            </Label>
            <Switch
              id="captchaVerification"
              checked={settings.captchaVerification}
              onCheckedChange={() => handleToggle('captchaVerification')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="rate-limiting" className="flex flex-col gap-1">
                <span>IP-based Rate Limiting</span>
                 <span className="font-normal text-muted-foreground text-xs">
                    Prevent abuse from single IP addresses.
                </span>
            </Label>
            <Switch
              id="ipRateLimiting"
              checked={settings.ipRateLimiting}
              onCheckedChange={() => handleToggle('ipRateLimiting')}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Global Link Behavior</CardTitle>
          <CardDescription>
            Default behavior and customization for new links.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center justify-between">
            <Label htmlFor="link-cloaking" className="flex flex-col gap-1">
                <span>Link Cloaking</span>
                 <span className="font-normal text-muted-foreground text-xs">
                    Enable link cloaking by default for new links.
                </span>
            </Label>
            <Switch
              id="linkCloaking"
              checked={settings.linkCloaking}
              onCheckedChange={() => handleToggle('linkCloaking')}
            />
          </div>
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="fake-previews" className="flex flex-col gap-1">
                  <span>Fake Preview Pages</span>
                  <span className="font-normal text-muted-foreground text-xs">
                      Enable intermediate preview pages by default.
                  </span>
              </Label>
              <Switch
                id="fakePreviewPages"
                checked={settings.fakePreviewPages}
                onCheckedChange={() => handleToggle('fakePreviewPages')}
              />
            </div>
            {settings.fakePreviewPages && (
              <div className="grid gap-2 pt-2">
                <Label htmlFor="fakePreviewPageUrl" className="text-xs">Default Fake Preview URL</Label>
                <Input 
                  id="fakePreviewPageUrl"
                  placeholder="https://example.com/default-preview" 
                  value={settings.fakePreviewPageUrl}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="spoof-previews" className="flex flex-col gap-1">
                <span>Spoof Social Previews</span>
                 <span className="font-normal text-muted-foreground text-xs">
                    Allow customizing social previews by default.
                </span>
            </Label>
            <Switch
              id="spoofSocialPreviews"
              checked={settings.spoofSocialPreviews}
              onCheckedChange={() => handleToggle('spoofSocialPreviews')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
