import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { getUserEnrollmentsWithProgress } from '@/features/learning/learning.service'
import type { Enrollment } from '@/types/domain'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { DEFAULT_COURSE_THUMBNAIL } from '@/lib/utils/imageUrl'
import { Search, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react'

export const MyCoursesPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    if (!user) return

    setIsLoading(true)
    getUserEnrollmentsWithProgress(user.uid)
      .then((data) => {
        if (!active) return
        setEnrollments(data)
      })
      .catch((err) => console.error('Failed to load enrolled courses:', err))
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  const filtered = enrollments.filter((e) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      e.course?.title.toLowerCase().includes(q) ||
      e.course?.category.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your progress across all courses you've joined.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search your courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-60 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((enr) => {
            if (!enr.course) return null
            const pct = enr.progressPercentage || 0
            const isCompleted = pct === 100

            return (
              <div
                key={enr.courseId}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                    <img
                      src={enr.course.thumbnailUrl || DEFAULT_COURSE_THUMBNAIL}
                      alt={enr.course.title}
                      className="w-full h-full object-cover"
                    />
                    {isCompleted && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 text-[10px] font-bold backdrop-blur-sm">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                    {enr.course.category}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {enr.course.title}
                  </h3>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400 font-medium">
                      <span>{enr.completedLessonsCount || 0} of {enr.totalLessonsCount || 0} lessons</span>
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
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const lessonId = enr.lastLessonId || 'start'
                      navigate(`/learn/${enr.courseSlug}/${lessonId}`)
                    }}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {isCompleted ? 'Review Course' : 'Resume Lesson'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title={search ? 'No matching courses found' : 'No courses found'}
          description={
            search
              ? 'Try modifying your search term to find what you are looking for.'
              : 'You have not enrolled in any courses yet.'
          }
          actionLabel="Explore Catalog"
          onAction={() => navigate('/courses')}
        />
      )}
    </div>
  )
}
