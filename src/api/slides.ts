import type { Slide } from '../types/slide';

export async function fetchAllSlides(): Promise<Slide[]> {
  const res = await fetch('/api/slides');
  if (!res.ok) throw new Error(`Failed to fetch slides: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function createSlide(payload: Omit<Slide, 'id'>): Promise<Slide> {
  const res = await fetch('/api/slides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create slide: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function updateSlide(id: number, patch: Partial<Omit<Slide, 'id'>>): Promise<Slide> {
  const res = await fetch(`/api/slides/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Failed to update slide ${id}: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function deleteSlide(id: number): Promise<void> {
  const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete slide ${id}: ${res.status} ${res.statusText}`);
}
