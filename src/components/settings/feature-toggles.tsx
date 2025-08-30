'use client'

import { useState } from "react";
import type { Settings } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

export default function FeatureToggles({ initialSettings }: { initialSettings: Settings }) {
  const [settings, setSettings] = useState(initialSettings);

  const handleToggle = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] as any }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({...prev, [id]: value }));
  }

  const handleSelectChange = (id: keyof Settings, value: string) => {
    setSettings(prev => ({...prev, [id]: value }));
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Global Security</CardTitle>
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
            <Label htmlFor="malware-protection" className="flex flex-col gap-1">
                <span>Phishing & Malware Protection</span>
                <span className="font-normal text-muted-foreground text-xs">
                    Block known malicious destination URLs.
                </span>
            </Label>
            <Switch
              id="malwareProtection"
              checked={settings.malwareProtection}
              onCheckedChange={() => handleToggle('malwareProtection')}
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
      
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Redirection Methods</CardTitle>
          <CardDescription>
            Default redirection behavior for new links.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-3">
             <Label>Default Redirect Type</Label>
             <Select 
                value={settings.defaultRedirectType} 
                onValueChange={(value) => handleSelectChange('defaultRedirectType', value)}
              >
               <SelectTrigger>
                 <SelectValue placeholder="Select redirect type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="301">301 Permanent</SelectItem>
                 <SelectItem value="302">302 Temporary</SelectItem>
               </SelectContent>
             </Select>
           </div>
           <Separator />
           <div className="flex items-center justify-between">
            <Label htmlFor="link-cloaking" className="flex flex-col gap-1">
                <span>Frame-based Cloaking</span>
                 <span className="font-normal text-muted-foreground text-xs">
                    Enable URL masking by default.
                </span>
            </Label>
            <Switch
              id="linkCloaking"
              checked={settings.linkCloaking}
              onCheckedChange={() => handleToggle('linkCloaking')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="meta-refresh" className="flex flex-col gap-1">
                <span>Meta Refresh Redirect</span>
                 <span className="font-normal text-muted-foreground text-xs">
                    Use meta refresh as default redirect.
                </span>
            </Label>
            <Switch
              id="metaRefresh"
              checked={settings.metaRefresh}
              onCheckedChange={() => handleToggle('metaRefresh')}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
          <CardDescription>
            Enable or disable advanced features by default.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="flex flex-col gap-1">
                  <span>Password Protection</span>
                  <span className="font-normal text-muted-foreground text-xs">
                      Enable password protection by default.
                  </span>
              </Label>
              <Switch
                id="passwordProtection"
                checked={settings.passwordProtection}
                onCheckedChange={() => handleToggle('passwordProtection')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex flex-col gap-1">
                  <span>Link Expiration</span>
                  <span className="font-normal text-muted-foreground text-xs">
                      Enable expiration settings by default.
                  </span>
              </Label>
              <Switch
                id="linkExpiration"
                checked={settings.linkExpiration}
                onCheckedChange={() => handleToggle('linkExpiration')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex flex-col gap-1">
                  <span>Geo-Targeting</span>
                  <span className="font-normal text-muted-foreground text-xs">
                      Allow geo-targeting by default.
                  </span>
              </Label>
              <Switch
                id="geoTargeting"
                checked={settings.geoTargeting}
                onCheckedChange={() => handleToggle('geoTargeting')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex flex-col gap-1">
                  <span>Device Targeting</span>
                  <span className="font-normal text-muted-foreground text-xs">
                      Allow device targeting by default.
                  </span>
              </Label>
              <Switch
                id="deviceTargeting"
                checked={settings.deviceTargeting}
                onCheckedChange={() => handleToggle('deviceTargeting')}
              />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
