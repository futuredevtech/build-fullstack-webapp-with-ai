import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { Enrollment, LessonProgress, Course, Lesson } from '@/types/domain'
import { getCourseById, getCourseLessons } from '@/features/courses/course.service'

/**
 * Idempotently enroll a user in a published course.
 * Uses `courseId` as document ID to guarantee no duplicates.
 */
export async function enrollInCourse(
  userId: string,
  courseId: string,
  courseSlug: string,
  firstLessonId?: string
): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized')

  const enrollmentRef = doc(db, 'users', userId, 'enrollments', courseId)
  const existing = await getDoc(enrollmentRef)

  if (existing.exists()) {
    // Already enrolled, no-op or update last accessed
    return
  }

  await setDoc(enrollmentRef, {
    courseId,
    courseSlug,
    enrolledAt: serverTimestamp(),
    lastLessonId: firstLessonId || null,
    lastAccessedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

/**
 * Fetch a single enrollment for a user and course
 */
export async function getUserEnrollment(
  userId: string,
  courseId: string
): Promise<Enrollment | null> {
  if (!db || !userId || !courseId) return null
  const enrollmentRef = doc(db, 'users', userId, 'enrollments', courseId)
  const snap = await getDoc(enrollmentRef)
  if (!snap.exists()) return null

  const data = snap.data()
  return {
    courseId: data.courseId,
    courseSlug: data.courseSlug,
    enrolledAt: data.enrolledAt,
    lastLessonId: data.lastLessonId || null,
    lastAccessedAt: data.lastAccessedAt,
    updatedAt: data.updatedAt,
  }
}

/**
 * Fetch all enrollments for a user along with course details and computed progress
 */
export async function getUserEnrollmentsWithProgress(userId: string): Promise<Enrollment[]> {
  if (!db || !userId) return []

  const enrollmentsRef = collection(db, 'users', userId, 'enrollments')
  const snap = await getDocs(enrollmentsRef)

  const enrollments: Enrollment[] = []

  for (const docSnap of snap.docs) {
    const data = docSnap.data()
    const courseId = data.courseId

    // Fetch parent course
    const course = await getCourseById(courseId)
    if (!course) continue

    // Fetch lesson progress
    const progressRef = collection(db, 'users', userId, 'enrollments', courseId, 'lessonProgress')
    const progressSnap = await getDocs(progressRef)
    const completedCount = progressSnap.docs.filter((d) => d.data().completed === true).length

    const totalLessons = course.lessonCount || 0
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

    enrollments.push({
      courseId: data.courseId,
      courseSlug: data.courseSlug,
      enrolledAt: data.enrolledAt,
      lastLessonId: data.lastLessonId || null,
      lastAccessedAt: data.lastAccessedAt,
      updatedAt: data.updatedAt,
      course,
      completedLessonsCount: completedCount,
      totalLessonsCount: totalLessons,
      progressPercentage,
    })
  }

  // Sort by most recently accessed
  return enrollments.sort((a, b) => {
    const timeA = a.lastAccessedAt?.seconds || 0
    const timeB = b.lastAccessedAt?.seconds || 0
    return timeB - timeA
  })
}

/**
 * Get map of lessonId -> LessonProgress for a course
 */
export async function getLessonProgressMap(
  userId: string,
  courseId: string
): Promise<Record<string, LessonProgress>> {
  if (!db || !userId || !courseId) return {}

  const progressRef = collection(db, 'users', userId, 'enrollments', courseId, 'lessonProgress')
  const snap = await getDocs(progressRef)

  const map: Record<string, LessonProgress> = {}
  snap.docs.forEach((d) => {
    const data = d.data()
    map[d.id] = {
      lessonId: d.id,
      completed: Boolean(data.completed),
      completedAt: data.completedAt || null,
      lastPositionSeconds: data.lastPositionSeconds || 0,
      updatedAt: data.updatedAt,
    }
  })

  return map
}

/**
 * Toggle lesson completion state and update last-accessed time
 */
export async function setLessonCompletion(
  userId: string,
  courseId: string,
  lessonId: string,
  completed: boolean
): Promise<void> {
  if (!db || !userId || !courseId || !lessonId) return

  // Update lessonProgress document
  const progressDocRef = doc(
    db,
    'users',
    userId,
    'enrollments',
    courseId,
    'lessonProgress',
    lessonId
  )

  await setDoc(
    progressDocRef,
    {
      lessonId,
      completed,
      completedAt: completed ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  // Update enrollment record's lastLessonId & lastAccessedAt
  const enrollmentRef = doc(db, 'users', userId, 'enrollments', courseId)
  await setDoc(
    enrollmentRef,
    {
      lastLessonId: lessonId,
      lastAccessedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

/**
 * Update the last viewed lesson without changing completion state
 */
export async function recordLessonVisit(
  userId: string,
  courseId: string,
  lessonId: string
): Promise<void> {
  if (!db || !userId || !courseId || !lessonId) return

  const enrollmentRef = doc(db, 'users', userId, 'enrollments', courseId)
  await setDoc(
    enrollmentRef,
    {
      lastLessonId: lessonId,
      lastAccessedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
