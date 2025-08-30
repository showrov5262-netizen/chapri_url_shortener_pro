// src/app/[shortCode]/page.tsx
import { mockLinks, mockLoadingPages, mockSettings } from '@/lib/data';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import type { Link } from '@/types';

// This function generates metadata for the page (e.g., for social media previews)
export async function generateMetadata({ params }: { params: { shortCode: string } }): Promise<Metadata> {
  const link = mockLinks.find((l) => l.shortCode === params.shortCode);

  if (!link) {
    return {
      title: 'Link Not Found',
    };
  }

  // Use spoof data if available, otherwise use the link's own data
  const title = link.spoof?.title || link.title;
  const description = link.spoof?.description || link.description;
  const imageUrl = link.spoof?.imageUrl || link.thumbnailUrl;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}


const getLoadingPageContent = (link: Link): string => {
    // Determine which settings to use (link-specific or global)
    const config = (link.useMetaRefresh && link.loadingPageConfig && !link.loadingPageConfig.useGlobal)
        ? link.loadingPageConfig
        : mockSettings.loadingPageSettings;

    if (!config.enabled && !link.useMetaRefresh) {
        return '';
    }

    let pageId = null;

    if (config.mode === 'random') {
        if (mockLoadingPages.length > 0) {
            const randomIndex = Math.floor(Math.random() * mockLoadingPages.length);
            pageId = mockLoadingPages[randomIndex].id;
        }
    } else if (config.mode === 'specific') {
        pageId = config.selectedPageId;
    }

    const page = mockLoadingPages.find(p => p.id === pageId);
    return page ? page.content : '<p>Redirecting...</p>'; // Fallback content
}

export default function ShortLinkRedirectPage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params;
  const link = mockLinks.find((l) => l.shortCode === shortCode);

  if (!link) {
    notFound();
  }

  // Handle Frame-based Cloaking
  if (link.isCloaked) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}>
        <iframe
          src={link.longUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={link.title}
        />
      </div>
    );
  }

  // Handle Meta Refresh Redirect (and loading pages)
  if (link.useMetaRefresh) {
    const delay = link.metaRefreshDelay ?? 0;
    const pageContent = getLoadingPageContent(link);

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta http-equiv="refresh" content="${delay};url=${link.longUrl}" />
        <title>Redirecting...</title>
      </head>
      <body style="margin:0; padding:0;">
        ${pageContent}
      </body>
      </html>
    `;
    
    return (
        <div dangerouslySetInnerHTML={{ __html: fullHtml }} style={{width: '100%', height: '100vh'}} />
    );
  }

  // Default: Standard Redirect
  // Use 301 for permanent, 302 (default for redirect()) for temporary
  redirect(link.longUrl, link.redirectType === '301' ? 'permanent' : 'push');

  // This part is never reached due to the redirect, but it's required for type safety.
  return null;
}
