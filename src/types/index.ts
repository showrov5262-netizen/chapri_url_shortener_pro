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

export interface Link {
  id: string;
  longUrl: string;
  shortCode: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  createdAt: string;
  clicks: Click[];
}

export interface Settings {
  botDetection: boolean;
  emailScannerProtection: boolean;
  captchaVerification: boolean;
  ipRateLimiting: boolean;
  fakeReferrerProtection: boolean;
  customThumbnails: boolean;
  fakePreviewPages: boolean;
  redirectDelays: boolean;
}
