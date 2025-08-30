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

export interface GeoTarget {
  country: string; // e.g., 'US', 'GB'
  url: string;
}

export interface DeviceTarget {
  device: 'iOS' | 'Android' | 'Desktop';
  url: string;
}

export interface RetargetingPixel {
    provider: 'Facebook' | 'Google Ads' | 'LinkedIn' | 'Twitter';
    id: string;
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

  // Redirection Settings
  redirectType: '301' | '302'; // Standard Redirect
  isCloaked: boolean; // Frame-based cloaking
  useMetaRefresh: boolean; // Meta Refresh Redirect
  spoof: SpoofData | null; // Spoof Social Media Preview

  // Security & Access
  password: string | null; // Password Protection
  expiresAt: string | null; // Link Expiration (date)
  maxClicks: number | null; // Link Expiration (clicks)

  // Advanced Targeting
  geoTargets: GeoTarget[];
  deviceTargets: DeviceTarget[];
  abTestUrls: string[]; // A/B Testing (Link Rotator)
  retargetingPixels: RetargetingPixel[];
}

export interface Settings {
  // Global security settings
  botDetection: boolean;
  malwareProtection: boolean; // Phishing & Malware Protection
  captchaVerification: boolean;
  ipRateLimiting: boolean;
  
  // Global redirection defaults
  defaultRedirectType: '301' | '302';
  linkCloaking: boolean; // Frame-based cloaking
  metaRefresh: boolean; // Meta Refresh Redirect

  // Global advanced feature defaults
  passwordProtection: boolean;
  linkExpiration: boolean;
  geoTargeting: boolean;
  deviceTargeting: boolean;
}
