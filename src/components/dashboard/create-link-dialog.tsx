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

export function CreateLinkDialog() {
    const [open, setOpen] = useState(false);
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
          <div className="grid gap-2">
            <Label>Custom Thumbnail</Label>
             <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                </label>
            </div> 
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>Create Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
