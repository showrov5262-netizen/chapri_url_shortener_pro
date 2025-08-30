
'use client'

import { useState } from "react";
import type { LoadingPage, Settings } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
import { Eye, PlusCircle, Trash2, Edit } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { EditLoadingPageDialog } from "./edit-loading-page-dialog";

type LoadingPageSettings = Settings['loadingPageSettings'];

interface LoadingPagesViewProps {
  initialSettings: LoadingPageSettings;
  loadingPages: LoadingPage[];
}

export default function LoadingPagesView({ initialSettings, loadingPages: initialPages }: LoadingPagesViewProps) {
  const [settings, setSettings] = useState<LoadingPageSettings>(initialSettings);
  const [loadingPages, setLoadingPages] = useState<LoadingPage[]>(initialPages);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<LoadingPage | null>(null);

  const handleSettingChange = (key: keyof LoadingPageSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateNew = () => {
    setEditingPage(null); // No page is being edited, so we are creating
    setIsEditDialogOpen(true);
  }

  const handleEdit = (page: LoadingPage) => {
    setEditingPage(page);
    setIsEditDialogOpen(true);
  }

  const handleSavePage = (pageData: LoadingPage) => {
    if (editingPage) { // We are editing an existing page
      setLoadingPages(loadingPages.map(p => p.id === pageData.id ? pageData : p));
    } else { // We are creating a new page
      setLoadingPages([...loadingPages, { ...pageData, id: `lp-${Date.now()}` }]);
    }
    setIsEditDialogOpen(false);
    setEditingPage(null);
  }

  const handleDelete = (pageId: string) => {
    setLoadingPages(loadingPages.filter(p => p.id !== pageId));
    // If the deleted page was the selected one, reset the selection
    if (settings.selectedPageId === pageId) {
        handleSettingChange('selectedPageId', null);
    }
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Enable and configure how loading pages are displayed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Enable Loading Pages</Label>
                <p className="text-xs text-muted-foreground">
                  Show a loading page during redirect delays.
                </p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
              />
            </div>

            <div className="space-y-4">
              <Label>Display Mode</Label>
              <RadioGroup
                value={settings.mode}
                onValueChange={(value: 'specific' | 'random') => handleSettingChange('mode', value)}
                disabled={!settings.enabled}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="random" id="random" />
                  <Label htmlFor="random" className="font-normal">Random</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" id="specific" />
                  <Label htmlFor="specific" className="font-normal">Specific</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="select-page">Select a Page</Label>
              <Select
                value={settings.selectedPageId ?? ""}
                onValueChange={(value) => handleSettingChange('selectedPageId', value)}
                disabled={!settings.enabled || settings.mode !== 'specific'}
              >
                <SelectTrigger id="select-page">
                  <SelectValue placeholder="Select a loading page" />
                </SelectTrigger>
                <SelectContent>
                  {loadingPages.map(page => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
              <Button>Save Changes</Button>
          </CardFooter>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Designs</CardTitle>
              <CardDescription>
                  Manage your saved loading page designs.
              </CardDescription>
            </div>
            <Button size="sm" onClick={handleCreateNew}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
              {loadingPages.map(page => (
                  <Card key={page.id}>
                      <CardHeader>
                          <CardTitle className="text-lg">{page.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="aspect-video w-full">
                          <iframe
                              srcDoc={page.content}
                              className="w-full h-full border rounded-md"
                              sandbox="allow-scripts"
                              scrolling="no"
                          />
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-2" /> Preview</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-4xl h-[80vh]">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Preview: {page.name}</AlertDialogTitle>
                              </AlertDialogHeader>
                              <div className="w-full h-full border rounded-lg overflow-hidden">
                                 <iframe
                                  srcDoc={page.content}
                                  className="w-full h-full"
                                  sandbox="allow-scripts"
                                 />
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogAction>Close</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(page)}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the "{page.name}" loading page design. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(page.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </CardFooter>
                  </Card>
              ))}
          </CardContent>
        </Card>
      </div>

      <EditLoadingPageDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        pageData={editingPage}
        onSave={handleSavePage}
      />
    </>
  );
}
