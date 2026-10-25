/**
 * Safely formats Firestore Timestamp, JS Date, or ISO string into localized date
 */
export function formatDate(timestampOrDate: any): string {
  if (!timestampOrDate) return '—'

  let date: Date
  if (typeof timestampOrDate.toDate === 'function') {
    date = timestampOrDate.toDate()
  } else if (timestampOrDate instanceof Date) {
    date = timestampOrDate
  } else if (typeof timestampOrDate === 'string' || typeof timestampOrDate === 'number') {
    date = new Date(timestampOrDate)
  } else if (timestampOrDate.seconds) {
    date = new Date(timestampOrDate.seconds * 1000)
  } else {
    return '—'
  }

  if (isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
