// utils/login.ts
//
// This module provides a helper for verifying the admin password.  The
// plain text password is never stored in the bundle; instead we store
// its SHA‑256 hash and compare the hash of the entered password.  If
// the hashes match, an "authenticated" flag is persisted in
// localStorage so that page reloads or navigation do not require a
// second login until the user explicitly logs out.

/**
 * SHA‑256 hash of the admin password "Cpsharma@123".  To change the
 * admin password, update this constant with the new password's hash.
 */
const PASSWORD_HASH = '935472f30343c0b5405018a84e434709bff07685825d82d842e3973aa2b4cc8a';

/**
 * Compute a SHA‑256 hash of the provided password and compare it to the
 * stored hash.  If they match, persist an "authenticated" flag in
 * localStorage and return true.  Otherwise return false.
 *
 * @param password The plain text password entered by the user
 * @returns A promise that resolves to true if authentication succeeds
 */
export async function login(password: string): Promise<boolean> {
  // Encode the password to a Uint8Array and hash it
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  // Convert the hash to a hexadecimal string
  const hash = Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  // Compare the computed hash to the stored hash
  if (hash === PASSWORD_HASH) {
    localStorage.setItem('authenticated', 'true');
    return true;
  }
  return false;
}