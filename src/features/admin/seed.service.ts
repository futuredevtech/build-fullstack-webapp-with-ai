import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { SEED_COURSES } from '@/scripts/seed-data'
import { getCourseBySlug } from '@/features/courses/course.service'

/**
 * Seeds demo courses into Firestore idempotently.
 * Checks existing slugs to avoid duplicate insertions.
 */
export async function seedDemoCourses(adminUid: string): Promise<{ created: number; skipped: number }> {
  if (!db) throw new Error('Firestore is not initialized. Check your Firebase credentials.')

  let created = 0
  let skipped = 0

  for (const item of SEED_COURSES) {
    // Check if course with this slug exists
    const existing = await getCourseBySlug(item.slug)
    if (existing) {
      skipped++
      continue
    }

    // Create course doc
    const coursesRef = collection(db, 'courses')
    const { lessons, ...courseData } = item

    const newCourseDoc = await addDoc(coursesRef, {
      ...courseData,
      lessonCount: lessons.length,
      createdBy: adminUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: item.published ? serverTimestamp() : null,
    })

    // Create lessons subcollection
    const lessonsRef = collection(db, 'courses', newCourseDoc.id, 'lessons')
    for (const lesson of lessons) {
      await addDoc(lessonsRef, {
        ...lesson,
        videoProvider: 'youtube',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    created++
  }

  return { created, skipped }
}
