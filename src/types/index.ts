export interface Click {
  id: string;
  ipAddress: string;
  country: string;
  city: string;
  region: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'Other';
  os: 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS';
  referrer: string;
  isBot: boolean;
  clickedAt: string;
}

export interface SpoofData {
  title: string;
  description: string;
  imageUrl: string;
}

export interface Link {
  id: string;
  longUrl: string;
  shortCode: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  createdAt: string;
  clicks: Click[];
  // Link-specific settings
  isCloaked: boolean;
  fakePreviewPageUrl: string | null;
  spoof: SpoofData | null;
}

export interface Settings {
  // Global security settings
  botDetection: boolean;
  emailScannerProtection: boolean;
  captchaVerification: boolean;
  ipRateLimiting: boolean;
  
  // Global link behavior defaults
  linkCloaking: boolean;
  fakePreviewPages: boolean;
  fakePreviewPageUrl: string;
  spoofSocialPreviews: boolean;
}
