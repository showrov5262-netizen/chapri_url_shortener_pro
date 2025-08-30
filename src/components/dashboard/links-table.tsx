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

export default function LinksTable({ links }: { links: LinkType[] }) {
  const { toast } = useToast();

  const handleCopy = (shortCode: string) => {
    const url = `${window.location.host}/${shortCode}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied to clipboard!",
      description: url,
    });
  };

  return (
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
                      <TooltipTrigger>
                        {new Date(link.createdAt).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                      </TooltipTrigger>
                      <TooltipContent>
                        {new Date(link.createdAt).toLocaleString()}
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
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}
