
'use client'

import { useState } from "react";
import type { Settings } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAiState } from "@/hooks/use-ai-state";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";


export default function FeatureToggles({ initialSettings }: { initialSettings: Settings }) {
  const [settings, setSettings] = useState(initialSettings);
  const { status: aiStatus } = useAiState();
  const isAiConfigured = aiStatus === 'valid';

  const handleToggle = (key: keyof Settings | `manualBotDetection.${keyof Settings['manualBotDetection']}`) => {
    if (key.startsWith('manualBotDetection.')) {
      const subKey = key.split('.')[1] as keyof Settings['manualBotDetection'];
      setSettings(prev => ({
        ...prev,
        manualBotDetection: {
          ...prev.manualBotDetection,
          [subKey]: !prev.manualBotDetection[subKey],
        },
      }));
    } else {
      setSettings(prev => ({ ...prev, [key]: !prev[key as keyof Settings] as any }));
    }
  };
  
  const handleRedirectTypeChange = (value: '301' | '302') => {
    setSettings(prev => ({
        ...prev,
        defaultRedirectType: value
    }));
  }

  const AiStatusIndicator = () => (
     <span
      className={cn(
        "h-2 w-2 rounded-full mr-2 shrink-0",
        isAiConfigured ? "bg-green-500" : "bg-red-500"
      )}
    />
  )

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card shadow-sm has-[[data-disabled=true]]:opacity-50 has-[[data-disabled=true]]:cursor-not-allowed">
                  <Label htmlFor="bot-detection" className="flex items-center gap-1 cursor-pointer">
                      <AiStatusIndicator />
                      <div className="flex flex-col">
                        <span>AI-Powered Bot Detection</span>
                        <span className="font-normal text-muted-foreground text-xs">
                            Enable Genkit AI-powered filtering.
                        </span>
                      </div>
                  </Label>
                  <Switch
                    id="botDetection"
                    checked={settings.botDetection}
                    onCheckedChange={() => handleToggle('botDetection')}
                    disabled={!isAiConfigured}
                    data-disabled={!isAiConfigured}
                  />
                </div>
              </TooltipTrigger>
              {!isAiConfigured && (
                  <TooltipContent>
                    <p>AI is not configured. Please add a valid API key in settings.</p>
                  </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          
          <div className="space-y-4">
            <Label className="text-sm font-medium">Manual Bot Filtering</Label>
            <div className="space-y-4 pl-4 border-l-2">
              <div className="flex items-center justify-between">
                <Label className="font-normal text-sm">Known Bots & Crawlers</Label>
                <Switch 
                  checked={settings.manualBotDetection.blockKnownBots}
                  onCheckedChange={() => handleToggle('manualBotDetection.blockKnownBots')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal text-sm">Anonymous Proxies & VPNs</Label>
                <Switch
                  checked={settings.manualBotDetection.blockProxies}
                  onCheckedChange={() => handleToggle('manualBotDetection.blockProxies')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal text-sm">Data Center IPs</Label>
                <Switch
                  checked={settings.manualBotDetection.blockDataCenterIPs}
                  onCheckedChange={() => handleToggle('manualBotDetection.blockDataCenterIPs')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal text-sm">Email Scanners</Label>
                <Switch
                  checked={settings.manualBotDetection.blockEmailScanners}
                  onCheckedChange={() => handleToggle('manualBotDetection.blockEmailScanners')}
                />
              </div>
            </div>
          </div>
          
          <Separator />

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
           <div className="space-y-2">
             <Label htmlFor="default-redirect-type">Default Redirect Type</Label>
             <Select value={settings.defaultRedirectType} onValueChange={handleRedirectTypeChange}>
                <SelectTrigger id="default-redirect-type">
                  <SelectValue placeholder="Select redirect type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="301">301 Permanent</SelectItem>
                  <SelectItem value="302">302 Temporary</SelectItem>
                </SelectContent>
              </Select>
             <p className="text-xs text-muted-foreground">
                Choose 301 for SEO or 302 for temporary links.
             </p>
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
