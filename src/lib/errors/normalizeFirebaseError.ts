export function normalizeFirebaseError(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.'

  const code = error.code || ''
  const message = error.message || ''

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password. Please try again.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.'
    case 'auth/invalid-email':
      return 'Please provide a valid email address.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. The popup was closed before completing.'
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups for this site.'
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Access is temporarily disabled. Try again later.'
    case 'permission-denied':
      return 'Access denied. You do not have permission to perform this action.'
    case 'unavailable':
      return 'The service is currently unavailable. Please check your connection and try again.'
    default:
      if (typeof message === 'string' && message.length > 0) {
        // Strip Firebase code prefixes if present in message
        return message.replace(/^Firebase:\s*/i, '').replace(/\(auth\/[a-z-]+\)\.?/i, '').trim()
      }
      return 'An unexpected error occurred. Please try again.'
  }
}
