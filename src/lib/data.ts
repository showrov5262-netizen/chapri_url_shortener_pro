
import type { Link, Settings, LoadingPage } from '@/types';

export const mockLinks: Link[] = [
  {
    id: '1',
    longUrl: 'aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20=', // "https://www.example.com" encoded
    shortCode: 'demo',
    title: 'My First Link',
    description: 'This is a sample link to get you started. You can delete it later.',
    thumbnailUrl: 'https://picsum.photos/1200/630?random=1',
    createdAt: new Date().toISOString(),
    clicks: [],
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
    useBase64Encoding: true,
    captchaVerification: false,
  }
];

export const mockLoadingPages: LoadingPage[] = [
  {
    id: 'lp-1',
    name: 'Pulse',
    content: `
      <style>
        body { display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f0f2f5; font-family: sans-serif; }
        .pulse-container { text-align: center; }
        .pulse-spinner { width: 60px; height: 60px; border-radius: 50%; background-color: #007bff; animation: pulse 1.5s infinite ease-in-out; }
        @keyframes pulse {
          0% { transform: scale(0.1); opacity: 0.1; }
          70% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 0; }
        }
        .pulse-text { margin-top: 20px; font-size: 18px; color: #333; }
      </style>
      <div class="pulse-container">
        <div class="pulse-spinner"></div>
        <p class="pulse-text">Redirecting, please wait...</p>
      </div>
    `
  },
  {
    id: 'lp-2',
    name: 'Spinner',
    content: `
      <style>
        body { display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #282c34; font-family: sans-serif; }
        .spinner-container { text-align: center; }
        .spinner { width: 50px; height: 50px; border: 5px solid #61dafb; border-top: 5px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner-text { margin-top: 20px; font-size: 18px; color: #fff; }
      </style>
      <div class="spinner-container">
        <div class="spinner"></div>
        <p class="spinner-text">Preparing your link...</p>
      </div>
    `
  },
  {
    id: 'lp-3',
    name: "Newton's Cradle",
    content: `
      <style>
        body { display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #fff; font-family: sans-serif; }
        .cradle-container { text-align: center; }
        .newton-cradle { position: relative; display: flex; justify-content: center; width: 200px; }
        .newton-cradle-dot { position: relative; width: 30px; height: 30px; border-radius: 50%; background: #444; }
        .newton-cradle-dot::before { content: ''; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); width: 2px; height: 100px; background: #444; }
        .newton-cradle-dot:first-child { animation: newton-left 2s ease-in-out infinite; }
        .newton-cradle-dot:last-child { animation: newton-right 2s ease-in-out infinite 1s; }
        @keyframes newton-left { 0%, 25% { transform: rotate(30deg); } 50%, 100% { transform: rotate(0); } }
        @keyframes newton-right { 0%, 25% { transform: rotate(-30deg); } 50%, 100% { transform: rotate(0); } }
        .cradle-text { margin-top: 120px; font-size: 18px; color: #333; }
      </style>
      <div class="cradle-container">
        <div class="newton-cradle">
          <div class="newton-cradle-dot"></div>
          <div class="newton-cradle-dot"></div>
          <div class="newton-cradle-dot"></div>
          <div class="newton-cradle-dot"></div>
        </div>
        <p class="cradle-text">Hold on, we're taking you there!</p>
      </div>
    `
  }
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
    spoof: false,

    // Advanced Features
    passwordProtection: false,
    linkExpiration: false,
    geoTargeting: false,
    deviceTargeting: false,
    abTestUrls: false,
    retargetingPixels: false,
    useBase64Encoding: false,

    // Loading Page Settings
    loadingPageSettings: {
      enabled: true,
      mode: 'random',
      selectedPageId: null,
    },
}
