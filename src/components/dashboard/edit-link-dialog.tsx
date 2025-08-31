
'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Upload, Globe, Smartphone, Users, X, Bot, Loader, Lock } from "lucide-react";
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

interface EditLinkDialogProps {
  link: Link | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateLink: (link: Link) => void;
}

export function EditLinkDialog({ link, isOpen, onOpenChange, onUpdateLink }: EditLinkDialogProps) {
    const { toast } = useToast();
    
    // Form state - needs to be comprehensive
    const [longUrl, setLongUrl] = useState('');
    const [title, setTitle] = useState('');
    const [shortCode, setShortCode] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [useBase64Encoding, setUseBase64Encoding] = useState(false);

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

    // Toggles for enabling/disabling sections
    const [usePassword, setUsePassword] = useState(false);
    const [useExpiration, setUseExpiration] = useState(false);
    const [useSpoof, setUseSpoof] = useState(false);
    const [useGeoTargeting, setUseGeoTargeting] = useState(false);
    const [useDeviceTargeting, setUseDeviceTargeting] = useState(false);
    const [useABTesting, setUseABTesting] = useState(false);
    const [usePixels, setUsePixels] = useState(false);
    const [useLoadingPageOverride, setUseLoadingPageOverride] = useState(false);

    const [availableLoadingPages, setAvailableLoadingPages] = useState<LoadingPage[]>([]);
    
    // Load link data into state when dialog opens
    useEffect(() => {
        if (link && isOpen) {
            // Basic info
            setLongUrl(link.useBase64Encoding ? atob(link.longUrl) : link.longUrl);
            setTitle(link.title);
            setShortCode(link.shortCode);
            setDescription(link.description);
            setThumbnailUrl(link.thumbnailUrl || '');
            setUseBase64Encoding(link.useBase64Encoding || false);

            // Redirection
            setIsCloaked(link.isCloaked || false);
            setUseMetaRefresh(link.useMetaRefresh || false);
            setMetaRefreshDelay(link.metaRefreshDelay ?? 0);
            setRedirectType(link.redirectType || '301');
            setSpoof(link.spoof);
            setUseSpoof(!!link.spoof);

            // Security & Access
            setPassword(link.password || '');
            setUsePassword(!!link.password);
            setExpiresAt(link.expiresAt ? new Date(link.expiresAt) : undefined);
            setMaxClicks(link.maxClicks || null);
            setUseExpiration(!!link.expiresAt || !!link.maxClicks);
            
            // Advanced Targeting
            setGeoTargets(link.geoTargets || []);
            setUseGeoTargeting((link.geoTargets || []).length > 0);
            setDeviceTargets(link.deviceTargets || []);
            setUseDeviceTargeting((link.deviceTargets || []).length > 0);
            setAbTestUrls(link.abTestUrls || []);
            setUseABTesting((link.abTestUrls || []).length > 0);
            setRetargetingPixels(link.retargetingPixels || []);
            setUsePixels((link.retargetingPixels || []).length > 0);

            // Loading Page
            setLoadingPageConfig(link.loadingPageConfig || { useGlobal: true, mode: 'global', selectedPageId: null });
            setUseLoadingPageOverride(!link.loadingPageConfig?.useGlobal);

            // Load available loading pages from localStorage
            try {
                const item = window.localStorage.getItem('customLoadingPages');
                if (item) setAvailableLoadingPages(JSON.parse(item));
            } catch (error) {
                console.error("Failed to load loading pages", error);
            }
        }
    }, [link, isOpen]);

    const addGeoTarget = () => setGeoTargets([...geoTargets, { country: '', url: '' }]);
    const removeGeoTarget = (index: number) => setGeoTargets(geoTargets.filter((_, i) => i !== index));
    
    const addDeviceTarget = () => setDeviceTargets([...deviceTargets, { device: 'iOS', url: '' }]);
    const removeDeviceTarget = (index: number) => setDeviceTargets(deviceTargets.filter((_, i) => i !== index));
    
    const addAbTestUrl = () => setAbTestUrls([...abTestUrls, '']);
    const removeAbTestUrl = (index: number) => setAbTestUrls(abTestUrls.filter((_, i) => i !== index));
    
    const addPixel = () => setRetargetingPixels([...retargetingPixels, { provider: 'Facebook', id: '' }]);
    const removePixel = (index: number) => setRetargetingPixels(retargetingPixels.filter((_, i) => i !== index));


    const handleSubmit = () => {
        if (!link) return;

        if (!longUrl || !title) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Destination URL and Title are required.",
            });
            return;
        }

        const finalLongUrl = useBase64Encoding ? btoa(longUrl) : longUrl;

        const updatedLink: Link = {
            ...link,
            longUrl: finalLongUrl,
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
            useBase64Encoding,
        };
        
        onUpdateLink(updatedLink);
        toast({
            title: "Link Updated!",
            description: "Your link has been successfully updated.",
        });
        onOpenChange(false);
    };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">Edit Link</DialogTitle>
          <DialogDescription>
            Modify the details and advanced settings of your short link.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Basic Info */}
          <div className="grid gap-2">
            <Label htmlFor="edit-long-url">Destination URL</Label>
            <Input id="edit-long-url" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-short-code">Short Code</Label>
              <Input id="edit-short-code" value={shortCode} disabled />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-thumbnail-url">Thumbnail Image URL</Label>
            <Input id="edit-thumbnail-url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
          </div>

          {/* Accordion for Advanced Settings */}
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="redirection-options">
              <AccordionTrigger className="text-sm font-semibold">Redirection Options</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                 <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label>Frame-based Cloaking</Label>
                      <p className="text-xs text-muted-foreground">Masks the destination URL in an iframe.</p>
                    </div>
                    <Switch checked={isCloaked} onCheckedChange={setIsCloaked} />
                  </div>
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <Label>Redirect Type</Label>
                  <Select value={redirectType} onValueChange={(value: '301' | '302') => setRedirectType(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="301">301 Permanent</SelectItem>
                      <SelectItem value="302">302 Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5"><Label>Meta Refresh Redirect</Label></div>
                    <Switch checked={useMetaRefresh} onCheckedChange={setUseMetaRefresh} />
                  </div>
                   {useMetaRefresh && (
                    <div className="space-y-4 pt-4">
                      <div className="grid gap-2"><Label htmlFor="edit-redirect-delay" className="text-xs">Redirect delay (seconds)</Label>
                        <Input id="edit-redirect-delay" type="number" value={metaRefreshDelay ?? ''} onChange={(e) => setMetaRefreshDelay(parseInt(e.target.value, 10) || 0)} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="rounded-lg border p-3 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5"><Label>Spoof Social Media Preview</Label></div>
                      <Switch checked={useSpoof} onCheckedChange={setUseSpoof} />
                    </div>
                    {useSpoof && (
                      <div className="space-y-4 pt-2">
                        <div className="grid gap-2"><Label htmlFor="edit-spoof-title" className="text-xs">Spoofed Title</Label><Input id="edit-spoof-title" value={spoof?.title || ''} onChange={(e) => setSpoof(s => ({...s!, title: e.target.value}))} /></div>
                        <div className="grid gap-2"><Label htmlFor="edit-spoof-description" className="text-xs">Spoofed Description</Label><Textarea id="edit-spoof-description" value={spoof?.description || ''} onChange={(e) => setSpoof(s => ({...s!, description: e.target.value}))} /></div>
                        <div className="grid gap-2"><Label className="text-xs" htmlFor="edit-spoof-image-url">Spoofed Thumbnail URL</Label><Input id="edit-spoof-image-url" value={spoof?.imageUrl || ''} onChange={(e) => setSpoof(s => ({...s!, imageUrl: e.target.value}))} /></div>
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
                       <div className="space-y-0.5"><Label>Password Protection</Label></div>
                      <Switch checked={usePassword} onCheckedChange={setUsePassword} />
                    </div>
                    {usePassword && (
                      <div className="grid gap-2 pt-2"><Label htmlFor="edit-link-password" className="text-xs">Password</Label><Input id="edit-link-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                    )}
                  </div>
                   <div className="rounded-lg border p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5"><Label className="flex items-center gap-2" htmlFor="edit-base64-encoding"><Lock className="h-4 w-4" />Encode Base64</Label></div>
                        <Switch id="edit-base64-encoding" checked={useBase64Encoding} onCheckedChange={setUseBase64Encoding} />
                    </div>
                  </div>
                  <div className="rounded-lg border p-3 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5"><Label>Link Expiration</Label></div>
                      <Switch checked={useExpiration} onCheckedChange={setUseExpiration} />
                    </div>
                    {useExpiration && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="grid gap-2"><Label htmlFor="edit-max-clicks" className="text-xs">Max Clicks</Label><Input id="edit-max-clicks" type="number" value={maxClicks ?? ''} onChange={(e) => setMaxClicks(parseInt(e.target.value, 10))} /></div>
                        <div className="grid gap-2"><Label htmlFor="edit-expiration-date" className="text-xs">Expiration Date</Label>
                           <Popover><PopoverTrigger asChild><Button variant="outline" className="font-normal justify-start">{expiresAt ? format(expiresAt, 'PPP') : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={expiresAt} onSelect={setExpiresAt} initialFocus /></PopoverContent></Popover>
                        </div>
                      </div>
                    )}
                  </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Other accordions would go here, mirroring CreateLinkDialog */}

          </Accordion>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
