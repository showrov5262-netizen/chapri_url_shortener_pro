
'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Globe, Smartphone, Users, X, Bot, Lock, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { Switch } from "../ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import type { Link, SpoofData, GeoTarget, DeviceTarget, RetargetingPixel, LinkLoadingPageConfig, LoadingPage, Settings } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { countries } from "@/lib/countries";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { mockSettings } from "@/lib/data";

const getInitialSettings = (): Settings => {
    if (typeof window === 'undefined') {
        return mockSettings;
    }
    const stored = window.localStorage.getItem('globalSettings');
    return stored ? JSON.parse(stored) : mockSettings;
}

export function CreateLinkDialog({ links, onAddLink }: { links: Link[], onAddLink: (link: Omit<Link, 'id' | 'createdAt' | 'clicks'>) => void }) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    
    // Initialize state with a function to read from localStorage once
    const [globalSettings, setGlobalSettings] = useState<Settings>(getInitialSettings);

    // Form state with defaults from global settings
    const [longUrl, setLongUrl] = useState('');
    const [title, setTitle] = useState('');
    const [shortCode, setShortCode] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    
    const [useBase64Encoding, setUseBase64Encoding] = useState(globalSettings.useBase64Encoding);
    const [isCloaked, setIsCloaked] = useState(globalSettings.linkCloaking);
    const [useMetaRefresh, setUseMetaRefresh] = useState(globalSettings.metaRefresh);
    const [metaRefreshDelay, setMetaRefreshDelay] = useState<number | null>(0);
    const [redirectType, setRedirectType] = useState<'301' | '302'>(globalSettings.defaultRedirectType);
    const [password, setPassword] = useState('');
    const [expiresAt, setExpiresAt] = useState<Date | undefined>();
    const [maxClicks, setMaxClicks] = useState<number | null>(null);
    const [spoof, setSpoof] = useState<SpoofData | null>({ title: '', description: '', imageUrl: '' });
    const [geoTargets, setGeoTargets] = useState<GeoTarget[]>([]);
    const [deviceTargets, setDeviceTargets] = useState<DeviceTarget[]>([]);
    const [abTestUrls, setAbTestUrls] = useState<string[]>([]);
    const [retargetingPixels, setRetargetingPixels] = useState<RetargetingPixel[]>([]);
    const [loadingPageConfig, setLoadingPageConfig] = useState<LinkLoadingPageConfig>({ useGlobal: true, mode: 'global', selectedPageId: null });
    const [captchaVerification, setCaptchaVerification] = useState(globalSettings.captchaVerification);

    // Toggles for enabling/disabling advanced sections
    const [usePassword, setUsePassword] = useState(globalSettings.passwordProtection);
    const [useExpiration, setUseExpiration] = useState(globalSettings.linkExpiration);
    const [useSpoof, setUseSpoof] = useState(globalSettings.spoof);
    const [useGeoTargeting, setUseGeoTargeting] = useState(globalSettings.geoTargeting);
    const [useDeviceTargeting, setUseDeviceTargeting] = useState(globalSettings.deviceTargeting);
    const [useABTesting, setUseABTesting] = useState(globalSettings.abTestUrls);
    const [usePixels, setUsePixels] = useState(globalSettings.retargetingPixels);
    const [useLoadingPageOverride, setUseLoadingPageOverride] = useState(false);

    const [availableLoadingPages, setAvailableLoadingPages] = useState<LoadingPage[]>([]);
    const [isCaptchaConfigured, setIsCaptchaConfigured] = useState(false);

    // Effect to sync with localStorage settings when the dialog opens
    useEffect(() => {
        if (open) {
            const currentSettings = getInitialSettings();
            setGlobalSettings(currentSettings);
            
            // Reset form state based on potentially updated global settings
            setUseBase64Encoding(currentSettings.useBase64Encoding);
            setIsCloaked(currentSettings.linkCloaking);
            setUseMetaRefresh(currentSettings.metaRefresh);
            setRedirectType(currentSettings.defaultRedirectType);
            setCaptchaVerification(currentSettings.captchaVerification);
            setUsePassword(currentSettings.passwordProtection);
            setUseExpiration(currentSettings.linkExpiration);
            setUseSpoof(currentSettings.spoof);
            setUseGeoTargeting(currentSettings.geoTargeting);
            setUseDeviceTargeting(currentSettings.deviceTargeting);
            setUseABTesting(currentSettings.abTestUrls);
            setUsePixels(currentSettings.retargetingPixels);

            try {
                const item = window.localStorage.getItem('customLoadingPages');
                if (item) setAvailableLoadingPages(JSON.parse(item));
                
                const captchaConfig = window.localStorage.getItem('captchaConfig');
                if (captchaConfig) {
                    const parsed = JSON.parse(captchaConfig);
                    if(parsed.siteKey && parsed.secretKey) {
                        setIsCaptchaConfigured(true);
                    } else {
                        setIsCaptchaConfigured(false);
                    }
                } else {
                    setIsCaptchaConfigured(false);
                }
            } catch (error) {
                console.error("Failed to load settings from localStorage", error);
            }
        }
    }, [open]);

    const resetForm = () => {
        setLongUrl('');
        setTitle('');
        setShortCode('');
        setDescription('');
        setThumbnailUrl('');
        setMetaRefreshDelay(0);
        setPassword('');
        setExpiresAt(undefined);
        setMaxClicks(null);
        setSpoof({ title: '', description: '', imageUrl: '' });
        setGeoTargets([]);
        setDeviceTargets([]);
        setAbTestUrls([]);
        setRetargetingPixels([]);
        setLoadingPageConfig({ useGlobal: true, mode: 'global', selectedPageId: null });
        setUseLoadingPageOverride(false);
    };


    const addGeoTarget = () => setGeoTargets([...geoTargets, { country: '', url: '' }]);
    const removeGeoTarget = (index: number) => setGeoTargets(geoTargets.filter((_, i) => i !== index));
    const updateGeoTarget = (index: number, field: 'country' | 'url', value: string) => {
        setGeoTargets(geoTargets.map((t, i) => i === index ? { ...t, [field]: value } : t));
    };
    
    const addDeviceTarget = () => setDeviceTargets([...deviceTargets, { device: 'iOS', url: '' }]);
    const removeDeviceTarget = (index: number) => setDeviceTargets(deviceTargets.filter((_, i) => i !== index));
    const updateDeviceTarget = (index: number, field: 'device' | 'url', value: any) => {
        setDeviceTargets(deviceTargets.map((t, i) => i === index ? { ...t, [field]: value } : t));
    };
    
    const addAbTestUrl = () => setAbTestUrls([...abTestUrls, '']);
    const removeAbTestUrl = (index: number) => setAbTestUrls(abTestUrls.filter((_, i) => i !== index));
    const updateAbTestUrl = (index: number, value: string) => {
        setAbTestUrls(abTestUrls.map((u, i) => (i === index ? value : u)));
    };
    
    const addPixel = () => setRetargetingPixels([...retargetingPixels, { provider: 'Facebook', id: '' }]);
    const removePixel = (index: number) => setRetargetingPixels(retargetingPixels.filter((_, i) => i !== index));
    const updatePixel = (index: number, field: 'provider' | 'id', value: any) => {
        setRetargetingPixels(retargetingPixels.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
    };

    const handleSubmit = () => {
        if (!longUrl || !title) {
            toast({ variant: "destructive", title: "Validation Error", description: "Destination URL and Title are required." });
            return;
        }

        const finalShortCode = shortCode.trim();
        if (finalShortCode && links.some(link => link.shortCode === finalShortCode)) {
            toast({ variant: "destructive", title: "Duplicate Short Code", description: "This custom short code is already in use." });
            return;
        }
        
        const finalLongUrl = useBase64Encoding ? btoa(longUrl) : longUrl;

        const newLink: Omit<Link, 'id' | 'createdAt' | 'clicks'> = {
            longUrl: finalLongUrl,
            title,
            shortCode: finalShortCode || Math.random().toString(36).substring(2, 8),
            description: description || null,
            thumbnailUrl: thumbnailUrl || null,
            redirectType,
            isCloaked,
            useMetaRefresh,
            metaRefreshDelay: useMetaRefresh ? (metaRefreshDelay || 0) : null,
            loadingPageConfig: useMetaRefresh && useLoadingPageOverride ? loadingPageConfig : { useGlobal: true, mode: 'global', selectedPageId: null },
            password: usePassword ? password : null,
            expiresAt: useExpiration && expiresAt ? expiresAt.toISOString() : null,
            maxClicks: useExpiration ? maxClicks : null,
            spoof: useSpoof ? spoof : null,
            geoTargets: useGeoTargeting ? geoTargets.filter(t => t.country && t.url) : [],
            deviceTargets: useDeviceTargeting ? deviceTargets.filter(t => t.url) : [],
            abTestUrls: useABTesting ? abTestUrls.filter(u => u) : [],
            retargetingPixels: usePixels ? retargetingPixels.filter(p => p.id) : [],
            useBase64Encoding,
            captchaVerification,
        };
        
        onAddLink(newLink);
        toast({ title: "Link Created!", description: "Your new short link has been added." });
        setOpen(false);
        resetForm();
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">Create New Link</DialogTitle>
          <DialogDescription>
            Enter the details for your new short link. You can add custom details later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="long-url">Destination URL</Label>
            <Input id="long-url" placeholder="https://example.com/my-super-long-url" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., Summer Marketing Campaign" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="short-code">Custom Short Code (Optional)</Label>
                <Input id="short-code" placeholder="e.g., summer-sale" value={shortCode} onChange={(e) => setShortCode(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="A brief description for internal reference." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="thumbnail-url">Thumbnail Image URL (Optional)</Label>
            <Input id="thumbnail-url" placeholder="https://example.com/image.png" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
          </div>
          
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="redirection-options">
              <AccordionTrigger className="text-sm font-semibold">Redirection Options</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                 <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5"><Label>Frame-based Cloaking</Label><p className="text-xs text-muted-foreground">Masks the destination URL in an iframe.</p></div>
                    <Switch checked={isCloaked} onCheckedChange={setIsCloaked} />
                  </div>
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <Label>Redirect Type</Label>
                  <Select value={redirectType} onValueChange={(value: '301' | '302') => setRedirectType(value)}>
                    <SelectTrigger><SelectValue placeholder="Select redirect type" /></SelectTrigger>
                    <SelectContent><SelectItem value="301">301 Permanent</SelectItem><SelectItem value="302">302 Temporary</SelectItem></SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Choose 301 for permanent links (good for SEO) or 302 for temporary ones.</p>
                </div>
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5"><Label>Meta Refresh Redirect</Label><p className="text-xs text-muted-foreground">Redirect via an intermediate page.</p></div>
                    <Switch checked={useMetaRefresh} onCheckedChange={setUseMetaRefresh} />
                  </div>
                   {useMetaRefresh && (<div className="space-y-4 pt-4"><div className="grid gap-2"><Label htmlFor="redirect-delay" className="text-xs">Redirect delay (seconds)</Label><Input id="redirect-delay" type="number" placeholder="0 for instant redirect" value={metaRefreshDelay ?? ''} onChange={(e) => setMetaRefreshDelay(parseInt(e.target.value, 10) || 0)} /></div></div>)}
                </div>
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                    <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Spoof Social Media Preview</Label><p className="text-xs text-muted-foreground">Customize the link preview on social platforms.</p></div><Switch checked={useSpoof} onCheckedChange={setUseSpoof}/></div>
                    {useSpoof && (<div className="space-y-4 pt-2"><div className="grid gap-2"><Label htmlFor="spoof-title" className="text-xs">Spoofed Title</Label><Input id="spoof-title" placeholder="e.g., An Incredible Offer!" value={spoof?.title || ''} onChange={(e) => setSpoof(s => ({...s!, title: e.target.value}))} /></div><div className="grid gap-2"><Label htmlFor="spoof-description" className="text-xs">Spoofed Description</Label><Textarea id="spoof-description" placeholder="You won't believe what happens next." value={spoof?.description || ''} onChange={(e) => setSpoof(s => ({...s!, description: e.target.value}))} /></div><div className="grid gap-2"><Label className="text-xs" htmlFor="spoof-image-url">Spoofed Thumbnail URL</Label><Input id="spoof-image-url" placeholder="https://example.com/spoof-image.png" value={spoof?.imageUrl || ''} onChange={(e) => setSpoof(s => ({...s!, imageUrl: e.target.value}))} /></div></div>)}
                  </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="security-options">
              <AccordionTrigger className="text-sm font-semibold">Security & Access</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                  <div className="rounded-lg border p-3 shadow-sm space-y-3">
                    <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Password Protection</Label><p className="text-xs text-muted-foreground">Require a password to access the link.</p></div><Switch checked={usePassword} onCheckedChange={setUsePassword}/></div>
                    {usePassword && (<div className="grid gap-2 pt-2"><Label htmlFor="link-password" className="text-xs">Password</Label><Input id="link-password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>)}
                  </div>
                   <div className="rounded-lg border p-3 shadow-sm"><div className="flex items-center justify-between"><div className="space-y-0.5"><Label className="flex items-center gap-2" htmlFor="base64-encoding"><Lock className="h-4 w-4" />Encode Base64</Label><p className="text-xs text-muted-foreground">Obfuscates the destination URL from simple bots.</p></div><Switch id="base64-encoding" checked={useBase64Encoding} onCheckedChange={setUseBase64Encoding}/></div></div>
                   <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="rounded-lg border p-3 shadow-sm has-[[data-disabled=true]]:opacity-50 has-[[data-disabled=true]]:cursor-not-allowed">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5"><Label className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />CAPTCHA Verification</Label><p className="text-xs text-muted-foreground">Require a human verification step.</p></div>
                                    <Switch checked={captchaVerification} onCheckedChange={setCaptchaVerification} disabled={!isCaptchaConfigured} data-disabled={!isCaptchaConfigured} />
                                </div>
                            </div>
                        </TooltipTrigger>
                        {!isCaptchaConfigured && (<TooltipContent><p>CAPTCHA is not configured. Please add keys in settings.</p></TooltipContent>)}
                    </Tooltip>
                   </TooltipProvider>
                  <div className="rounded-lg border p-3 shadow-sm space-y-3">
                    <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Link Expiration</Label><p className="text-xs text-muted-foreground">Disable the link after a date or clicks.</p></div><Switch checked={useExpiration} onCheckedChange={setUseExpiration}/></div>
                    {useExpiration && (<div className="grid grid-cols-2 gap-4 pt-2"><div className="grid gap-2"><Label htmlFor="max-clicks" className="text-xs">Max Clicks</Label><Input id="max-clicks" type="number" placeholder="e.g., 1000" onChange={(e) => setMaxClicks(parseInt(e.target.value, 10))} /></div><div className="grid gap-2"><Label htmlFor="expiration-date" className="text-xs">Expiration Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="font-normal justify-start">{expiresAt ? format(expiresAt, 'PPP') : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={expiresAt} onSelect={setExpiresAt} initialFocus /></PopoverContent></Popover></div></div>)}
                  </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="targeting-options">
              <AccordionTrigger className="text-sm font-semibold">Advanced Targeting</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Geo-Targeting</Label><p className="text-xs text-muted-foreground">Redirect based on user's country.</p></div><Switch checked={useGeoTargeting} onCheckedChange={setUseGeoTargeting} /></div>
                  {useGeoTargeting && (<div className="space-y-2 pt-2">{geoTargets.map((target, index) => (<div key={index} className="flex items-center gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" role="combobox" className="w-[200px] justify-between">{target.country ? countries.find((c) => c.code === target.country)?.name : "Select country..."}</Button></PopoverTrigger><PopoverContent className="w-[200px] p-0"><Command><CommandInput placeholder="Search country..." /><CommandEmpty>No country found.</CommandEmpty><CommandGroup><ScrollArea className="h-48">{countries.map((country) => (<CommandItem key={country.code} value={country.code} onSelect={(currentValue) => {updateGeoTarget(index, 'country', currentValue.toUpperCase());}}>{country.name}</CommandItem>))}</ScrollArea></CommandGroup></Command></PopoverContent></Popover><Input placeholder="Destination URL" value={target.url} onChange={(e) => updateGeoTarget(index, 'url', e.target.value)} /><Button variant="ghost" size="icon" onClick={() => removeGeoTarget(index)}><X className="h-4 w-4" /></Button></div>))}<Button variant="outline" size="sm" onClick={addGeoTarget}><Globe className="mr-2 h-4 w-4" /> Add Country</Button></div>)}
                </div>
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Device Targeting</Label><p className="text-xs text-muted-foreground">Redirect based on user's device.</p></div><Switch checked={useDeviceTargeting} onCheckedChange={setUseDeviceTargeting} /></div>
                  {useDeviceTargeting && (<div className="space-y-2 pt-2">{deviceTargets.map((target, index) => (<div key={index} className="flex items-center gap-2"><Select value={target.device} onValueChange={(v) => updateDeviceTarget(index, 'device', v)}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="iOS">iOS</SelectItem><SelectItem value="Android">Android</SelectItem><SelectItem value="Desktop">Desktop</SelectItem></SelectContent></Select><Input placeholder="Destination URL" value={target.url} onChange={(e) => updateDeviceTarget(index, 'url', e.target.value)} /><Button variant="ghost" size="icon" onClick={() => removeDeviceTarget(index)}><X className="h-4 w-4" /></Button></div>))}<Button variant="outline" size="sm" onClick={addDeviceTarget}><Smartphone className="mr-2 h-4 w-4" /> Add Device</Button></div>)}
                </div>
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>A/B Testing (Rotator)</Label><p className="text-xs text-muted-foreground">Split traffic between multiple URLs.</p></div><Switch checked={useABTesting} onCheckedChange={setUseABTesting} /></div>
                  {useABTesting && (<div className="space-y-2 pt-2">{abTestUrls.map((url, index) => (<div key={index} className="flex items-center gap-2"><Input placeholder="Destination URL" value={url} onChange={(e) => updateAbTestUrl(index, e.target.value)} /><Button variant="ghost" size="icon" onClick={() => removeAbTestUrl(index)}><X className="h-4 w-4" /></Button></div>))}<Button variant="outline" size="sm" onClick={addAbTestUrl}><Users className="mr-2 h-4 w-4" /> Add URL</Button></div>)}
                </div>
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Retargeting Pixels</Label><p className="text-xs text-muted-foreground">Add tracking pixels to this link.</p></div><Switch checked={usePixels} onCheckedChange={setUsePixels} /></div>
                  {usePixels && (<div className="space-y-2 pt-2">{retargetingPixels.map((pixel, index) => (<div key={index} className="flex items-center gap-2"><Select value={pixel.provider} onValueChange={(v) => updatePixel(index, 'provider', v)}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Facebook">Facebook</SelectItem><SelectItem value="Google Ads">Google Ads</SelectItem><SelectItem value="LinkedIn">LinkedIn</SelectItem><SelectItem value="Twitter">Twitter / X</SelectItem></SelectContent></Select><Input placeholder="Pixel ID" value={pixel.id} onChange={(e) => updatePixel(index, 'id', e.target.value)} /><Button variant="ghost" size="icon" onClick={() => removePixel(index)}><X className="h-4 w-4" /></Button></div>))}<Button variant="outline" size="sm" onClick={addPixel}><Bot className="mr-2 h-4 w-4" /> Add Pixel</Button></div>)}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="loading-page-options" disabled={!useMetaRefresh}>
                <TooltipProvider><Tooltip><TooltipTrigger asChild><div tabIndex={useMetaRefresh ? -1 : 0} className="w-full"><AccordionTrigger className="text-sm font-semibold" disabled={!useMetaRefresh}>Loading Page</AccordionTrigger></div></TooltipTrigger>{!useMetaRefresh && (<TooltipContent><p>Enable "Meta Refresh Redirect" to configure a loading page.</p></TooltipContent>)}</Tooltip></TooltipProvider>
                <AccordionContent className="pt-4 space-y-6">
                    <div className="rounded-lg border p-3 shadow-sm space-y-3">
                        <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Configure Loading Page</Label><p className="text-xs text-muted-foreground">Override global loading page settings for this link.</p></div><Switch checked={useLoadingPageOverride} onCheckedChange={setUseLoadingPageOverride}/></div>
                        {useLoadingPageOverride && (<div className="space-y-4 pt-4 border-t"><RadioGroup value={loadingPageConfig.mode} onValueChange={(value: 'global' | 'random' | 'specific') => {setLoadingPageConfig(prev => ({ ...prev, mode: value, useGlobal: value === 'global' }));}}><div className="flex items-center space-x-2"><RadioGroupItem value="global" id="global" /><Label htmlFor="global" className="font-normal">Use Global Setting</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="random" id="random" /><Label htmlFor="random" className="font-normal">Show a random loading page</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="specific" id="specific" /><Label htmlFor="specific" className="font-normal">Use a specific loading page</Label></div></RadioGroup>{loadingPageConfig.mode === 'specific' && (<div className="grid gap-2 pt-2"><Label htmlFor="select-page" className="text-xs">Select Page</Label><Select value={loadingPageConfig.selectedPageId ?? ""} onValueChange={(value) => setLoadingPageConfig(prev => ({...prev, selectedPageId: value}))}><SelectTrigger id="select-page"><SelectValue placeholder="Select a loading page" /></SelectTrigger><SelectContent>{availableLoadingPages.map(page => (<SelectItem key={page.id} value={page.id}>{page.name}</SelectItem>))}</SelectContent></Select></div>)}</div>)}
                    </div>
                </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Create Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
