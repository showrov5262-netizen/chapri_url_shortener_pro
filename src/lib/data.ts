import type { Link, Settings } from '@/types';

const generateClicks = (count: number, daysAgo: number, shortCode: string): Link['clicks'] => {
  const clicks = [];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Other'] as const;
  const devices = ['Desktop', 'Mobile', 'Tablet'] as const;
  const os = ['Windows', 'macOS', 'Linux', 'Android', 'iOS'] as const;
  const countries = [
    { name: 'United States', city: 'New York', region: 'NY' },
    { name: 'United Kingdom', city: 'London', region: 'ENG' },
    { name: 'Canada', city: 'Toronto', region: 'ON' },
    { name: 'Germany', city: 'Berlin', region: 'BE' },
    { name: 'France', city: 'Paris', region: 'IDF' },
    { name: 'Japan', city: 'Tokyo', region: '13' },
    { name: 'Australia', city: 'Sydney', region: 'NSW' },
    { name: 'Brazil', city: 'São Paulo', region: 'SP' },
    { name: 'India', city: 'Mumbai', region: 'MH' },
  ];
  const referrers = ['direct', 't.co', 'google.com', 'facebook.com', 'linkedin.com'];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    const country = countries[Math.floor(Math.random() * countries.length)];
    const isBot = Math.random() < 0.1; // 10% chance of being a bot

    clicks.push({
      id: `${shortCode}-click-${i}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      country: country.name,
      city: country.city,
      region: country.region,
      device: devices[Math.floor(Math.random() * devices.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      os: os[Math.floor(Math.random() * os.length)],
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      isBot: isBot,
      clickedAt: date.toISOString(),
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
  },
  {
    id: '2',
    longUrl: 'https://github.com/some-org/some-repo/pulls',
    shortCode: 'GhPulls',
    title: 'GitHub Repository PRs',
    description: 'A short link to the pull requests page of our main project repository.',
    createdAt: '2024-07-10T14:30:00Z',
    clicks: generateClicks(732, 45, 'GhPulls'),
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
  },
  {
    id: '4',
    longUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    shortCode: 'VidTut',
    title: 'Video Tutorial',
    description: 'Link to the official video tutorial for our product.',
    createdAt: '2024-05-20T18:00:00Z',
    clicks: generateClicks(2345, 90, 'VidTut'),
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
  },
];

export const mockSettings: Settings = {
    botDetection: true,
    emailScannerProtection: true,
    captchaVerification: false,
    ipRateLimiting: true,
    fakeReferrerProtection: false,
    customThumbnails: true,
    fakePreviewPages: false,
    redirectDelays: true,
}
