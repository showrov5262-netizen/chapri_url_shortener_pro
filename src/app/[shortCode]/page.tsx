
// src/app/[shortCode]/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import type { Link, Click, LoadingPage, Settings } from '@/types';
import { mockLinks as initialMockLinks } from '@/lib/data';

// --- Client-side Data Management ---
// In a real app, this would be an API call to a database.
// For this prototype, we use localStorage to simulate persistence.
const getLinksFromStorage = (): Link[] => {
  if (typeof window === 'undefined') {
    return initialMockLinks;
  }
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
        const item = window.localStorage.getItem('globalSettings'); // Assuming settings are stored here
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        return null;
    }
}


const addClickToLinkInStorage = (shortCode: string) => {
    if (typeof window === 'undefined') return;

    const links = getLinksFromStorage();
    const linkIndex = links.findIndex((l) => l.shortCode === shortCode);

    if (linkIndex !== -1) {
        const newClick: Click = {
            id: `${shortCode}-click-${Date.now()}`,
            clickedAt: new Date().toISOString(),
            ipAddress: `203.0.113.${Math.floor(Math.random() * 255)}`, // Mock IP
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            country: 'Unknown', // In a real app, this would be derived from IP
            city: 'Unknown',
            region: 'N/A',
            isp: 'Unknown ISP',
            organization: 'Unknown Org',
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

        // Add the new click to the beginning of the clicks array
        links[linkIndex].clicks.unshift(newClick);

        try {
            // Save the updated links array back to localStorage
            window.localStorage.setItem('mockLinksData', JSON.stringify(links));
        } catch (error) {
            console.error("Failed to save updated links to localStorage", error);
        }
    }
};


const getLoadingPageContent = (link: Link): string => {
    const loadingPages = getLoadingPagesFromStorage();
    const globalSettings = getSettingsFromStorage();
    
    // Default to a simple message if settings are not available
    const defaultConfig = globalSettings?.loadingPageSettings ?? { enabled: false, mode: 'random', selectedPageId: null };
    
    // Determine which settings to use: per-link override or global
    const usePerLinkConfig = link.loadingPageConfig && !link.loadingPageConfig.useGlobal;
    const config = usePerLinkConfig ? link.loadingPageConfig! : defaultConfig;

    // Check if loading pages are enabled at all
    if (!config.enabled && !usePerLink-linkConfig) {
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

    // Find the page content from mock data
    const page = loadingPages.find(p => p.id === pageId);
    return page ? page.content : '<p>Redirecting...</p>';
}

export default function ShortLinkRedirectPage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params;
  const [link, setLink] = useState<Link | null | undefined>(undefined);
  const [destinationUrl, setDestinationUrl] = useState<string>('');
  const [pageContent, setPageContent] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs only on the client-side
    const allLinks = getLinksFromStorage();
    const foundLink = allLinks.find((l) => l.shortCode === shortCode);

    if (foundLink) {
      // LOG THE CLICK!
      addClickToLinkInStorage(shortCode);
      setLink(foundLink);

      // Handle Base64 decoding if necessary
      let finalUrl = foundLink.longUrl;
      if (foundLink.useBase64Encoding) {
        try {
            finalUrl = atob(foundLink.longUrl);
        } catch (e) {
            console.error("Failed to decode Base64 URL:", e);
            // Fallback to raw URL on error
        }
      }
      setDestinationUrl(finalUrl);

      // Prepare loading page content if meta refresh is used
      if (foundLink.useMetaRefresh) {
        const delay = foundLink.metaRefreshDelay ?? 0;
        const content = getLoadingPageContent(foundLink);
        document.title = foundLink.title || 'Redirecting...';
        
        // This sets the meta refresh tag and content for the current document
        const meta = document.createElement('meta');
        meta.httpEquiv = 'refresh';
        meta.content = `${delay};url=${finalUrl}`;
        document.head.appendChild(meta);
        setPageContent(content);
      }

    } else {
      setLink(null); // Explicitly set to null if not found
    }
  }, [shortCode]);
  
  // Update browser tab title for non-meta-refresh links
  useEffect(() => {
    if (link && !link.useMetaRefresh) {
        document.title = link.title || 'Redirecting...';
    }
  }, [link]);


  // While we are figuring out the link, show a loading state.
  if (link === undefined) {
    return <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '2rem' }}>Loading link...</div>;
  }
  
  // If the link is null (not found after checking), show 404.
  if (!link) {
    notFound();
  }

  // --- REDIRECTION LOGIC ---
  // Ensure we have a destination URL before attempting any redirect
  if (!destinationUrl) {
    return <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '2rem' }}>Preparing link...</div>;
  }

  // Handle Frame-based Cloaking
  if (link.isCloaked) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}>
        <iframe
          src={destinationUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={link.title}
          // sandbox attribute can sometimes interfere with sites, removed for wider compatibility
        />
      </div>
    );
  }

  // Handle Meta Refresh Redirect (and loading pages)
  if (link.useMetaRefresh && pageContent) {
    // Render the loading page content directly into the page body.
    return (
        <div
            style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}
            dangerouslySetInnerHTML={{ __html: pageContent }}
        />
    );
  }

  // Default: Standard Redirect (using client-side redirect)
  // This part of the code runs after the link state has been set.
  if (typeof window !== 'undefined' && !link.useMetaRefresh) {
      window.location.href = destinationUrl;
  }
  
  // Fallback content while the JavaScript redirect is being processed by the browser
  return <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '2rem' }}>Redirecting you now...</div>;
}
