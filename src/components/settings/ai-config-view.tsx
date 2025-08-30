'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { validateApiKey } from "@/ai/flows/validate-api-key";

type ApiStatus = 'unknown' | 'valid' | 'invalid' | 'checking';

export default function AiConfigView() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<ApiStatus>('unknown');

  const handleSave = () => {
    toast({
      title: "API Key Updated",
      description: "Remember to set this in your environment variables for deployment.",
    });
    setStatus('unknown');
  };

  const handleCheckStatus = async () => {
    if (!apiKey) {
        toast({
            variant: "destructive",
            title: "API Key Missing",
            description: "Please enter an API key to check its status.",
        });
        return;
    }
    setStatus('checking');
    try {
        const result = await validateApiKey({ apiKey });
        if (result.isValid) {
            setStatus('valid');
            toast({
                title: "API Key is Valid",
                description: "Successfully connected to the AI provider.",
            });
        } else {
            setStatus('invalid');
            toast({
                variant: "destructive",
                title: "API Key is Invalid",
                description: "Could not connect to the AI provider. Please check your key.",
            });
        }
    } catch (error) {
        console.error(error);
        setStatus('invalid');
        toast({
            variant: "destructive",
            title: "Error Checking Status",
            description: "An unexpected error occurred. See console for details.",
        });
    }
  };

  const getStatusIndicator = () => {
    switch(status) {
        case 'valid':
            return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700"><CheckCircle2 className="h-4 w-4 mr-1" /> Valid</Badge>;
        case 'invalid':
            return <Badge variant="destructive"><XCircle className="h-4 w-4 mr-1" /> Invalid</Badge>;
        case 'checking':
             return <Badge variant="outline"><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Checking...</Badge>;
        default:
            return <Badge variant="outline">Unknown</Badge>;
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Google Gemini API</CardTitle>
                <CardDescription>
                The primary AI provider for this application.
                </CardDescription>
            </div>
            {getStatusIndicator()}
        </div>
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
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How to update your API Key</AlertTitle>
          <AlertDescription>
            For this new key to be used in a deployed environment, you must set the <code className="font-mono bg-muted p-1 rounded-sm">GEMINI_API_KEY</code> environment variable in your deployment settings. This UI is for configuration and testing. Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google AI Studio</a>.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="secondary" onClick={handleCheckStatus} disabled={status === 'checking' || !apiKey}>Check Status</Button>
        <Button onClick={handleSave}>Save Key</Button>
      </CardFooter>
    </Card>
  );
}
