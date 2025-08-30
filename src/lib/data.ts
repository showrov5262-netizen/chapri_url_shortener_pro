
import type { Click, Link, Settings } from '@/types';

const generateClicks = (count: number, daysAgo: number, shortCode: string): Link['clicks'] => {
  const clicks = [];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Other'] as const;
  const devices = ['Desktop', 'Mobile', 'Tablet'] as const;
  const os = ['Windows', 'macOS', 'Linux', 'Android', 'iOS'] as const;
  const countries = [
    { name: 'United States', city: 'New York', region: 'NY', timezone: 'America/New_York' },
    { name: 'United Kingdom', city: 'London', region: 'ENG', timezone: 'Europe/London' },
    { name: 'Canada', city: 'Toronto', region: 'ON', timezone: 'America/Toronto' },
    { name: 'Germany', city: 'Berlin', region: 'BE', timezone: 'Europe/Berlin' },
    { name: 'France', city: 'Paris', region: 'IDF', timezone: 'Europe/Paris' },
    { name: 'Japan', city: 'Tokyo', region: '13', timezone: 'Asia/Tokyo' },
    { name: 'Australia', city: 'Sydney', region: 'NSW', timezone: 'Australia/Sydney' },
    { name: 'Brazil', city: 'São Paulo', region: 'SP', timezone: 'America/Sao_Paulo' },
    { name: 'India', city: 'Mumbai', region: 'MH', timezone: 'Asia/Kolkata' },
  ];
  const referrers = ['direct', 't.co', 'google.com', 'facebook.com', 'linkedin.com'];
  const isps = ['Comcast', 'Verizon', 'AT&T', 'T-Mobile', 'Spectrum'];
  const organizations = ['Google LLC', 'Microsoft Corporation', 'Apple Inc.', 'Amazon.com, Inc.', 'Facebook, Inc.'];
  const languages = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'ja-JP'];
  const screenResolutions = ['1920x1080', '1366x768', '2560x1440', '360x640', '375x812'];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    const country = countries[Math.floor(Math.random() * countries.length)];
    const isBot = Math.random() < 0.1; // 10% chance of being a bot
    const isEmailScanner = isBot && Math.random() < 0.2; // 2% chance of being an email scanner
    const currentOS = os[Math.floor(Math.random() * os.length)];
    const currentBrowser = browsers[Math.floor(Math.random() * browsers.length)];

    clicks.push({
      id: `${shortCode}-click-${i}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      clickedAt: date.toISOString(),
      country: country.name,
      city: country.city,
      region: country.region,
      isp: isps[Math.floor(Math.random() * isps.length)],
      organization: organizations[Math.floor(Math.random() * organizations.length)],
      timezone: country.timezone,
      language: languages[Math.floor(Math.random() * languages.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      deviceModel: currentOS === 'Android' ? 'Pixel 7' : currentOS === 'iOS' ? 'iPhone 14 Pro' : null,
      deviceBrand: currentOS === 'Android' ? 'Google' : currentOS === 'iOS' ? 'Apple' : null,
      browser: currentBrowser,
      browserVersion: currentBrowser === 'Chrome' ? '108.0' : '107.0',
      browserEngine: 'Blink',
      os: currentOS,
      osVersion: currentOS === 'Windows' ? '10' : currentOS === 'macOS' ? '13.1' : '16.2',
      screenResolution: screenResolutions[Math.floor(Math.random() * screenResolutions.length)],
      isBot: isBot,
      isEmailScanner: isEmailScanner,
    });
  }
  return clicks.sort((a, b) => new Date(b.clickedAt).getTime() - new Date(a.clickedAt).getTime());
};

export const mockLinks: Link[] = [
  {
    id: '1',
    longUrl: 'https://www.example.com/a-very-long-url-that-needs-to-be-shortened-for-marketing-campaign-1',
    shortCode: 'AbC123',
    title: 'Summer Marketing Campaign',
    description: 'Main link for the 2024 summer marketing campaign assets and resources.',
    thumbnailUrl: 'https://picsum.photos/1200/630?random=1',
    createdAt: '2024-07-15T10:00:00Z',
    clicks: generateClicks(1258, 30, 'AbC123'),
    // New properties
    redirectType: '301',
    isCloaked: false,
    useMetaRefresh: false,
    metaRefreshDelay: null,
    password: null,
    expiresAt: null,
    maxClicks: null,
    spoof: null,
    geoTargets: [],
    deviceTargets: [],
    abTestUrls: [],
    retargetingPixels: [],
  },
  {
    id: '2',
    longUrl: 'https://github.com/some-org/some-repo/pulls',
    shortCode: 'GhPulls',
    title: 'GitHub Repository PRs',
    description: 'A short link to the pull requests page of our main project repository.',
    createdAt: '2024-07-10T14:30:00Z',
    clicks: generateClicks(732, 45, 'GhPulls'),
    // New properties
    redirectType: '302',
    isCloaked: true,
    useMetaRefresh: false,
    metaRefreshDelay: null,
    password: null,
    expiresAt: null,
    maxClicks: null,
    spoof: null,
    geoTargets: [],
    deviceTargets: [
        { device: 'iOS', url: 'https://apps.apple.com/app/github' },
        { device: 'Android', url: 'https://play.google.com/store/apps/details?id=com.github.android' }
    ],
    abTestUrls: [],
    retargetingPixels: [],
  },
  {
    id: '3',
    longUrl: 'https://docs.google.com/document/d/some-long-hash-string-for-a-document/edit',
    shortCode: 'ProjSpec',
    title: 'Project Specification Document',
    description: 'Internal document outlining the specifications for the new feature release.',
    thumbnailUrl: 'https://picsum.photos/1200/630?random=2',
    createdAt: '2024-06-25T09:00:00Z',
    clicks: generateClicks(421, 60, 'ProjSpec'),
    // New properties
    redirectType: '302',
    isCloaked: false,
    useMetaRefresh: true,
    metaRefreshDelay: 5,
    password: 'supersecret',
    expiresAt: '2024-08-30T23:59:59Z',
    maxClicks: 500,
    spoof: {
      title: 'Project Alpha Specs [CONFIDENTIAL]',
      description: 'Internal use only. Do not distribute.',
      imageUrl: 'https://picsum.photos/1200/630?random=10',
    },
    geoTargets: [
        { country: 'US', url: 'https://example.com/us-ver' },
        { country: 'GB', url: 'https://example.com/gb-ver' }
    ],
    deviceTargets: [],
    abTestUrls: [],
    retargetingPixels: [
        { provider: 'Facebook', id: '123456789' }
    ],
  },
  {
    id: '4',
    longUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    shortCode: 'VidTut',
    title: 'Video Tutorial',
    description: 'Link to the official video tutorial for our product.',
    createdAt: '2024-05-20T18:00:00Z',
    clicks: generateClicks(2345, 90, 'VidTut'),
    redirectType: '301',
    isCloaked: false,
    useMetaRefresh: false,
    metaRefreshDelay: null,
    password: null,
    expiresAt: null,
    maxClicks: null,
    spoof: null,
    geoTargets: [],
    deviceTargets: [],
    abTestUrls: [],
    retargetingPixels: [],
  },
  {
    id: '5',
    longUrl: 'https://blog.example.com/posts/how-to-improve-your-workflow',
    shortCode: 'BlogWflw',
    title: 'Blog Post: Improve Your Workflow',
    description: 'Latest article on our company blog about workflow improvements.',
    thumbnailUrl: 'https://picsum.photos/1200/630?random=3',
    createdAt: '2024-07-18T11:00:00Z',
    clicks: generateClicks(89, 20, 'BlogWflw'),
    redirectType: '301',
    isCloaked: false,
    useMetaRefresh: false,
    metaRefreshDelay: null,
    password: null,
    expiresAt: null,
    maxClicks: null,
    spoof: null,
    geoTargets: [],
    deviceTargets: [],
    abTestUrls: [],
    retargetingPixels: [],
  },
];

export const mockSettings: Settings = {
    // Security
    botDetection: true,
    manualBotDetection: {
      blockKnownBots: true,
      blockProxies: false,
      blockDataCenterIPs: false,
      blockEmailScanners: true,
    },
    malwareProtection: true,
    captchaVerification: false,
    ipRateLimiting: true,
    
    // Redirection
    defaultRedirectType: '301',
    linkCloaking: false, // Frame-based
    metaRefresh: false,

    // Advanced Features
    passwordProtection: false,
    linkExpiration: false,
    geoTargeting: true,
    deviceTargeting: true,
}
