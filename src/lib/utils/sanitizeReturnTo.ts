/**
 * Sanitizes returnTo path to prevent open redirect vulnerabilities.
 * Only allows same-origin relative paths starting with a single '/'
 */
export function sanitizeReturnTo(url: string | null | undefined, fallback: string = '/dashboard'): string {
  if (!url || typeof url !== 'string') return fallback
  const trimmed = url.trim()

  // Must begin with a single '/' and not with '//' (protocol-relative) or backslash '\'
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
    // Avoid redirect loops back to auth pages
    if (
      trimmed.startsWith('/login') ||
      trimmed.startsWith('/register') ||
      trimmed.startsWith('/forgot-password')
    ) {
      return fallback
    }
    return trimmed
  }

  return fallback
}
