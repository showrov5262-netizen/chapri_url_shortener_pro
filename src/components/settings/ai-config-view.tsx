'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, XCircle, Loader2, Trash2, Eye, EyeOff, HelpCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { validateApiKey } from "@/ai/flows/validate-api-key";
import { useAiState } from "@/hooks/use-ai-state";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

export default function AiConfigView() {
  const { toast } = useToast();
  const { 
    apiKey, 
    setApiKey, 
    status, 
    setStatus, 
    isChecking, 
    setIsChecking, 
    errorMessage, 
    setErrorMessage 
  } = useAiState();
  const [showKey, setShowKey] = useState(false);

  const handleClearKey = () => {
    setApiKey('');
    setStatus('unknown');
    setErrorMessage(null);
    toast({
        title: "API Key Cleared",
        description: "The local API key has been removed.",
    });
  }

  const handleCheckStatus = async () => {
    if (!apiKey) {
        toast({
            variant: "destructive",
            title: "API Key Missing",
            description: "Please enter an API key to check its status.",
        });
        return;
    }
    setIsChecking(true);
    setErrorMessage(null);
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
            setErrorMessage(result.error || "An unknown validation error occurred.");
            toast({
                variant: "destructive",
                title: "API Key is Invalid",
                description: "Could not connect. See the error message for details.",
            });
        }
    } catch (error: any) {
        console.error(error);
        setStatus('invalid');
        setErrorMessage(error.message || "An unexpected error occurred.");
        toast({
            variant: "destructive",
            title: "Error Checking Status",
            description: "An unexpected error occurred. See console for details.",
        });
    } finally {
        setIsChecking(false);
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
            <div className="flex items-center gap-2">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder="Enter your Google AI Studio API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button variant="outline" size="icon" onClick={() => setShowKey(!showKey)}>
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showKey ? 'Hide key' : 'Show key'}</span>
              </Button>
            </div>
        </div>
        
        {status === 'invalid' && errorMessage && (
            <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Validation Error</AlertTitle>
                <AlertDescription>
                    <p className="font-mono text-xs break-all">{errorMessage}</p>
                </AlertDescription>
            </Alert>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How to update your API Key</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <p className="text-xs">
              For a deployed app, set the <code className="font-mono bg-muted p-1 rounded-sm text-xs">GEMINI_API_KEY</code> environment variable. This UI is for local testing.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" size="sm">
                  <HelpCircle className="h-4 w-4 mr-2"/>
                  Get a Key
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>How to Get a Gemini API Key</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-4 text-sm text-muted-foreground text-left pt-2">
                      <p>To use the AI features, you need a free API key from Google AI Studio.</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-primary">Google AI Studio</a>.</li>
                        <li>Sign in with your Google account.</li>
                        <li>Click on <strong>"Create API key in new project"</strong>.</li>
                        <li>Copy the generated API key.</li>
                        <li>Paste it into the input field on this page and click "Check Status".</li>
                      </ol>
                      <p>Make sure to keep your API key secure and do not share it publicly.</p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Got it!</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={handleClearKey} disabled={!apiKey}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Key
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCheckStatus} disabled={isChecking || !apiKey}>
            {isChecking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Check Status
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
