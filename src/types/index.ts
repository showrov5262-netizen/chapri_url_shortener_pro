

export interface Click {
  id: string;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  clickedAt: string;
  country: string;
  city: string;
  region: string;
  isp: string;
  organization: string;
  timezone: string;
  language: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  deviceModel: string | null;
  deviceBrand: string | null;
  browser: 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'Other';
  browserVersion: string;
  browserEngine: string;
  os: 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS';
  osVersion: string;
  screenResolution: string;
  isBot: boolean;
  isEmailScanner: boolean;
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

export interface LinkLoadingPageConfig {
  useGlobal: boolean;
  mode: 'global' | 'random' | 'specific';
  selectedPageId: string | null;
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
  metaRefreshDelay: number | null; // Delay in seconds for meta refresh
  spoof: SpoofData | null; // Spoof Social Media Preview
  loadingPageConfig?: LinkLoadingPageConfig; // Per-link loading page settings

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

export interface LoadingPage {
  id: string;
  name: string;
  content: string; // The HTML/CSS content of the loading page
}

export interface Settings {
  // Global security settings
  botDetection: boolean; // AI-powered
  manualBotDetection: {
    blockKnownBots: boolean;
    blockProxies: boolean;
    blockDataCenterIPs: boolean;
    blockEmailScanners: boolean;
  };
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

  // Loading Page Settings
  loadingPageSettings: {
    enabled: boolean;
    mode: 'specific' | 'random';
    selectedPageId: string | null;
  };
}
