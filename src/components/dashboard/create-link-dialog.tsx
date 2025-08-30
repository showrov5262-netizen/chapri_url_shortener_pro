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
import { PlusCircle, Upload } from "lucide-react";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export function CreateLinkDialog() {
    const [open, setOpen] = useState(false);
    const [isCloaked, setIsCloaked] = useState(false);
    const [useFakePreview, setUseFakePreview] = useState(false);
    const [useSpoof, setUseSpoof] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
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
            <AccordionItem value="advanced-options">
              <AccordionTrigger className="text-sm font-semibold">Advanced Options</AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                 <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label>Link Cloaking</Label>
                      <p className="text-xs text-muted-foreground">
                        Hide the destination URL from visitors.
                      </p>
                    </div>
                    <Switch
                      checked={isCloaked}
                      onCheckedChange={setIsCloaked}
                    />
                  </div>

                  <div className="rounded-lg border p-3 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                        <Label>Fake Preview Page</Label>
                        <p className="text-xs text-muted-foreground">
                          Show a different page before redirecting.
                        </p>
                      </div>
                      <Switch
                        checked={useFakePreview}
                        onCheckedChange={setUseFakePreview}
                      />
                    </div>
                    {useFakePreview && (
                      <div className="grid gap-2 pt-2">
                        <Label htmlFor="fake-preview-url" className="text-xs">Fake Preview Page URL</Label>
                        <Input id="fake-preview-url" placeholder="https://example.com/fake-preview" />
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
          </Accordion>

        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>Create Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
