export interface BundledArtwork {
  id: string
  label: string
  path: string
  category: string
}

export const BUNDLED_COURSE_ARTWORK: BundledArtwork[] = [
  {
    id: 'web-dev',
    label: 'Web Development',
    path: '/images/courses/web-development.svg',
    category: 'Development',
  },
  {
    id: 'react-basics',
    label: 'React & Frontend',
    path: '/images/courses/react-basics.svg',
    category: 'Frontend',
  },
  {
    id: 'firebase-basics',
    label: 'Firebase & Backend',
    path: '/images/courses/firebase-basics.svg',
    category: 'Backend',
  },
  {
    id: 'ai-projects',
    label: 'AI & Smart Apps',
    path: '/images/courses/ai-projects.svg',
    category: 'AI',
  },
  {
    id: 'general-learning',
    label: 'General Skills & Foundations',
    path: '/images/courses/general-learning.svg',
    category: 'General',
  },
]

export const DEFAULT_COURSE_THUMBNAIL = '/images/courses/general-learning.svg'

/**
 * Validates whether string is a direct public HTTPS image URL.
 * Strictly disallows data:, javascript:, file:, or non-HTTPS URLs.
 */
export function isValidHttpsImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()

  if (!trimmed.startsWith('https://')) return false

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'https:') return false
    return true
  } catch {
    return false
  }
}

/**
 * Tests whether an image can actually be loaded by the browser.
 */
export function testImageLoad(url: string, timeoutMs: number = 6000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    let resolved = false

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true
        resolve(false)
      }
    }, timeoutMs)

    img.onload = () => {
      if (!resolved) {
        resolved = true
        clearTimeout(timer)
        resolve(true)
      }
    }

    img.onerror = () => {
      if (!resolved) {
        resolved = true
        clearTimeout(timer)
        resolve(false)
      }
    }

    img.src = url
  })
}
