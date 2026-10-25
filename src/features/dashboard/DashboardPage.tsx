import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { getUserEnrollmentsWithProgress } from '@/features/learning/learning.service'
import type { Enrollment } from '@/types/domain'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Play,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react'
import { DEFAULT_COURSE_THUMBNAIL } from '@/lib/utils/imageUrl'
import { formatMinutes } from '@/lib/utils/formatDuration'

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const firstName =
    profile?.displayName?.split(' ')[0] ||
    user?.displayName?.split(' ')[0] ||
    'Learner'

  useEffect(() => {
    let active = true
    if (!user) return

    setIsLoading(true)
    getUserEnrollmentsWithProgress(user.uid)
      .then((data) => {
        if (!active) return
        setEnrollments(data)
      })
      .catch((err) => console.error('Failed to load user enrollments:', err))
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  // Compute stats
  const totalEnrolled = enrollments.length
  const completedCourses = enrollments.filter(
    (e) => (e.progressPercentage || 0) === 100
  ).length
  const inProgressCourses = totalEnrolled - completedCourses

  // Most recently accessed course for "Continue Learning" banner
  const continueCourse = enrollments.length > 0 ? enrollments[0] : null

  return (
    <div className="space-y-10 text-left">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {firstName}.
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Pick up where you left off or explore new technologies.
          </p>
        </div>

        <Link to="/courses">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Browse More Courses
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Enrolled Courses
            </span>
            <p className="text-2xl font-bold text-white mt-0.5">{totalEnrolled}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              In Progress
            </span>
            <p className="text-2xl font-bold text-white mt-0.5">{inProgressCourses}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Completed Courses
            </span>
            <p className="text-2xl font-bold text-white mt-0.5">{completedCourses}</p>
          </div>
        </div>
      </div>

      {/* "Continue Learning" Hero Card if enrolled */}
      {continueCourse && continueCourse.course && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Continue Learning
          </h2>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-700/40 shadow-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-28 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                <img
                  src={continueCourse.course.thumbnailUrl || DEFAULT_COURSE_THUMBNAIL}
                  alt={continueCourse.course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                  {continueCourse.course.category}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {continueCourse.course.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>{continueCourse.completedLessonsCount || 0} of {continueCourse.totalLessonsCount || 0} lessons completed</span>
                  <span>•</span>
                  <span className="font-semibold text-indigo-300">
                    {continueCourse.progressPercentage || 0}% Complete
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0">
              <Button
                variant="primary"
                onClick={() => {
                  const lessonId = continueCourse.lastLessonId || 'start'
                  navigate(`/learn/${continueCourse.courseSlug}/${lessonId}`)
                }}
                leftIcon={<Play className="w-4 h-4 fill-current" />}
              >
                Resume Course
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Enrolled Courses Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">My Enrolled Courses</h2>
          {enrollments.length > 0 && (
            <Link to="/dashboard/courses" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              View all
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-56 rounded-2xl bg-slate-900 border border-slate-800 p-4" />
            ))}
          </div>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enr) => {
              if (!enr.course) return null
              const pct = enr.progressPercentage || 0

              return (
                <div
                  key={enr.courseId}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img
                        src={enr.course.thumbnailUrl || DEFAULT_COURSE_THUMBNAIL}
                        alt={enr.course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      {enr.course.category}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {enr.course.title}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400 font-medium">
                        <span>Progress</span>
                        <span className="text-indigo-300 font-bold">{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const lessonId = enr.lastLessonId || 'start'
                        navigate(`/learn/${enr.courseSlug}/${lessonId}`)
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {pct === 100 ? 'Review Lessons' : 'Continue Learning'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={<GraduationCap className="w-8 h-8" />}
            title="Your learning journey starts here"
            description="You are not currently enrolled in any courses. Browse the catalog and start learning for free."
            actionLabel="Explore Courses"
            onAction={() => navigate('/courses')}
          />
        )}
      </section>
    </div>
  )
}
