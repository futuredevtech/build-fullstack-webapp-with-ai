import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { getCourseBySlug, getCourseLessons } from '@/features/courses/course.service'
import {
  getUserEnrollment,
  getLessonProgressMap,
  setLessonCompletion,
  recordLessonVisit,
  enrollInCourse,
} from './learning.service'
import type { Course, Lesson, LessonProgress, Enrollment } from '@/types/domain'
import { getYouTubeEmbedUrl } from '@/lib/utils/videoUrl'
import { formatSeconds } from '@/lib/utils/formatDuration'
import { Button } from '@/components/ui/Button'
import { NotFoundPage } from '@/features/courses/NotFoundPage'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Lock,
  Menu,
  PlayCircle,
  X,
  AlertCircle,
  PartyPopper,
} from 'lucide-react'

export const CoursePlayerPage: React.FC = () => {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>()
  const { user, isAdmin } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false)
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Fetch course, lessons, and enrollment
  useEffect(() => {
    let active = true
    if (!courseSlug) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    getCourseBySlug(courseSlug)
      .then(async (cData) => {
        if (!active) return
        if (!cData) {
          setNotFound(true)
          setIsLoading(false)
          return
        }

        if (!cData.published && !isAdmin) {
          setNotFound(true)
          setIsLoading(false)
          return
        }

        setCourse(cData)

        const lessonList = await getCourseLessons(cData.id)
        if (!active) return
        setLessons(lessonList)

        // Find current lesson
        let targetLesson: Lesson | undefined
        if (lessonId && lessonId !== 'start') {
          targetLesson = lessonList.find((l) => l.id === lessonId)
        } else if (lessonList.length > 0) {
          targetLesson = lessonList[0]
        }

        if (targetLesson) {
          setCurrentLesson(targetLesson)
        } else if (lessonList.length > 0) {
          setCurrentLesson(lessonList[0])
        }

        // Fetch user enrollment and progress map
        if (user) {
          const userEnroll = await getUserEnrollment(user.uid, cData.id)
          if (!active) return
          setEnrollment(userEnroll)

          const prog = await getLessonProgressMap(user.uid, cData.id)
          if (!active) return
          setProgressMap(prog)

          // Record visit if target lesson exists
          if (targetLesson && userEnroll) {
            recordLessonVisit(user.uid, cData.id, targetLesson.id)
          }
        }
      })
      .catch((err) => {
        console.error('Player load error:', err)
        if (active) setNotFound(true)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [courseSlug, lessonId, user, isAdmin])

  // Current lesson index
  const currentIndex = useMemo(() => {
    if (!currentLesson) return -1
    return lessons.findIndex((l) => l.id === currentLesson.id)
  }, [lessons, currentLesson])

  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  // Progress metrics
  const completedCount = useMemo(() => {
    return Object.values(progressMap).filter((p) => p.completed).length
  }, [progressMap])

  const progressPercentage = lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : 0

  const isCurrentLessonCompleted = Boolean(
    currentLesson && progressMap[currentLesson.id]?.completed
  )

  // Handle Mark Complete toggle
  const handleToggleComplete = async () => {
    if (!user || !course || !currentLesson) return

    setIsUpdatingProgress(true)
    const newStatus = !isCurrentLessonCompleted

    try {
      await setLessonCompletion(user.uid, course.id, currentLesson.id, newStatus)
      setProgressMap((prev) => ({
        ...prev,
        [currentLesson.id]: {
          lessonId: currentLesson.id,
          completed: newStatus,
          updatedAt: new Date(),
        },
      }))

      if (newStatus) {
        success('Lesson marked complete!')
        // If there's a next lesson, automatically prompt or allow easy continuation
      }
    } catch (err: any) {
      toastError('Failed to save progress', err.message || 'Please try again.')
    } finally {
      setIsUpdatingProgress(false)
    }
  }

  // Handle enrollment directly inside player
  const handleEnrollFromPlayer = async () => {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    if (!course) return

    setIsEnrolling(true)
    try {
      await enrollInCourse(user.uid, course.id, course.slug, currentLesson?.id)
      const updated = await getUserEnrollment(user.uid, course.id)
      setEnrollment(updated)
      success('Enrolled!', `You now have full access to ${course.title}`)
    } catch (err: any) {
      toastError('Enrollment failed', err.message)
    } finally {
      setIsEnrolling(false)
    }
  }

  if (notFound) return <NotFoundPage />

  if (isLoading || !course) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading course environment...</p>
      </div>
    )
  }

  // Access validation: is user enrolled or is lesson a preview?
  const isEnrolled = Boolean(enrollment)
  const isPreviewPermitted = Boolean(currentLesson?.isPreview)
  const hasAccess = isEnrolled || isPreviewPermitted || isAdmin

  const embedUrl = currentLesson ? getYouTubeEmbedUrl(currentLesson.videoUrl) : null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col text-left">
      {/* Top Player Navigation Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 overflow-hidden">
          <Link
            to={`/courses/${course.slug}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Course</span>
          </Link>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Percentage */}
          {isEnrolled && (
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-400">Progress:</span>
              <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="font-bold text-indigo-300">{progressPercentage}%</span>
            </div>
          )}

          {/* Mobile Curriculum Toggle */}
          <button
            type="button"
            onClick={() => setIsSidebarOpenMobile((prev) => !prev)}
            className="lg:hidden p-1.5 rounded-lg border border-slate-800 bg-slate-800/80 text-slate-300 hover:text-white"
            aria-label="Toggle syllabus sidebar"
          >
            {isSidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Learning Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Player and Lesson Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {!hasAccess ? (
            /* Locked Content Gate */
            <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Enrollment Required</h2>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                This lesson is part of the full curriculum for <strong>{course.title}</strong>. Enroll for free to unlock all video lessons and track your completion progress.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleEnrollFromPlayer}
                  isLoading={isEnrolling}
                >
                  {user ? 'Enroll in Course for Free' : 'Sign In to Enroll'}
                </Button>
              </div>
            </div>
          ) : currentLesson ? (
            /* Video Container */
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Course Completed Celebration Banner */}
              {isEnrolled && progressPercentage === 100 && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/60 border border-emerald-500/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <PartyPopper className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        Course Completed! 🎉
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Outstanding work! You've successfully finished all lessons in this course.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to="/dashboard">
                      <Button variant="primary" size="sm">
                        My Dashboard
                      </Button>
                    </Link>
                    <Link to="/courses">
                      <Button variant="secondary" size="sm">
                        More Courses
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-slate-950 text-slate-400 space-y-2">
                    <AlertCircle className="w-10 h-10 text-amber-400" />
                    <p className="text-sm font-semibold text-slate-200">Video source unavailable</p>
                    <p className="text-xs max-w-sm">
                      The video URL configured for this lesson is invalid or unsupported.
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                {/* Navigation prev/next */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!previousLesson}
                    onClick={() => {
                      if (previousLesson) {
                        navigate(`/learn/${course.slug}/${previousLesson.id}`)
                      }
                    }}
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Previous
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!nextLesson}
                    onClick={() => {
                      if (nextLesson) {
                        navigate(`/learn/${course.slug}/${nextLesson.id}`)
                      }
                    }}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Next
                  </Button>
                </div>

                {/* Mark Complete CTA */}
                {isEnrolled && (
                  <Button
                    variant={isCurrentLessonCompleted ? 'outline' : 'primary'}
                    size="sm"
                    onClick={handleToggleComplete}
                    isLoading={isUpdatingProgress}
                    leftIcon={<CheckCircle2 className={`w-4 h-4 ${isCurrentLessonCompleted ? 'text-emerald-400' : ''}`} />}
                    className={isCurrentLessonCompleted ? 'border-emerald-600/60 text-emerald-300' : ''}
                  >
                    {isCurrentLessonCompleted ? 'Completed (Click to undo)' : 'Mark as Complete'}
                  </Button>
                )}
              </div>

              {/* Lesson Title and Info */}
              <div className="space-y-4 text-left border-t border-slate-800/80 pt-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
                    <span>Lesson {currentIndex + 1} of {lessons.length}</span>
                    <span>•</span>
                    <span>{formatSeconds(currentLesson.durationSeconds)}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{currentLesson.title}</h2>
                </div>

                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentLesson.description}
                </div>

                {/* Resources */}
                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Lesson Resources
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {currentLesson.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                          <span>{res.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              This course does not have any lessons available.
            </div>
          )}
        </main>

        {/* Right Column: Curriculum Syllabus Drawer */}
        <aside
          className={`w-80 shrink-0 border-l border-slate-800 bg-slate-900/80 flex flex-col transition-transform duration-200 z-20 absolute inset-y-0 right-0 lg:static lg:translate-x-0 ${
            isSidebarOpenMobile ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Curriculum</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {completedCount} of {lessons.length} completed ({progressPercentage}%)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpenMobile(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {lessons.map((lesson, idx) => {
              const isActive = currentLesson?.id === lesson.id
              const isComp = Boolean(progressMap[lesson.id]?.completed)
              const canWatch = isEnrolled || lesson.isPreview || isAdmin

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => {
                    navigate(`/learn/${course.slug}/${lesson.id}`)
                    setIsSidebarOpenMobile(false)
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
                    isActive
                      ? 'bg-indigo-600/20 border border-indigo-500/50 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                  }`}
                >
                  {/* Status Icon */}
                  <div className="mt-0.5 shrink-0">
                    {isComp ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : canWatch ? (
                      <PlayCircle className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>

                  {/* Lesson Meta */}
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-xs font-semibold leading-snug truncate ${isActive ? 'text-indigo-200 font-bold' : ''}`}>
                      {idx + 1}. {lesson.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{formatSeconds(lesson.durationSeconds)}</span>
                      {lesson.isPreview && (
                        <span className="text-[10px] text-cyan-400 font-bold uppercase">
                          Free Preview
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}
