
'use client'

import type { Click } from "@/types";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, Globe, Monitor, Smartphone, Tablet, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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


const DeviceIcon = ({ device }: { device: Click['device'] }) => {
  if (device === 'Desktop') return <Monitor className="h-4 w-4" />;
  if (device === 'Mobile') return <Smartphone className="h-4 w-4" />;
  if (device === 'Tablet') return <Tablet className="h-4 w-4" />;
  return null;
}

export default function ClickHistoryTable({ clicks: initialClicks }: { clicks: Click[] }) {
  const { toast } = useToast();
  const [clicks, setClicks] = useState(initialClicks);

  const handleDelete = (clickId: string) => {
    setClicks(clicks.filter(c => c.id !== clickId));
    toast({
      title: "Click log deleted",
      description: "The click history has been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Click History</CardTitle>
        <CardDescription>A detailed log of every click on this link.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border shadow-sm">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="hidden lg:table-cell">Referrer</TableHead>
                <TableHead className="hidden md:table-cell">Device & OS</TableHead>
                <TableHead className="hidden lg:table-cell">User Agent</TableHead>
                <TableHead className="text-right">Flags</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {clicks.map((click) => (
                <TableRow key={click.id}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default">{new Date(click.clickedAt).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{new Date(click.clickedAt).toLocaleString()}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{click.city}, {click.country}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">{click.referrer}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <DeviceIcon device={click.device} />
                        <span>{click.os} {click.osVersion}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">View</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Full User Agent</AlertDialogTitle>
                            <AlertDialogDescription className="break-all">
                              {click.userAgent}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogAction>Close</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                    <TableCell className="text-right">
                      {click.isBot && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Bot className="h-5 w-5 text-destructive inline-block" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{click.isEmailScanner ? 'Email Scanner Bot' : 'Bot Detected'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
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
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(click.id)}>
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
      </CardContent>
    </Card>
  );
}
