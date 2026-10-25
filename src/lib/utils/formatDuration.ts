/**
 * Formats duration in minutes into a human-readable string (e.g., "1h 30m" or "45m")
 */
export function formatMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m'
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`
  }
  if (hours > 0) {
    return `${hours}h`
  }
  return `${remainingMinutes}m`
}

/**
 * Formats duration in seconds into "mm:ss" or "hh:mm:ss"
 */
export function formatSeconds(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00'
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const pad = (n: number) => n.toString().padStart(2, '0')

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`
  }
  return `${mins}:${pad(secs)}`
}
