import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import {
  getCourseBySlug,
  getCourseLessons,
} from './course.service'
import {
  enrollInCourse,
  getUserEnrollment,
} from '@/features/learning/learning.service'
import type { Course, Lesson, Enrollment } from '@/types/domain'
import { Button } from '@/components/ui/Button'
import { NotFoundPage } from './NotFoundPage'
import { formatMinutes, formatSeconds } from '@/lib/utils/formatDuration'
import { DEFAULT_COURSE_THUMBNAIL } from '@/lib/utils/imageUrl'
import {
  Clock,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Edit,
} from 'lucide-react'

export const CourseDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { user, isAdmin } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [thumbnailSrc, setThumbnailSrc] = useState('')

  useEffect(() => {
    let active = true
    if (!slug) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setNotFound(false)

    getCourseBySlug(slug)
      .then(async (courseData) => {
        if (!active) return
        if (!courseData) {
          setNotFound(true)
          setIsLoading(false)
          return
        }

        // Check if unpublished: non-admins cannot access
        if (!courseData.published && !isAdmin) {
          setNotFound(true)
          setIsLoading(false)
          return
        }

        setCourse(courseData)
        setThumbnailSrc(courseData.thumbnailUrl || DEFAULT_COURSE_THUMBNAIL)

        // Fetch lessons
        const lessonList = await getCourseLessons(courseData.id)
        if (!active) return
        setLessons(lessonList)

        // Fetch enrollment if user is signed in
        if (user) {
          const userEnroll = await getUserEnrollment(user.uid, courseData.id)
          if (!active) return
          setEnrollment(userEnroll)
        }
      })
      .catch((err) => {
        console.error('Error fetching course details:', err)
        if (active) setNotFound(true)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug, user, isAdmin])

  const handleEnroll = async () => {
    if (!user) {
      // Redirect to login with safe returnTo
      const returnTo = encodeURIComponent(`/courses/${slug}`)
      navigate(`/login?returnTo=${returnTo}`)
      return
    }

    if (!course) return

    setIsEnrolling(true)
    try {
      const firstLessonId = lessons.length > 0 ? lessons[0].id : undefined
      await enrollInCourse(user.uid, course.id, course.slug, firstLessonId)
      success('Enrolled successfully!', `Welcome to ${course.title}`)

      // Refresh enrollment state
      const updated = await getUserEnrollment(user.uid, course.id)
      setEnrollment(updated)

      // Navigate to player if lessons exist
      if (firstLessonId) {
        navigate(`/learn/${course.slug}/${firstLessonId}`)
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      toastError('Enrollment failed', err.message || 'Please try again.')
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleContinueLearning = () => {
    if (!course || lessons.length === 0) return
    const targetLessonId = enrollment?.lastLessonId || lessons[0].id
    navigate(`/learn/${course.slug}/${targetLessonId}`)
  }

  if (notFound) {
    return <NotFoundPage />
  }

  if (isLoading || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-8 bg-slate-800 rounded w-1/3" />
        <div className="h-64 bg-slate-800/60 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-4 bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-800 rounded w-3/4" />
          </div>
          <div className="h-48 bg-slate-800/60 rounded-2xl" />
        </div>
      </div>
    )
  }

  const isEnrolled = Boolean(enrollment)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-left">
      {/* Unpublished draft banner for Admin */}
      {!course.published && (
        <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-600/60 text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-between gap-4">
          <span>⚠️ This course is currently in <strong>DRAFT / UNPUBLISHED</strong> mode. It is hidden from learners and the public catalog.</span>
          {isAdmin && (
            <Link to={`/admin/courses/${course.id}/edit`}>
              <Button size="sm" variant="secondary" leftIcon={<Edit className="w-3.5 h-3.5" />}>
                Edit in Admin
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Metadata and CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/70 px-2.5 py-1 rounded-md border border-indigo-700/50">
              {course.category}
            </span>
            <span className="font-semibold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              {course.level} Level
            </span>
            {course.featured && (
              <span className="flex items-center gap-1 font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-700/60">
                <Sparkles className="w-3 h-3" /> Featured Course
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {course.subtitle || course.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{formatMinutes(course.durationMinutes)} total duration</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>{lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap gap-4 items-center">
            {isEnrolled ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleContinueLearning}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="shadow-xl shadow-indigo-600/30"
              >
                Continue Learning
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleEnroll}
                isLoading={isEnrolling}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="shadow-xl shadow-indigo-600/30"
              >
                Enroll for Free
              </Button>
            )}

            {isAdmin && (
              <Link to={`/admin/courses/${course.id}/edit`}>
                <Button variant="outline" size="lg" leftIcon={<Edit className="w-4 h-4" />}>
                  Edit Course
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Hero Artwork / Thumbnail */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="aspect-video w-full bg-slate-950 overflow-hidden relative">
            <img
              src={thumbnailSrc}
              alt={course.title}
              onError={() => setThumbnailSrc(DEFAULT_COURSE_THUMBNAIL)}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Free On-Demand Access</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Full Access
            </span>
          </div>
        </div>
      </div>

      {/* Main Body Grid: Description & Outcomes vs Curriculum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 border-t border-slate-800/80">
        {/* Left Side: Overview & What you will learn */}
        <div className="lg:col-span-7 space-y-10">
          {/* Learning Outcomes */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span className="leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Course Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Course Overview</h2>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-3">
              {course.description}
            </div>
          </div>

          {/* Instructor Bio Card */}
          {course.instructor && (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-4">
              {course.instructor.avatarUrl ? (
                <img
                  src={course.instructor.avatarUrl}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-bold text-white">
                  Instructor: {course.instructor.name}
                </h4>
                {course.instructor.bio && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {course.instructor.bio}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Curriculum Syllabus List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Course Curriculum
            </h2>
            <span className="text-xs text-slate-400">
              {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
            </span>
          </div>

          {lessons.length > 0 ? (
            <div className="space-y-2.5">
              {lessons.map((lesson, idx) => {
                const canAccess = isEnrolled || lesson.isPreview

                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                      canAccess
                        ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50'
                        : 'bg-slate-950/60 border-slate-800/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                        {idx + 1}
                      </div>

                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-slate-200 truncate">
                            {lesson.title}
                          </p>
                          {lesson.isPreview && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 shrink-0">
                              Free Preview
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {formatSeconds(lesson.durationSeconds)}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      {canAccess ? (
                        <Link to={`/learn/${course.slug}/${lesson.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-indigo-400">
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Watch
                          </Button>
                        </Link>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 px-2 py-1">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
              No lessons have been added to this course syllabus yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
