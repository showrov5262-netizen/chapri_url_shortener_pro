
'use server'

/**
 * @fileoverview
 * This file acts as a mock server-side database for the application.
 * In a real-world scenario, these functions would interact with a proper database like Firestore or a SQL database.
 * Using 'use server' ensures these functions only run on the server, keeping the data centralized and consistent.
 */

import type { Link, Click } from '@/types';
import { mockLinks as initialMockLinks } from './data';
import { revalidatePath } from 'next/cache';

// This is our in-memory "database". It starts with the initial mock data.
let links: Link[] = [...initialMockLinks];

// Initialize clicks for the demo link
if (links.length > 0 && links[0].clicks.length === 0) {
    links[0].clicks = Array.from({ length: 25 }, (_, i) => ({
        id: `click-${i}`,
        clickedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: `203.0.113.${i}`,
        userAgent: i % 3 === 0 ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
        referrer: i % 5 === 0 ? 'google.com' : 'direct',
        country: i % 4 === 0 ? 'US' : i % 4 === 1 ? 'GB' : i % 4 === 2 ? 'IN' : 'DE',
        city: 'Mountain View', region: 'CA', isp: 'Google LLC', organization: 'Google LLC',
        timezone: 'America/Los_Angeles', language: 'en-US',
        device: i % 3 === 0 ? 'Desktop' : 'Mobile', deviceModel: null, deviceBrand: null,
        browser: 'Chrome', browserVersion: '91.0', browserEngine: 'Blink', os: i % 3 === 0 ? 'Windows' : 'iOS', osVersion: '10',
        screenResolution: '1920x1080', isBot: i > 20, isEmailScanner: i > 22,
    }));
}


export async function getLinks(): Promise<Link[]> {
  // In a real app, you'd fetch from a database here.
  // We return a sorted copy to ensure the newest links are first.
  return [...links].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getLink(id: string): Promise<Link | null> {
  const link = links.find(l => l.id === id) || null;
  return link;
}

export async function getLinkByShortCode(shortCode: string): Promise<Link | null> {
    const link = links.find(l => l.shortCode === shortCode) || null;
    return link;
}

export async function addLink(linkData: Omit<Link, 'id' | 'createdAt' | 'clicks'>): Promise<Link> {
  const newLink: Link = {
    ...linkData,
    id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    createdAt: new Date().toISOString(),
    clicks: [],
  };
  links.unshift(newLink); // Add to the beginning of the array
  revalidatePath('/dashboard'); // Invalidate the cache for the dashboard page
  return newLink;
}

export async function updateLink(updatedLinkData: Link): Promise<Link> {
  const index = links.findIndex(l => l.id === updatedLinkData.id);
  if (index === -1) {
    throw new Error('Link not found');
  }
  links[index] = updatedLinkData;
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/analytics/${updatedLinkData.id}`);
  return updatedLinkData;
}

export async function deleteLink(linkId: string): Promise<void> {
  const initialLength = links.length;
  links = links.filter(l => l.id !== linkId);
  if (links.length === initialLength) {
      throw new Error('Link not found');
  }
  revalidatePath('/dashboard');
}

export async function addClickToLink(linkId: string, clickData: Omit<Click, 'id'>): Promise<Click> {
    const linkIndex = links.findIndex(l => l.id === linkId);
    if (linkIndex === -1) {
        throw new Error('Link not found');
    }

    const newClick: Click = {
        ...clickData,
        id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    };

    links[linkIndex].clicks.unshift(newClick);
    revalidatePath(`/dashboard/analytics/${linkId}`);
    return newClick;
}
