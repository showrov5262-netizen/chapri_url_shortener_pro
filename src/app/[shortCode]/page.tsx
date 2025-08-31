
// src/app/[shortCode]/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import type { Link, Click, LoadingPage, Settings } from '@/types';
import { mockLinks as initialMockLinks } from '@/lib/data';

// --- Client-side Data Management ---
const getLinksFromStorage = (): Link[] => {
  if (typeof window === 'undefined') return initialMockLinks;
  try {
    const item = window.localStorage.getItem('mockLinksData');
    return item ? JSON.parse(item) : initialMockLinks;
  } catch (error) {
    console.error("Failed to parse links from localStorage", error);
    return initialMockLinks;
  }
};

const getLoadingPagesFromStorage = (): LoadingPage[] => {
    if (typeof window === 'undefined') return [];
    try {
        const item = window.localStorage.getItem('customLoadingPages');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Failed to parse loading pages from localStorage", error);
        return [];
    }
}

const getSettingsFromStorage = (): Settings | null => {
    if (typeof window === 'undefined') return null;
    try {
        const item = window.localStorage.getItem('globalSettings');
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        return null;
    }
}


const addClickToLinkInStorage = (shortCode: string): Link | null => {
    if (typeof window === 'undefined') return null;

    const links = getLinksFromStorage();
    const linkIndex = links.findIndex((l) => l.shortCode === shortCode);

    if (linkIndex !== -1) {
        const newClick: Click = {
            id: `${shortCode}-click-${Date.now()}`,
            clickedAt: new Date().toISOString(),
            ipAddress: `203.0.113.${Math.floor(Math.random() * 255)}`, // Mock IP
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            country: 'US', // Mock data, real app would use IP lookup
            city: 'Mountain View',
            region: 'CA',
            isp: 'Mock ISP',
            organization: 'Mock Org',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
            deviceModel: null,
            deviceBrand: null,
            browser: 'Other',
            browserVersion: 'N/A',
            browserEngine: 'N/A',
            os: 'Other',
            osVersion: 'N/A',
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            isBot: false,
            isEmailScanner: false,
        };

        links[linkIndex].clicks.unshift(newClick);

        try {
            window.localStorage.setItem('mockLinksData', JSON.stringify(links));
            return links[linkIndex];
        } catch (error) {
            console.error("Failed to save updated links to localStorage", error);
            return null;
        }
    }
    return null;
};

const getLoadingPageContent = (link: Link): string => {
    const loadingPages = getLoadingPagesFromStorage();
    const globalSettings = getSettingsFromStorage();
    
    const defaultConfig = globalSettings?.loadingPageSettings ?? { enabled: false, mode: 'random', selectedPageId: null };
    
    const usePerLinkConfig = link.loadingPageConfig && !link.loadingPageConfig.useGlobal;
    const config = usePerLinkConfig ? link.loadingPageConfig! : defaultConfig;

    if (!config.enabled && !usePerLinkConfig) {
        return '<p>Redirecting...</p>';
    }

    let pageId: string | null = null;
    const effectiveMode = config.mode === 'global' ? defaultConfig.mode : config.mode;
    
    if (effectiveMode === 'random') {
        if (loadingPages.length > 0) {
            const randomIndex = Math.floor(Math.random() * loadingPages.length);
            pageId = loadingPages[randomIndex].id;
        }
    } else if (effectiveMode === 'specific') {
        pageId = config.selectedPageId ?? defaultConfig.selectedPageId;
    }

    const page = loadingPages.find(p => p.id === pageId);
    return page ? page.content : '<p>Redirecting...</p>';
}

