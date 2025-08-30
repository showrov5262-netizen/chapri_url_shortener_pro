'use client'

import { useState } from "react";
import type { Settings } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function FeatureToggles({ initialSettings }: { initialSettings: Settings }) {
  const [settings, setSettings] = useState(initialSettings);

  const handleToggle = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Security & Protection</CardTitle>
          <CardDescription>
            Configure settings to protect your links from abuse and spam.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="bot-detection">Bot Detection</Label>
            <Switch
              id="bot-detection"
              checked={settings.botDetection}
              onCheckedChange={() => handleToggle('botDetection')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-scanner">Email Scanner Protection</Label>
            <Switch
              id="email-scanner"
              checked={settings.emailScannerProtection}
              onCheckedChange={() => handleToggle('emailScannerProtection')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="captcha">CAPTCHA Verification</Label>
            <Switch
              id="captcha"
              checked={settings.captchaVerification}
              onCheckedChange={() => handleToggle('captchaVerification')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="rate-limiting">IP-based Rate Limiting</Label>
            <Switch
              id="rate-limiting"
              checked={settings.ipRateLimiting}
              onCheckedChange={() => handleToggle('ipRateLimiting')}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Customization & Redirects</CardTitle>
          <CardDescription>
            Customize the appearance and behavior of your links.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="custom-thumbnails">Custom Thumbnails</Label>
            <Switch
              id="custom-thumbnails"
              checked={settings.customThumbnails}
              onCheckedChange={() => handleToggle('customThumbnails')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="fake-previews">Fake Preview Pages</Label>
            <Switch
              id="fake-previews"
              checked={settings.fakePreviewPages}
              onCheckedChange={() => handleToggle('fakePreviewPages')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="redirect-delays">Redirect Delays</Label>
            <Switch
              id="redirect-delays"
              checked={settings.redirectDelays}
              onCheckedChange={() => handleToggle('redirectDelays')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="fake-referrer">Fake Referrer Protection</Label>
            <Switch
              id="fake-referrer"
              checked={settings.fakeReferrerProtection}
              onCheckedChange={() => handleToggle('fakeReferrerProtection')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
