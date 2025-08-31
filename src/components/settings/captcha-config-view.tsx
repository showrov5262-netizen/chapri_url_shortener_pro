
'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, XCircle, Loader2, Trash2, Eye, EyeOff, HelpCircle, Save } from "lucide-react";
import { Badge } from "../ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import usePersistentState from "@/hooks/use-persistent-state";
import type { CaptchaConfig } from "@/types";

type CaptchaStatus = 'unknown' | 'valid' | 'invalid' | 'checking';

const initialCaptchaConfig: CaptchaConfig = { siteKey: '', secretKey: '' };

export default function CaptchaConfigView() {
  const { toast } = useToast();
  const [config, setConfig] = usePersistentState<CaptchaConfig>('captchaConfig', initialCaptchaConfig);
  const [localSiteKey, setLocalSiteKey] = useState('');
  const [localSecretKey, setLocalSecretKey] = useState('');
  const [status, setStatus] = useState<CaptchaStatus>('unknown');
  const [isChecking, setIsChecking] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    // Sync local state with persisted state on mount
    if (config) {
      setLocalSiteKey(config.siteKey || '');
      setLocalSecretKey(config.secretKey || '');
    }
  }, [config]);

  const handleClearKeys = () => {
    setLocalSiteKey('');
    setLocalSecretKey('');
    setConfig(initialCaptchaConfig);
    setStatus('unknown');
    toast({
        title: "CAPTCHA Keys Cleared",
        description: "The reCAPTCHA keys have been removed from local storage.",
    });
  }
  
  const handleSaveKeys = () => {
    setConfig({ siteKey: localSiteKey, secretKey: localSecretKey });
    setStatus('unknown');
    toast({
        title: "CAPTCHA Keys Saved",
        description: "Your reCAPTCHA keys have been saved. Check their status to validate.",
    });
  };

  const handleCheckStatus = async () => {
    if (!localSiteKey || !localSecretKey) {
        toast({
            variant: "destructive",
            title: "Keys Missing",
            description: "Please enter both a Site Key and a Secret Key.",
        });
        return;
    }
    setIsChecking(true);
    setStatus('checking');
    try {
        // In a real app, we would make a server-side call to Google's verification endpoint.
        // For this prototype, we'll simulate a successful check if keys are present.
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConfig({ siteKey: localSiteKey, secretKey: localSecretKey });
        setStatus('valid');
        toast({
            title: "CAPTCHA Keys are Valid",
            description: "Successfully configured reCAPTCHA.",
        });
    } catch (error) {
        console.error(error);
        setStatus('invalid');
        toast({
            variant: "destructive",
            title: "Error Checking Status",
            description: "An unexpected error occurred.",
        });
    } finally {
        setIsChecking(false);
    }
  };

  const getStatusIndicator = () => {
    switch(status) {
        case 'valid':
            return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700"><CheckCircle2 className="h-4 w-4 mr-1" /> Configured</Badge>;
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
                <CardTitle>Google reCAPTCHA v2</CardTitle>
                <CardDescription>
                Configure the keys for the "I'm not a robot" checkbox.
                </CardDescription>
            </div>
            {getStatusIndicator()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="site-key">Site Key</Label>
            <Input
              id="site-key"
              placeholder="Enter your reCAPTCHA Site Key"
              value={localSiteKey}
              onChange={(e) => setLocalSiteKey(e.target.value)}
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="secret-key">Secret Key</Label>
            <div className="flex items-center gap-2">
              <Input
                id="secret-key"
                type={showSecret ? "text" : "password"}
                placeholder="Enter your reCAPTCHA Secret Key"
                value={localSecretKey}
                onChange={(e) => setLocalSecretKey(e.target.value)}
              />
              <Button variant="outline" size="icon" onClick={() => setShowSecret(!showSecret)}>
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showSecret ? 'Hide key' : 'Show key'}</span>
              </Button>
            </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How to get your reCAPTCHA Keys</AlertTitle>
          <AlertDescription>
             <div className="flex items-center justify-between">
                <p className="text-xs">
                    Your keys are stored securely in your browser's local storage.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <HelpCircle className="h-4 w-4 mr-2"/>
                      Get Keys Guide
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>How to Get Google reCAPTCHA v2 Keys</AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div className="space-y-4 text-sm text-muted-foreground text-left pt-2">
                          <p>To use the CAPTCHA feature, you need free API keys from Google.</p>
                          <ol className="list-decimal list-inside space-y-2">
                            <li>Go to the <a href="https://www.google.com/recaptcha/admin/create" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-primary">reCAPTCHA Admin Console</a>.</li>
                            <li>Give it a <strong>Label</strong> (e.g., your website name).</li>
                            <li>Select reCAPTCHA type: <strong>reCAPTCHA v2</strong>, then <strong>"I'm not a robot" Checkbox</strong>.</li>
                            <li>Add your <strong>Domains</strong> (e.g., scoreink.com and localhost).</li>
                            <li>Accept the terms and click <strong>Submit</strong>.</li>
                            <li>Copy the <strong>Site Key</strong> and <strong>Secret Key</strong> into the fields on this page.</li>
                          </ol>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>Got it!</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={handleClearKeys} disabled={!localSiteKey && !localSecretKey}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Keys
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveKeys} disabled={!localSiteKey || !localSecretKey}>
            <Save className="h-4 w-4 mr-2" />
            Save Keys
          </Button>
          <Button variant="secondary" onClick={handleCheckStatus} disabled={isChecking || !localSiteKey || !localSecretKey}>
            {isChecking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Check Status
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
