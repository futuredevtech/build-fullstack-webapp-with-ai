import { Timestamp } from 'firebase/firestore'

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Instructor {
  name: string
  avatarUrl?: string
  bio?: string
}

export interface LessonResource {
  label: string
  url: string
}

export interface Course {
  id: string
  title: string
  slug: string
  subtitle: string
  description: string
  thumbnailUrl: string // bundled `/images/courses/*.svg` path or validated public HTTPS image URL
  category: string
  level: CourseLevel
  tags: string[]
  learningOutcomes: string[]
  instructor: Instructor
  durationMinutes: number
  featured: boolean
  published: boolean
  lessonCount?: number
  createdBy: string
  createdAt?: Timestamp | Date | any
  updatedAt?: Timestamp | Date | any
  publishedAt?: Timestamp | Date | null
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  order: number // 1-indexed
  durationSeconds: number
  videoProvider: 'youtube'
  videoUrl: string
  isPreview: boolean
  resources: LessonResource[]
  createdAt?: Timestamp | Date | any
  updatedAt?: Timestamp | Date | any
}

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL?: string | null
  createdAt?: Timestamp | Date | any
  updatedAt?: Timestamp | Date | any
  isAdmin?: boolean // Derived from custom claims
}

export interface Enrollment {
  courseId: string
  courseSlug: string
  enrolledAt: Timestamp | Date | any
  lastLessonId?: string | null
  lastAccessedAt?: Timestamp | Date | any
  updatedAt: Timestamp | Date | any
  // Computed client-side helper fields:
  course?: Course
  completedLessonsCount?: number
  totalLessonsCount?: number
  progressPercentage?: number
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  completedAt?: Timestamp | Date | null
  lastPositionSeconds?: number
  updatedAt: Timestamp | Date | any
}