function getDestinationUrl(link: Link): string {
    // 1. Check for Geo-targeting (mock country)
    const userCountry = 'US'; // In a real app, this would come from IP lookup
    const geoTarget = link.geoTargets?.find(t => t.country === userCountry);
    if (geoTarget) return geoTarget.url;

    // 2. Check for Device-targeting
    const userAgent = navigator.userAgent;
    const isMobile = /Mobi|Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    
    let deviceType: 'iOS' | 'Android' | 'Desktop' = 'Desktop';
    if (isIOS) deviceType = 'iOS';
    else if (isAndroid) deviceType = 'Android';
    
    const deviceTarget = link.deviceTargets?.find(t => t.device === deviceType);
    if (deviceTarget) return deviceTarget.url;
    
    // 3. Handle A/B Testing (Rotator)
    const allUrls = [link.longUrl, ...(link.abTestUrls || [])].filter(Boolean);
    if (allUrls.length > 1) {
        const randomIndex = Math.floor(Math.random() * allUrls.length);
        return allUrls[randomIndex];
    }
    
    // 4. Default to the main longUrl
    return link.longUrl;
}

function injectPixels(link: Link) {
    if (!link.retargetingPixels || typeof document === 'undefined') return;

    link.retargetingPixels.forEach(pixel => {
        if (pixel.provider === 'Facebook' && pixel.id) {
            const script = document.createElement('script');
            script.innerHTML = `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixel.id}');
                fbq('track', 'PageView');
            `;
            document.head.appendChild(script);
        }
        // Add other pixel providers (Google, LinkedIn, etc.) here in a similar way
    });
}

export default function ShortLinkRedirectPage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params;
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'cloaking' | 'rendering_loading_page' | 'not_found'>('loading');
  const [pageContent, setPageContent] = useState<string>('');
  const [cloakedUrl, setCloakedUrl] = useState<string>('');
  const [pageTitle, setPageTitle] = useState('Redirecting...');

  useEffect(() => {
    // This effect runs only once on the client-side to handle the entire redirect flow.
    if (shortCode) {
      // 1. Find the link in storage
      const allLinks = getLinksFromStorage();
      const foundLink = allLinks.find((l) => l.shortCode === shortCode);

      if (!foundLink) {
        setStatus('not_found');
        return;
      }
      
      // 2. Set the page title
      document.title = foundLink.title || 'Redirecting...';
      setPageTitle(foundLink.title);

      // 3. LOG THE CLICK! This is guaranteed to run before any redirect.
      addClickToLinkInStorage(shortCode);
      
      // 4. Inject any retargeting pixels
      injectPixels(foundLink);

      // 5. Determine the final destination URL (handles A/B, Geo, Device)
      let finalUrl = getDestinationUrl(foundLink);
      
      // 6. Handle Base64 decoding if necessary
      if (foundLink.useBase64Encoding) {
        try {
            finalUrl = atob(finalUrl);
        } catch (e) {
            console.error("Failed to decode Base64 URL:", e);
        }
      }

      // 7. Decide the redirection method
      if (foundLink.isCloaked) {
        setCloakedUrl(finalUrl);
        setStatus('cloaking');
      } else if (foundLink.useMetaRefresh) {
        const delay = foundLink.metaRefreshDelay ?? 0;
        const content = getLoadingPageContent(foundLink);
        
        const meta = document.createElement('meta');
        meta.httpEquiv = 'refresh';
        meta.content = `${delay};url=${finalUrl}`;
        document.head.appendChild(meta);
        
        setPageContent(content);
        setStatus('rendering_loading_page');
      } else {
        // Standard Redirect
        window.location.href = finalUrl;
        setStatus('redirecting');
      }
    }
  }, [shortCode]);

  // --- Render based on status ---

  if (status === 'loading') {
    return <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '2rem' }}>Loading link...</div>;
  }
  
  if (status === 'not_found') {
    notFound();
  }

  if (status === 'cloaking') {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}>
        <iframe
          src={cloakedUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={pageTitle}
        />
      </div>
    );
  }

  if (status === 'rendering_loading_page') {
    return (
        <div
            style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}
            dangerouslySetInnerHTML={{ __html: pageContent }}
        />
    );
  }

  // Fallback content for standard redirect while the browser processes it
  return <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '2rem' }}>Redirecting you now...</div>;
}
