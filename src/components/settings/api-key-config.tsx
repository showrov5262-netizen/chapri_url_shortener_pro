'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function ApiKeyConfig() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    // In a real application, you would securely send this key to your backend
    // to be stored as an environment variable or in a secure secret manager.
    // For this prototype, we'll just show a success message.
    toast({
      title: "API Key Updated",
      description: "Your new Gemini API key has been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Provider Configuration</CardTitle>
        <CardDescription>
          Manage the API key for the generative AI features in this application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Google AI Studio API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
        </div>
        <div className="flex justify-end">
            <Button onClick={handleSave}>Save Key</Button>
        </div>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How to update your API Key</AlertTitle>
          <AlertDescription>
            To update the key used by the application, you must set the <code className="font-mono bg-muted p-1 rounded-sm">GEMINI_API_KEY</code> environment variable in your deployment settings. This UI is for your reference. Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google AI Studio</a>.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
