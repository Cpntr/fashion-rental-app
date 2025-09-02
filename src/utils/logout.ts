// utils/logout.ts
//
// This module provides a helper for logging out the admin user.  It
// clears any authentication state from localStorage.  The logout
// function should be called explicitly when the admin clicks the log
// out button and also when the user closes or refreshes the page to
// ensure that sensitive state does not persist unexpectedly.

/**
 * Remove any persisted authentication state.  This will require the
 * user to log in again on the next visit.  Use this in a
 * beforeunload handler to automatically log out when the tab or
 * window is closed.
 */
export function logout(): void {
  localStorage.removeItem('authenticated');
}