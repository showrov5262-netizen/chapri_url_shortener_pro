// src/app/[shortCode]/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import type { Link, Click, LoadingPage, Settings, CaptchaConfig } from '@/types';
import { getLinkByShortCode, addClickToLink, getLoadingPages, getSettings, getCaptchaConfig } from '@/lib/server-data';

const getLoadingPageContent = (link: Link, allLoadingPages: LoadingPage[], allSettings: Settings): string => {
    const defaultConfig = allSettings?.loadingPageSettings ?? { enabled: false, mode: 'random', selectedPageId: null };
    
    const usePerLinkConfig = link.loadingPageConfig && !link.loadingPageConfig.useGlobal;
    const config = usePerLinkConfig ? link.loadingPageConfig! : defaultConfig;

    if (!config.enabled && !usePerLinkConfig) {
        return '<p>Redirecting...</p>';
    }

    let pageId: string | null = null;
    const effectiveMode = config.mode === 'global' ? defaultConfig.mode : config.mode;
    
    if (effectiveMode === 'random') {
        if (allLoadingPages.length > 0) {
            const randomIndex = Math.floor(Math.random() * allLoadingPages.length);
            pageId = allLoadingPages[randomIndex].id;
        }
    } else if (effectiveMode === 'specific') {
        pageId = config.selectedPageId ?? defaultConfig.selectedPageId;
    }

    const page = allLoadingPages.find(p => p.id === pageId);
    return page ? page.content : '<p>Redirecting...</p>';
}

function getDestinationUrl(link: Link): string {
    if (typeof window === 'undefined') return link.longUrl; // Return base URL during SSR

    const userCountry = 'US'; // Mock country for demonstration
    const geoTarget = link.geoTargets?.find(t => t.country === userCountry);
    if (geoTarget) return geoTarget.url;

    const userAgent = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    
    let deviceType: 'iOS' | 'Android' | 'Desktop' = 'Desktop';
    if (isIOS) deviceType = 'iOS';
    else if (isAndroid) deviceType = 'Android';
    
    const deviceTarget = link.deviceTargets?.find(t => t.device === deviceType);
    if (deviceTarget) return deviceTarget.url;
    
    const allUrls = [link.longUrl, ...(link.abTestUrls || [])].filter(Boolean);
    if (allUrls.length > 1) {
        const randomIndex = Math.floor(Math.random() * allUrls.length);
        return allUrls[randomIndex];
    }
    
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
    });
}

export default function ShortLinkRedirectPage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params;
  const [status, setStatus] = useState<'loading' | 'captcha' | 'redirecting' | 'cloaking' | 'rendering_loading_page' | 'not_found'>('loading');
  const [link, setLink] = useState<Link | null>(null);
  const [pageContent, setPageContent] = useState<string>('');
  const [cloakedUrl, setCloakedUrl] = useState<string>('');
  const [pageTitle, setPageTitle] = useState('Redirecting...');
  const [captchaSiteKey, setCaptchaSiteKey] = useState<string | null>(null);
  
  // Effect to fetch the link and decide the initial state
  useEffect(() => {
    if (!shortCode) return;
    
    const fetchLink = async () => {
        const foundLink = await getLinkByShortCode(shortCode);
        if (!foundLink) {
            setStatus('not_found');
            return;
        }
        
        setLink(foundLink);
        document.title = foundLink.title || 'Redirecting...';
        setPageTitle(foundLink.title);

        if (foundLink.captchaVerification) {
            const config = await getCaptchaConfig();
            if (config?.siteKey) {
                setCaptchaSiteKey(config.siteKey);
                setStatus('captcha');
            } else {
                console.warn("Link requires CAPTCHA, but no site key is configured. Proceeding without.");
                setStatus('redirecting'); 
            }
        } else {
            setStatus('redirecting');
        }
    };
    
    fetchLink();
  }, [shortCode]);

  // Effect to handle the actual redirection logic once the state is set
  useEffect(() => {
    if (status !== 'redirecting' || !link) return;

    const processRedirect = async () => {
      // Step 1: Record the click. This is guaranteed to happen before redirecting.
      const newClick: Omit<Click, 'id'> = {
        clickedAt: new Date().toISOString(),
        ipAddress: `203.0.113.${Math.floor(Math.random() * 255)}`, // Mock IP
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        country: 'US', // Mock data
        city: 'Mountain View', region: 'CA', isp: 'Mock ISP', organization: 'Mock Org',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        deviceModel: null, deviceBrand: null, browser: 'Other', browserVersion: 'N/A',
        browserEngine: 'N/A', os: 'Other', osVersion: 'N/A',
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        isBot: false, isEmailScanner: false,
      };
      await addClickToLink(link.id, newClick);
      
      // Step 2: Inject any tracking pixels
      injectPixels(link);

      // Step 3: Determine the final destination URL
      let finalUrl = getDestinationUrl(link);
      if (link.useBase64Encoding) {
        try { finalUrl = atob(finalUrl); } catch (e) { console.error("Failed to decode Base64 URL:", e); }
      }

      // Step 4: Execute the redirect based on link configuration
      if (link.isCloaked) {
        setCloakedUrl(finalUrl);
        setStatus('cloaking');
      } else if (link.useMetaRefresh) {
        const [allLoadingPages, allSettings] = await Promise.all([getLoadingPages(), getSettings()]);
        const content = getLoadingPageContent(link, allLoadingPages, allSettings);
        setPageContent(content);
        setStatus('rendering_loading_page'); // Render the page first
        // Add meta tag after a short delay to ensure content renders
        setTimeout(() => {
            const delay = link.metaRefreshDelay ?? 0;
            const meta = document.createElement('meta');
            meta.httpEquiv = 'refresh';
            meta.content = `${delay};url=${finalUrl}`;
            document.head.appendChild(meta);
        }, 50);
      } else {
        window.location.href = finalUrl;
      }
    };

    processRedirect();
  }, [status, link]);

  const onCaptchaSuccess = () => {
     // CAPTCHA is solved, move to the redirecting state.
     // The main useEffect hook will handle the rest.
     setStatus('redirecting');
  };

  if (status === 'loading') {
    return <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '2rem' }}>Loading link...</div>;
  }
  
  if (status === 'not_found') { notFound(); }
  
  if (status === 'captcha' && captchaSiteKey) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', fontFamily: 'sans-serif' }}>
          <h2 style={{fontWeight: '600'}}>Please verify you are human.</h2>
          <script src="https://www.google.com/recaptcha/api.js" async defer></script>
          <div className="g-recaptcha" data-sitekey={captchaSiteKey} data-callback="onCaptchaSuccess"></div>
          {/* This script connects the reCAPTCHA callback to our component's function */}
          <script dangerouslySetInnerHTML={{ __html: `
            function onCaptchaSuccess() {
                window.dispatchEvent(new CustomEvent('captchaSuccess'));
            }
          `}} />
          {(() => {
              if (typeof window !== 'undefined') {
                  const handleSuccess = () => onCaptchaSuccess();
                  const captchaSuccessEvent = 'captchaSuccess';
                  window.addEventListener(captchaSuccessEvent, handleSuccess);
                  // Cleanup listener on component unmount
                  return () => window.removeEventListener(captchaSuccessEvent, handleSuccess);
              }
          })()}
      </div>
    );
  }

  if (status === 'cloaking') {
    return <iframe src={cloakedUrl} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} title={pageTitle} />;
  }
  
  // Directly render the page content. The meta refresh tag will be added by the effect.
  if (status === 'rendering_loading_page') {
      return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
  }

  return <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '2rem' }}>Redirecting you now...</div>;
}
