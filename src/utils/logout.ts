// utils/logout.ts

export function logout(): void {
  localStorage.removeItem('authenticated');
}