/**
 * Extracts YouTube video ID from various standard YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - Plain VIDEO_ID (11 alphanumeric characters)
 */
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null
  const trimmed = urlOrId.trim()

  // If already an 11-character alphanumeric/dash/underscore ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  // Regex covering standard watch, embed, and shortened youtu.be URLs
  const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  const match = trimmed.match(regExp)
  return match ? match[1] : null
}

/**
 * Returns safe embed URL for an iframe.
 */
export function getYouTubeEmbedUrl(urlOrId: string): string | null {
  const videoId = extractYouTubeId(urlOrId)
  if (!videoId) return null
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
}

/**
 * Validates whether string is a supported YouTube URL or ID.
 */
export function isValidYouTubeUrl(urlOrId: string): boolean {
  return extractYouTubeId(urlOrId) !== null
}
