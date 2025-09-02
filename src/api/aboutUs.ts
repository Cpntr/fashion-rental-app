import type { AboutUsContent } from '../types/aboutUs';

export async function fetchAboutUs(): Promise<AboutUsContent> {
  const res = await fetch('/api/about-us');
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}

export async function updateAboutUs(data: AboutUsContent): Promise<AboutUsContent> {
  const res = await fetch('/api/about-us', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update: ${res.status}`);
  return res.json();
}
