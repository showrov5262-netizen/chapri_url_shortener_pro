// src/app/[shortCode]/page.tsx
import { mockLinks } from '@/lib/data';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

export default function ShortLinkRedirectPage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params;

  // In a real application, you would fetch this from a database.
  const link = mockLinks.find((l) => l.shortCode === shortCode);

  if (!link) {
    // If the short code doesn't exist, show a 404 page.
    notFound();
  }

  // Redirect to the long URL.
  redirect(link.longUrl);

  // This part will never be rendered because of the redirect.
  // It's good practice to return null or a loading indicator.
  return null;
}
