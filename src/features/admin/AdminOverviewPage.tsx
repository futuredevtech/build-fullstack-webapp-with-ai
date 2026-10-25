import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllCoursesAdmin } from '@/features/courses/course.service'
import type { Course } from '@/types/domain'
import { Button } from '@/components/ui/Button'
import {
  BookMarked,
  CheckCircle2,
  FileEdit,
  PlusCircle,
  Eye,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { DEFAULT_COURSE_THUMBNAIL } from '@/lib/utils/imageUrl'

export const AdminOverviewPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    getAllCoursesAdmin()
      .then((data) => {
        if (!active) return
        setCourses(data)
      })
      .catch((err) => console.error('Failed to load admin courses:', err))
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const totalCourses = courses.length
  const publishedCourses = courses.filter((c) => c.published).length
  const draftCourses = totalCourses - publishedCourses
  const totalLessons = courses.reduce((acc, c) => acc + (c.lessonCount || 0), 0)

  return (
    <div className="space-y-10 text-left">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Administrator Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage course content, publish curriculum drafts, and organize lessons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/courses/new">
            <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Create Course
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />}>
              View Live Site
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Courses
          </span>
          <p className="text-3xl font-extrabold text-white">{totalCourses}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Published Live
          </span>
          <p className="text-3xl font-extrabold text-emerald-400">{publishedCourses}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Drafts in Progress
          </span>
          <p className="text-3xl font-extrabold text-amber-400">{draftCourses}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Total Lessons
          </span>
          <p className="text-3xl font-extrabold text-indigo-300">{totalLessons}</p>
        </div>
      </div>

      {/* Quick Course Inventory */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Courses</h2>
          <Link to="/admin/courses" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
            Manage all ({courses.length})
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 rounded-xl bg-slate-900 border border-slate-800" />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 divide-y divide-slate-800 overflow-hidden">
            {courses.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img
                      src={course.thumbnailUrl || DEFAULT_COURSE_THUMBNAIL}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{course.title}</h4>
                      {course.published ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800/80">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      /{course.slug} • {course.category} • {course.lessonCount || 0} lessons
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/admin/courses/${course.id}/lessons`}>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Lessons ({course.lessonCount || 0})
                    </Button>
                  </Link>
                  <Link to={`/admin/courses/${course.id}/edit`}>
                    <Button variant="secondary" size="sm" className="text-xs">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
            No courses found. Click "Create Course" to add your first course.
          </div>
        )}
      </section>
    </div>
  )
}
