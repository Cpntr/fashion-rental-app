import type { Dress } from '../types/dress';

export async function fetchAllDresses(): Promise<Dress[]> {
  const res = await fetch('/api/dresses');
  return res.json();
}
export async function createDress(payload: Omit<Dress, 'id'>): Promise<Dress> {
  const res = await fetch('/api/dresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}
export async function updateDress(id: number, patch: Partial<Dress>): Promise<Dress> {
  const res = await fetch(`/api/dresses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  return res.json();
}
export async function deleteDress(id: number): Promise<void> {
  await fetch(`/api/dresses/${id}`, { method: 'DELETE' });
}
