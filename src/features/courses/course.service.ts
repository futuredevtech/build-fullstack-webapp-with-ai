import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  type DocumentData,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { Course, Lesson } from '@/types/domain'

/**
 * Normalizes course document snapshot to Course interface
 */
function mapCourseDoc(docSnap: DocumentData): Course {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    title: data.title || '',
    slug: data.slug || '',
    subtitle: data.subtitle || '',
    description: data.description || '',
    thumbnailUrl: data.thumbnailUrl || '/images/courses/general-learning.svg',
    category: data.category || 'General',
    level: data.level || 'Beginner',
    tags: Array.isArray(data.tags) ? data.tags : [],
    learningOutcomes: Array.isArray(data.learningOutcomes) ? data.learningOutcomes : [],
    instructor: data.instructor || { name: 'Instructor' },
    durationMinutes: Number(data.durationMinutes) || 0,
    featured: Boolean(data.featured),
    published: Boolean(data.published),
    lessonCount: Number(data.lessonCount) || 0,
    createdBy: data.createdBy || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt || null,
  }
}

/**
 * Normalizes lesson document snapshot to Lesson interface
 */
function mapLessonDoc(courseId: string, docSnap: DocumentData): Lesson {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    courseId,
    title: data.title || '',
    description: data.description || '',
    order: Number(data.order) || 1,
    durationSeconds: Number(data.durationSeconds) || 0,
    videoProvider: 'youtube',
    videoUrl: data.videoUrl || '',
    isPreview: Boolean(data.isPreview),
    resources: Array.isArray(data.resources) ? data.resources : [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

/**
 * Fetch all published courses (public catalog & home page)
 */
export async function getPublishedCourses(): Promise<Course[]> {
  if (!db) return []
  const coursesRef = collection(db, 'courses')
  const q = query(coursesRef, where('published', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map((d) => mapCourseDoc(d))
}

/**
 * Fetch all courses (Admin only)
 */
export async function getAllCoursesAdmin(): Promise<Course[]> {
  if (!db) return []
  const coursesRef = collection(db, 'courses')
  const snap = await getDocs(coursesRef)
  return snap.docs.map((d) => mapCourseDoc(d))
}

/**
 * Fetch course by slug (ensuring slug is unique)
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  if (!db || !slug) return null
  const coursesRef = collection(db, 'courses')
  const q = query(coursesRef, where('slug', '==', slug.trim()))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return mapCourseDoc(snap.docs[0])
}

/**
 * Fetch course by ID
 */
export async function getCourseById(courseId: string): Promise<Course | null> {
  if (!db || !courseId) return null
  const docRef = doc(db, 'courses', courseId)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null
  return mapCourseDoc(snap)
}

/**
 * Fetch all lessons of a course in ascending order
 */
export async function getCourseLessons(courseId: string): Promise<Lesson[]> {
  if (!db || !courseId) return []
  const lessonsRef = collection(db, 'courses', courseId, 'lessons')
  const q = query(lessonsRef, orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => mapLessonDoc(courseId, d))
}

/**
 * Create a new course (Admin only)
 */
export async function createCourse(
  courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'lessonCount'>,
  userId: string
): Promise<string> {
  if (!db) throw new Error('Firestore is not initialized')

  // Check slug uniqueness
  const existingWithSlug = await getCourseBySlug(courseData.slug)
  if (existingWithSlug) {
    throw new Error(`The URL slug "${courseData.slug}" is already used by another course.`)
  }

  const coursesRef = collection(db, 'courses')
  const docRef = await addDoc(coursesRef, {
    ...courseData,
    lessonCount: 0,
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: courseData.published ? serverTimestamp() : null,
  })

  return docRef.id
}

/**
 * Update course metadata
 */
export async function updateCourse(
  courseId: string,
  courseData: Partial<Course>
): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized')

  // If slug is changing, verify it is not already taken
  if (courseData.slug) {
    const existing = await getCourseBySlug(courseData.slug)
    if (existing && existing.id !== courseId) {
      throw new Error(`The slug "${courseData.slug}" is already in use by another course.`)
    }
  }

  const docRef = doc(db, 'courses', courseId)
  await updateDoc(docRef, {
    ...courseData,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete a course and its subcollection lessons
 */
export async function deleteCourse(courseId: string): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized')

  // Delete lessons subcollection
  const lessonsRef = collection(db, 'courses', courseId, 'lessons')
  const lessonsSnap = await getDocs(lessonsRef)

  const batch = writeBatch(db)
  lessonsSnap.docs.forEach((d) => {
    batch.delete(d.ref)
  })

  // Delete parent course doc
  const courseDocRef = doc(db, 'courses', courseId)
  batch.delete(courseDocRef)

  await batch.commit()
}

/**
 * Publish / Unpublish course with validation
 */
export async function setCoursePublished(
  courseId: string,
  publish: boolean
): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized')

  if (publish) {
    // Validate that the course has at least one valid lesson
    const lessons = await getCourseLessons(courseId)
    if (lessons.length === 0) {
      throw new Error('A course must contain at least 1 lesson before it can be published.')
    }
  }

  const docRef = doc(db, 'courses', courseId)
  await updateDoc(docRef, {
    published: publish,
    publishedAt: publish ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Create a new lesson under a course
 */
export async function createLesson(
  courseId: string,
  lessonData: Omit<Lesson, 'id' | 'courseId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  if (!db) throw new Error('Firestore is not initialized')

  const lessonsRef = collection(db, 'courses', courseId, 'lessons')
  const newLessonRef = await addDoc(lessonsRef, {
    ...lessonData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  // Recalculate lesson count
  const allLessons = await getCourseLessons(courseId)
  const courseDocRef = doc(db, 'courses', courseId)
  await updateDoc(courseDocRef, {
    lessonCount: allLessons.length,
    updatedAt: serverTimestamp(),
  })

  return newLessonRef.id
}

/**
 * Update lesson
 */
export async function updateLesson(
  courseId: string,
  lessonId: string,
  lessonData: Partial<Lesson>
): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized')

  const lessonDocRef = doc(db, 'courses', courseId, 'lessons', lessonId)
  await updateDoc(lessonDocRef, {
    ...lessonData,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete lesson and update course count
 */
export async function deleteLesson(
  courseId: string,
  lessonId: string
): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized')

  const lessonDocRef = doc(db, 'courses', courseId, 'lessons', lessonId)
  await deleteDoc(lessonDocRef)

  // Recalculate count
  const remaining = await getCourseLessons(courseId)
  const courseDocRef = doc(db, 'courses', courseId)
  await updateDoc(courseDocRef, {
    lessonCount: remaining.length,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Reorder lessons
 */
export async function reorderLessons(
  courseId: string,
  orderedLessonIds: string[]
): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized')

  const batch = writeBatch(db)
  orderedLessonIds.forEach((id, index) => {
    const lRef = doc(db, 'courses', courseId, 'lessons', id)
    batch.update(lRef, {
      order: index + 1,
      updatedAt: serverTimestamp(),
    })
  })

  await batch.commit()
}
