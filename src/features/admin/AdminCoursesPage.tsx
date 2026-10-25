import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  getAllCoursesAdmin,
  setCoursePublished,
  deleteCourse,
} from '@/features/courses/course.service'
import type { Course } from '@/types/domain'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Dialog } from '@/components/ui/Dialog'
import { useToast } from '@/app/providers/ToastProvider'
import {
  PlusCircle,
  Search,
  BookOpen,
  Edit,
  Trash2,
  Globe,
  EyeOff,
  Sparkles,
} from 'lucide-react'
import { DEFAULT_COURSE_THUMBNAIL } from '@/lib/utils/imageUrl'
import { seedDemoCourses } from './seed.service'
import { useAuth } from '@/app/providers/AuthProvider'

export const AdminCoursesPage: React.FC = () => {
  const { user } = useAuth()
  const { success, error: toastError } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSeeding, setIsSeeding] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

  // Delete modal state
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Publish loading state
  const [publishingId, setPublishingId] = useState<string | null>(null)

  const handleSeed = async () => {
    if (!user) return
    setIsSeeding(true)
    try {
      const res = await seedDemoCourses(user.uid)
      success('Demo data seeded!', `Created ${res.created} courses (${res.skipped} already existed).`)
      await loadCourses()
    } catch (err: any) {
      toastError('Seeding failed', err.message)
    } finally {
      setIsSeeding(false)
    }
  }

  const loadCourses = async () => {
    setIsLoading(true)
    try {
      const data = await getAllCoursesAdmin()
      setCourses(data)
    } catch (err: any) {
      toastError('Failed to load courses', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        !search.trim() ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.slug.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'published'
          ? c.published
          : !c.published

      return matchesSearch && matchesStatus
    })
  }, [courses, search, statusFilter])

  const handleTogglePublish = async (course: Course) => {
    setPublishingId(course.id)
    const nextState = !course.published

    try {
      await setCoursePublished(course.id, nextState)
      success(
        nextState ? 'Course published!' : 'Course unpublished',
        nextState
          ? `"${course.title}" is now visible in the public catalog.`
          : `"${course.title}" is now in draft mode and hidden from the public.`
      )
      await loadCourses()
    } catch (err: any) {
      toastError('Publishing failed', err.message || 'Could not update publication state.')
    } finally {
      setPublishingId(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return
    setIsDeleting(true)

    try {
      await deleteCourse(courseToDelete.id)
      success('Course deleted', `"${courseToDelete.title}" and its lessons have been removed.`)
      setCourseToDelete(null)
      await loadCourses()
    } catch (err: any) {
      toastError('Delete failed', err.message || 'Could not delete course.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Manage Courses
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Publish courses, edit descriptions, and curate curriculum lessons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleSeed}
            isLoading={isSeeding}
            leftIcon={<Sparkles className="w-4 h-4 text-amber-400" />}
          >
            Seed Demo Courses
          </Button>

          <Link to="/admin/courses/new">
            <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Create New Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8">
          <Input
            placeholder="Search courses by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
        <div className="sm:col-span-4">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter courses by status"
          >
            <option value="all">All Course Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </Select>
        </div>
      </div>

      {/* Course List / Table */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-20 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 divide-y divide-slate-800 overflow-hidden shadow-xl">
          {filteredCourses.map((course) => {
            const isPub = course.published
            const isThisPublishing = publishingId === course.id

            return (
              <div
                key={course.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-900/80 transition-colors"
              >
                {/* Course Metadata & Thumbnail */}
                <div className="flex items-start sm:items-center gap-4 overflow-hidden">
                  <div className="w-24 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img
                      src={course.thumbnailUrl || DEFAULT_COURSE_THUMBNAIL}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white text-base truncate">
                        {course.title}
                      </h3>
                      {isPub ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                          Published
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800/80">
                          Draft
                        </span>
                      )}
                      {course.featured && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                          <Sparkles className="w-2.5 h-2.5" /> Featured
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400">
                      Slug: <code className="text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono">/{course.slug}</code> • {course.category} • {course.level}
                    </p>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {/* Manage Lessons */}
                  <Link to={`/admin/courses/${course.id}/lessons`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<BookOpen className="w-3.5 h-3.5 text-indigo-400" />}
                    >
                      Lessons ({course.lessonCount || 0})
                    </Button>
                  </Link>

                  {/* Edit Course Metadata */}
                  <Link to={`/admin/courses/${course.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                  </Link>

                  {/* Publish / Unpublish Toggle */}
                  <Button
                    variant={isPub ? 'ghost' : 'outline'}
                    size="sm"
                    isLoading={isThisPublishing}
                    onClick={() => handleTogglePublish(course)}
                    leftIcon={isPub ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Globe className="w-3.5 h-3.5 text-emerald-400" />}
                    className={isPub ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300 border-emerald-700/60'}
                  >
                    {isPub ? 'Unpublish' : 'Publish'}
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCourseToDelete(course)}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 p-2"
                    aria-label={`Delete course ${course.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 space-y-4">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching courses found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search query or status filter.'
              : 'You have not created any courses yet.'}
          </p>
          <Link to="/admin/courses/new">
            <Button variant="primary" size="sm">Create First Course</Button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={Boolean(courseToDelete)}
        onClose={() => setCourseToDelete(null)}
        title="Delete Course?"
        description={`Are you sure you want to delete "${courseToDelete?.title}"? This will permanently delete the course document and all of its associated lessons. This action cannot be undone.`}
        confirmLabel="Yes, Delete Course"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
