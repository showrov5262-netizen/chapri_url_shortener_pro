'use client'

import type { Link as LinkType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, BarChart2, Edit, Trash2, Copy } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreateLinkDialog } from "./create-link-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface LinksTableProps {
  links: LinkType[];
  onAddLink: (newLinkData: Omit<LinkType, 'id' | 'createdAt' | 'clicks' | 'shortCode'>) => void;
  onDeleteLink: (linkId: string) => void;
}

export default function LinksTable({ links, onAddLink, onDeleteLink }: LinksTableProps) {
  const { toast } = useToast();

  const handleCopy = (shortCode: string) => {
    const url = `${window.location.host}/${shortCode}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied to clipboard!",
      description: url,
    });
  };

  const handleDelete = (linkId: string) => {
    onDeleteLink(linkId);
    toast({
      variant: "destructive",
      title: "Link Deleted",
      description: "The link has been successfully removed.",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CreateLinkDialog onAddLink={onAddLink} />
      </div>
      <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Thumbnail</span>
                </TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Short Code</TableHead>
                <TableHead className="hidden md:table-cell text-right">Clicks</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="hidden sm:table-cell">
                    {link.thumbnailUrl ? (
                      <Image
                          alt={link.title}
                          className="aspect-video rounded-md object-cover"
                          height="64"
                          data-ai-hint="social media preview"
                          src={link.thumbnailUrl}
                          width="120"
                      />
                    ) : (
                      <div className="flex aspect-video w-[120px] items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">No Thumbnail</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-semibold truncate max-w-48 md:max-w-xs">{link.title}</span>
                      <span className="text-muted-foreground text-xs truncate max-w-48 md:max-w-xs">{link.longUrl}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{link.shortCode}</Badge>
                      <Copy className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => handleCopy(link.shortCode)} />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">{link.clicks.length.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <span className="cursor-default">{new Date(link.createdAt).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{new Date(link.createdAt).toLocaleString()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <NextLink href={`/dashboard/analytics/${link.id}`}>
                            <BarChart2 className="mr-2 h-4 w-4" />
                            Analytics
                          </NextLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                         <AlertDialogTrigger asChild>
                          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive text-sm font-normal relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialog>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the link and its analytics data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(link.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>
    </div>
  );
}
