
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
import { PlusCircle, Upload, Globe, Smartphone, Users, X, Bot, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { Switch } from "../ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import type { Link, SpoofData, GeoTarget, DeviceTarget, RetargetingPixel, LinkLoadingPageConfig, LoadingPage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


export function CreateLinkDialog({ onAddLink }: { onAddLink: (link: Omit<Link, 'id' | 'createdAt' | 'clicks' | 'shortCode'>) => void }) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    
    // Form state
    const [longUrl, setLongUrl] = useState('');
    const [title, setTitle] = useState('');
    const [shortCode, setShortCode] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    const [isCloaked, setIsCloaked] = useState(false);
    const [useMetaRefresh, setUseMetaRefresh] = useState(false);
    const [metaRefreshDelay, setMetaRefreshDelay] = useState<number | null>(0);
    const [redirectType, setRedirectType] = useState<'301' | '302'>('301');
    const [password, setPassword] = useState('');
    const [expiresAt, setExpiresAt] = useState<Date | undefined>();
    const [maxClicks, setMaxClicks] = useState<number | null>(null);
    const [spoof, setSpoof] = useState<SpoofData | null>(null);
    const [geoTargets, setGeoTargets] = useState<GeoTarget[]>([]);
    const [deviceTargets, setDeviceTargets] = useState<DeviceTarget[]>([]);
    const [abTestUrls, setAbTestUrls] = useState<string[]>([]);
    const [retargetingPixels, setRetargetingPixels] = useState<RetargetingPixel[]>([]);
    const [loadingPageConfig, setLoadingPageConfig] = useState<LinkLoadingPageConfig>({ useGlobal: true, mode: 'global', selectedPageId: null });

    const [usePassword, setUsePassword] = useState(false);
    const [useExpiration, setUseExpiration] = useState(false);
    const [useSpoof, setUseSpoof] = useState(false);
    const [useGeoTargeting, setUseGeoTargeting] = useState(false);
    const [useDeviceTargeting, setUseDeviceTargeting] = useState(false);
    const [useABTesting, setUseABTesting] = useState(false);
    const [usePixels, setUsePixels] = useState(false);
    const [useLoadingPageOverride, setUseLoadingPageOverride] = useState(false);

    const [availableLoadingPages, setAvailableLoadingPages] = useState<LoadingPage[]>([]);

    useEffect(() => {
        if (open) {
            // Load pages from localStorage when the dialog opens
            try {
                const item = window.localStorage.getItem('customLoadingPages');
                if (item) {
                    setAvailableLoadingPages(JSON.parse(item));
                }
            } catch (error) {
                console.error("Failed to load loading pages from localStorage", error);
            }
        }
    }, [open]);

    const addGeoTarget = () => setGeoTargets([...geoTargets, { country: '', url: '' }]);
    const removeGeoTarget = (index: number) => setGeoTargets(geoTargets.filter((_, i) => i !== index));
    
    const addDeviceTarget = () => setDeviceTargets([...deviceTargets, { device: 'iOS', url: '' }]);
    const removeDeviceTarget = (index: number) => setDeviceTargets(deviceTargets.filter((_, i) => i !== index));
    
    const addAbTestUrl = () => setAbTestUrls([...abTestUrls, '']);
    const removeAbTestUrl = (index: number) => setAbTestUrls(abTestUrls.filter((_, i) => i !== index));
    
    const addPixel = () => setRetargetingPixels([...retargetingPixels, { provider: 'Facebook', id: '' }]);
    const removePixel = (index: number) => setRetargetingPixels(retargetingPixels.filter((_, i) => i !== index));

    const handleSubmit = () => {
        if (!longUrl || !title) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Destination URL and Title are required.",
            });
            return;
        }

        const newLink: Omit<Link, 'id' | 'createdAt' | 'clicks' | 'shortCode'> & { shortCode?: string } = {
            longUrl,
            title,
            shortCode,
            description,
            thumbnailUrl,
            redirectType,
            isCloaked,
            useMetaRefresh,
            metaRefreshDelay: useMetaRefresh ? (metaRefreshDelay || 0) : null,
            loadingPageConfig: useMetaRefresh && useLoadingPageOverride ? loadingPageConfig : { useGlobal: true, mode: 'global', selectedPageId: null },
            password: usePassword ? password : null,
            expiresAt: useExpiration && expiresAt ? expiresAt.toISOString() : null,
            maxClicks: useExpiration ? maxClicks : null,
            spoof: useSpoof ? spoof : null,
            geoTargets: useGeoTargeting ? geoTargets : [],
            deviceTargets: useDeviceTargeting ? deviceTargets : [],
            abTestUrls: useABTesting ? abTestUrls : [],
            retargetingPixels: usePixels ? retargetingPixels : [],
        };
        
        onAddLink(newLink);
        toast({
            title: "Link Created!",
            description: "Your new short link has been added to the dashboard.",
        });
        setOpen(false);
        // Reset form state
        setLongUrl('');
        setTitle('');
        setShortCode('');
        setDescription('');
        setThumbnailUrl('');
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
            <Input
              id="long-url"
              placeholder="https://example.com/my-super-long-url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Summer Marketing Campaign"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="short-code">Custom Short Code (Optional)</Label>
                <Input 
                  id="short-code" 
                  placeholder="e.g., summer-sale" 
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="A brief description for internal reference."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="thumbnail-url">Thumbnail Image URL (Optional)</Label>
            <Input
              id="thumbnail-url"
              placeholder="https://example.com/image.png"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
          </div>
          
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="redirection-options">
              <AccordionTrigger className="text-sm font-semibold">Redirection Options</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                 <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label>Frame-based Cloaking</Label>
                      <p className="text-xs text-muted-foreground">
                        Masks the destination URL in an iframe.
                      </p>
                    </div>
                    <Switch
                      checked={isCloaked}
                      onCheckedChange={setIsCloaked}
                    />
                  </div>

                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <Label>Redirect Type</Label>
                  <Select value={redirectType} onValueChange={(value: '301' | '302') => setRedirectType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select redirect type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="301">301 Permanent</SelectItem>
                      <SelectItem value="302">302 Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose 301 for permanent links (good for SEO) or 302 for temporary ones.
                  </p>
                </div>

                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Meta Refresh Redirect</Label>
                      <p className="text-xs text-muted-foreground">
                        Redirect via an intermediate page.
                      </p>
                    </div>
                    <Switch
                      checked={useMetaRefresh}
                      onCheckedChange={setUseMetaRefresh}
                    />
                  </div>
                   {useMetaRefresh && (
                    <div className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="redirect-delay" className="text-xs">Redirect delay timer</Label>
                        <Input
                          id="redirect-delay"
                          type="number"
                          placeholder="0 for instant redirect"
                          value={metaRefreshDelay ?? ''}
                          onChange={(e) => setMetaRefreshDelay(parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                        <Label>Spoof Social Media Preview</Label>
                        <p className="text-xs text-muted-foreground">
                          Customize the link preview on social platforms.
                        </p>
                      </div>
                      <Switch
                        checked={useSpoof}
                        onCheckedChange={setUseSpoof}
                      />
                    </div>
                    {useSpoof && (
                      <div className="space-y-4 pt-2">
                        <div className="grid gap-2">
                           <Label htmlFor="spoof-title" className="text-xs">Spoofed Title</Label>
                           <Input id="spoof-title" placeholder="e.g., An Incredible Offer!" onChange={(e) => setSpoof(s => ({...s!, title: e.target.value}))} />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="spoof-description" className="text-xs">Spoofed Description</Label>
                           <Textarea id="spoof-description" placeholder="You won't believe what happens next." onChange={(e) => setSpoof(s => ({...s!, description: e.target.value}))} />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-xs" htmlFor="spoof-image-url">Spoofed Thumbnail URL</Label>
                           <Input id="spoof-image-url" placeholder="https://example.com/spoof-image.png" onChange={(e) => setSpoof(s => ({...s!, imageUrl: e.target.value}))} />
                        </div>
                      </div>
                    )}
                  </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security-options">
              <AccordionTrigger className="text-sm font-semibold">Security & Access</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                  <div className="rounded-lg border p-3 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                        <Label>Password Protection</Label>
                        <p className="text-xs text-muted-foreground">
                          Require a password to access the link.
                        </p>
                      </div>
                      <Switch
                        checked={usePassword}
                        onCheckedChange={setUsePassword}
                      />
                    </div>
                    {usePassword && (
                      <div className="grid gap-2 pt-2">
                        <Label htmlFor="link-password" className="text-xs">Password</Label>
                        <Input id="link-password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                    )}
                  </div>
                  <div className="rounded-lg border p-3 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                        <Label>Link Expiration</Label>
                        <p className="text-xs text-muted-foreground">
                          Disable the link after a date or clicks.
                        </p>
                      </div>
                      <Switch
                        checked={useExpiration}
                        onCheckedChange={setUseExpiration}
                      />
                    </div>
                    {useExpiration && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="grid gap-2">
                          <Label htmlFor="max-clicks" className="text-xs">Max Clicks</Label>
                          <Input id="max-clicks" type="number" placeholder="e.g., 1000" onChange={(e) => setMaxClicks(parseInt(e.target.value, 10))} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="expiration-date" className="text-xs">Expiration Date</Label>
                           <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="font-normal justify-start">
                                {expiresAt ? format(expiresAt, 'PPP') : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={expiresAt}
                                onSelect={setExpiresAt}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    )}
                  </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="targeting-options">
              <AccordionTrigger className="text-sm font-semibold">Advanced Targeting</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                
                {/* Geo Targeting */}
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                      <Label>Geo-Targeting</Label>
                      <p className="text-xs text-muted-foreground">Redirect based on user's country.</p>
                      </div>
                      <Switch checked={useGeoTargeting} onCheckedChange={setUseGeoTargeting} />
                  </div>
                  {useGeoTargeting && (
                    <div className="space-y-2 pt-2">
                      {geoTargets.map((target, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input placeholder="Country Code (e.g., US)" defaultValue={target.country} />
                          <Input placeholder="Destination URL" defaultValue={target.url} />
                          <Button variant="ghost" size="icon" onClick={() => removeGeoTarget(index)}><X className="h-4 w-4" /></Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addGeoTarget}><Globe className="mr-2 h-4 w-4" /> Add Country</Button>
                    </div>
                  )}
                </div>

                {/* Device Targeting */}
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                      <Label>Device Targeting</Label>
                      <p className="text-xs text-muted-foreground">Redirect based on user's device.</p>
                      </div>
                      <Switch checked={useDeviceTargeting} onCheckedChange={setUseDeviceTargeting} />
                  </div>
                  {useDeviceTargeting && (
                    <div className="space-y-2 pt-2">
                       {deviceTargets.map((target, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Select defaultValue={target.device}>
                                <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="iOS">iOS</SelectItem>
                                    <SelectItem value="Android">Android</SelectItem>
                                    <SelectItem value="Desktop">Desktop</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input placeholder="Destination URL" defaultValue={target.url} />
                            <Button variant="ghost" size="icon" onClick={() => removeDeviceTarget(index)}><X className="h-4 w-4" /></Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addDeviceTarget}><Smartphone className="mr-2 h-4 w-4" /> Add Device</Button>
                    </div>
                  )}
                </div>

                {/* A/B Testing */}
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                      <Label>A/B Testing (Rotator)</Label>
                      <p className="text-xs text-muted-foreground">Split traffic between multiple URLs.</p>
                      </div>
                      <Switch checked={useABTesting} onCheckedChange={setUseABTesting} />
                  </div>
                  {useABTesting && (
                    <div className="space-y-2 pt-2">
                      {abTestUrls.map((url, index) => (
                         <div key={index} className="flex items-center gap-2">
                            <Input placeholder="Destination URL" defaultValue={url} />
                            <Button variant="ghost" size="icon" onClick={() => removeAbTestUrl(index)}><X className="h-4 w-4" /></Button>
                         </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addAbTestUrl}><Users className="mr-2 h-4 w-4" /> Add URL</Button>
                    </div>
                  )}
                </div>
                
                {/* Retargeting */}
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                      <Label>Retargeting Pixels</Label>
                      <p className="text-xs text-muted-foreground">Add tracking pixels to this link.</p>
                      </div>
                      <Switch checked={usePixels} onCheckedChange={setUsePixels} />
                  </div>
                  {usePixels && (
                    <div className="space-y-2 pt-2">
                       {retargetingPixels.map((pixel, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Select defaultValue={pixel.provider}>
                                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Facebook">Facebook</SelectItem>
                                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    <SelectItem value="Twitter">Twitter / X</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input placeholder="Pixel ID" defaultValue={pixel.id} />
                            <Button variant="ghost" size="icon" onClick={() => removePixel(index)}><X className="h-4 w-4" /></Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addPixel}><Bot className="mr-2 h-4 w-4" /> Add Pixel</Button>
                    </div>
                  )}
                </div>

              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="loading-page-options" disabled={!useMetaRefresh}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {/* The disabled attribute is what we check against. We need a div wrapper for TooltipTrigger to work on disabled elements. */}
                            <div tabIndex={useMetaRefresh ? -1 : 0} className="w-full">
                                <AccordionTrigger className="text-sm font-semibold" disabled={!useMetaRefresh}>
                                    Loading Page
                                </AccordionTrigger>
                            </div>
                        </TooltipTrigger>
                        {!useMetaRefresh && (
                        <TooltipContent>
                            <p>Enable "Meta Refresh Redirect" to configure a loading page.</p>
                        </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>

                <AccordionContent className="pt-4 space-y-6">
                    <div className="rounded-lg border p-3 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Configure Loading Page</Label>
                            <p className="text-xs text-muted-foreground">
                            Override global loading page settings for this link.
                            </p>
                        </div>
                        <Switch
                            checked={useLoadingPageOverride}
                            onCheckedChange={setUseLoadingPageOverride}
                        />
                        </div>
                        {useLoadingPageOverride && (
                        <div className="space-y-4 pt-4 border-t">
                            <RadioGroup 
                                value={loadingPageConfig.mode}
                                onValueChange={(value: 'global' | 'random' | 'specific') => {
                                    setLoadingPageConfig(prev => ({ ...prev, mode: value, useGlobal: value === 'global' }));
                                }}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="global" id="global" />
                                    <Label htmlFor="global" className="font-normal">Use Global Setting</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="random" id="random" />
                                    <Label htmlFor="random" className="font-normal">Show a random loading page</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="specific" id="specific" />
                                    <Label htmlFor="specific" className="font-normal">Use a specific loading page</Label>
                                </div>
                            </RadioGroup>

                            {loadingPageConfig.mode === 'specific' && (
                                <div className="grid gap-2 pt-2">
                                    <Label htmlFor="select-page" className="text-xs">Select Page</Label>
                                    <Select
                                        value={loadingPageConfig.selectedPageId ?? ""}
                                        onValueChange={(value) => setLoadingPageConfig(prev => ({...prev, selectedPageId: value}))}
                                    >
                                        <SelectTrigger id="select-page">
                                            <SelectValue placeholder="Select a loading page" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableLoadingPages.map(page => (
                                            <SelectItem key={page.id} value={page.id}>
                                                {page.name}
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        )}
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
