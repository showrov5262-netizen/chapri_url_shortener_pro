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
import { PlusCircle, Upload, Globe, Smartphone, Users, X, Bot } from "lucide-react";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

export function CreateLinkDialog() {
    const [open, setOpen] = useState(false);
    
    // Main link settings
    const [isCloaked, setIsCloaked] = useState(false);
    const [useFakePreview, setUseFakePreview] = useState(false);
    const [useSpoof, setUseSpoof] = useState(false);
    const [redirectType, setRedirectType] = useState('301');
    const [useMetaRefresh, setUseMetaRefresh] = useState(false);

    // Security
    const [usePassword, setUsePassword] = useState(false);
    const [useExpiration, setUseExpiration] = useState(false);
    const [expirationDate, setExpirationDate] = useState<Date | undefined>();

    // Targeting
    const [useGeoTargeting, setUseGeoTargeting] = useState(false);
    const [geoTargets, setGeoTargets] = useState<{country: string, url: string}[]>([]);
    
    const [useDeviceTargeting, setUseDeviceTargeting] = useState(false);
    const [deviceTargets, setDeviceTargets] = useState<{device: string, url: string}[]>([]);

    const [useABTesting, setUseABTesting] = useState(false);
    const [abTestUrls, setAbTestUrls] = useState<string[]>(['']);
    
    const [usePixels, setUsePixels] = useState(false);
    const [pixels, setPixels] = useState<{provider: string, id: string}[]>([]);


    const addGeoTarget = () => setGeoTargets([...geoTargets, { country: '', url: '' }]);
    const removeGeoTarget = (index: number) => setGeoTargets(geoTargets.filter((_, i) => i !== index));
    
    const addDeviceTarget = () => setDeviceTargets([...deviceTargets, { device: 'Mobile', url: '' }]);
    const removeDeviceTarget = (index: number) => setDeviceTargets(deviceTargets.filter((_, i) => i !== index));
    
    const addAbTestUrl = () => setAbTestUrls([...abTestUrls, '']);
    const removeAbTestUrl = (index: number) => setAbTestUrls(abTestUrls.filter((_, i) => i !== index));
    
    const addPixel = () => setPixels([...pixels, { provider: 'Facebook', id: '' }]);
    const removePixel = (index: number) => setPixels(pixels.filter((_, i) => i !== index));


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
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., Summer Marketing Campaign" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="short-code">Custom Short Code (Optional)</Label>
                <Input id="short-code" placeholder="e.g., summer-sale" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="A brief description for internal reference."
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
                  <Select value={redirectType} onValueChange={setRedirectType}>
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

                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label>Meta Refresh Redirect</Label>
                    <p className="text-xs text-muted-foreground">
                      Redirect via an intermediate page with a countdown.
                    </p>
                  </div>
                  <Switch
                    checked={useMetaRefresh}
                    onCheckedChange={setUseMetaRefresh}
                  />
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
                           <Input id="spoof-title" placeholder="e.g., An Incredible Offer!" />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="spoof-description" className="text-xs">Spoofed Description</Label>
                           <Textarea id="spoof-description" placeholder="You won't believe what happens next." />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-xs">Spoofed Thumbnail</Label>
                           <div className="flex items-center justify-center w-full">
                              <label htmlFor="dropzone-file-spoof" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                      <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 1200x630px)</p>
                                  </div>
                                  <input id="dropzone-file-spoof" type="file" className="hidden" />
                              </label>
                          </div> 
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
                        <Input id="link-password" type="password" placeholder="Enter password" />
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
                          <Input id="max-clicks" type="number" placeholder="e.g., 1000" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="expiration-date" className="text-xs">Expiration Date</Label>
                           <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="font-normal justify-start">
                                {expirationDate ? format(expirationDate, 'PPP') : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={expirationDate}
                                onSelect={setExpirationDate}
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
                       {pixels.map((pixel, index) => (
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
          </Accordion>

        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>Create Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
