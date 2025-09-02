// src\api\dresses.ts

import type { Dress } from '../types/dress';

/**
 * Functions for interacting with the dresses API.
 *
 * These functions assume that a proxy is configured in Vite to forward
 * `/api` requests to the backend (see vite.config.ts).
 */
export async function fetchAllDresses(): Promise<Dress[]> {
  const res = await fetch('/api/dresses');
  if (!res.ok) {
    throw new Error(`Failed to fetch dresses: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function createDress(payload: Omit<Dress, 'id'>): Promise<Dress> {
  const res = await fetch('/api/dresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to create dress: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function updateDress(id: number, patch: Partial<Dress>): Promise<Dress> {
  const res = await fetch(`/api/dresses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    throw new Error(`Failed to update dress ${id}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function deleteDress(id: number): Promise<void> {
  const res = await fetch(`/api/dresses/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`Failed to delete dress ${id}: ${res.status} ${res.statusText}`);
  }
}
