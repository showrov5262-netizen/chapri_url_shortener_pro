
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
import { useState, useEffect } from "react";
import type { Link } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "../ui/switch";
import { Lock } from "lucide-react";


interface EditLinkDialogProps {
  link: Link | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateLink: (link: Link) => void;
}

export function EditLinkDialog({ link, isOpen, onOpenChange, onUpdateLink }: EditLinkDialogProps) {
    const { toast } = useToast();
    
    // Form state
    const [longUrl, setLongUrl] = useState('');
    const [title, setTitle] = useState('');
    const [shortCode, setShortCode] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [useBase64Encoding, setUseBase64Encoding] = useState(false);
    
    useEffect(() => {
        if (link && isOpen) {
            // If the URL is encoded, decode it for editing
            if (link.useBase64Encoding) {
                try {
                    setLongUrl(atob(link.longUrl));
                } catch (e) {
                    console.error("Failed to decode URL for editing:", e);
                    setLongUrl(link.longUrl); // Fallback to raw URL
                }
            } else {
                setLongUrl(link.longUrl);
            }

            setTitle(link.title);
            setShortCode(link.shortCode);
            setDescription(link.description);
            setThumbnailUrl(link.thumbnailUrl || '');
            setUseBase64Encoding(link.useBase64Encoding || false);
        }
    }, [link, isOpen]);

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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-headline">Edit Link</DialogTitle>
          <DialogDescription>
            Modify the basic details of your short link.
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
                <Label htmlFor="short-code">Short Code</Label>
                <Input 
                  id="short-code" 
                  placeholder="e.g., summer-sale" 
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                  disabled // Disabling short code editing for now to prevent issues.
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
           <div className="rounded-lg border p-3 shadow-sm mt-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="flex items-center gap-2" htmlFor="base64-encoding-edit">
                            <Lock className="h-4 w-4" />
                            Encode Base64
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Obfuscates the destination URL from simple bots.
                        </p>
                    </div>
                    <Switch
                        id="base64-encoding-edit"
                        checked={useBase64Encoding}
                        onCheckedChange={setUseBase64Encoding}
                    />
                </div>
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
