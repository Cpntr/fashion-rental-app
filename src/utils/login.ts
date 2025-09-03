// utils/login.ts


const PASSWORD_HASH = '935472f30343c0b5405018a84e434709bff07685825d82d842e3973aa2b4cc8a';

const AUTH_KEY = 'admin_authenticated';

/** Return true if current tab/session is authenticated */
export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

/** Clear the current tab/session authentication */
export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

/**
 * Hash password and set session auth if it matches.
 */
export async function login(password: string): Promise<boolean> {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  const hash = Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (hash === PASSWORD_HASH) {
    sessionStorage.setItem(AUTH_KEY, 'true'); // <-- persist for this tab
    return true;
  }
  return false;
}
