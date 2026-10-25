import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getCourseById,
  getCourseLessons,
  deleteLesson,
  reorderLessons,
} from '@/features/courses/course.service'
import type { Course, Lesson } from '@/types/domain'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useToast } from '@/app/providers/ToastProvider'
import { formatSeconds } from '@/lib/utils/formatDuration'
import {
  ArrowLeft,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  PlayCircle,
  BookOpen,
} from 'lucide-react'

export const LessonManagerPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const { success, error: toastError } = useToast()

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReordering, setIsReordering] = useState(false)

  // Delete modal state
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = async () => {
    if (!courseId) return
    setIsLoading(true)
    try {
      const c = await getCourseById(courseId)
      setCourse(c)
      const l = await getCourseLessons(courseId)
      setLessons(l)
    } catch (err: any) {
      toastError('Failed to load lessons', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [courseId])

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!courseId || isReordering) return
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= lessons.length) return

    const newLessons = [...lessons]
    const temp = newLessons[index]
    newLessons[index] = newLessons[targetIndex]
    newLessons[targetIndex] = temp

    setLessons(newLessons)
    setIsReordering(true)

    try {
      const orderedIds = newLessons.map((l) => l.id)
      await reorderLessons(courseId, orderedIds)
      success('Lesson order updated')
    } catch (err: any) {
      toastError('Reorder failed', err.message)
      await loadData()
    } finally {
      setIsReordering(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!courseId || !lessonToDelete) return
    setIsDeleting(true)

    try {
      await deleteLesson(courseId, lessonToDelete.id)
      success('Lesson deleted', `"${lessonToDelete.title}" was removed.`)
      setLessonToDelete(null)
      await loadData()
    } catch (err: any) {
      toastError('Failed to delete lesson', err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading || !course) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-4 animate-pulse text-left">
        <div className="h-6 bg-slate-800 rounded w-1/4" />
        <div className="h-48 bg-slate-900 border border-slate-800 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <Link
            to="/admin/courses"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Curriculum Lessons
          </h1>
          <p className="text-xs text-slate-400">
            Course: <strong className="text-slate-200">{course.title}</strong> • {lessons.length} total lessons
          </p>
        </div>

        <Link to={`/admin/courses/${course.id}/lessons/new`}>
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Add Lesson
          </Button>
        </Link>
      </div>

      {/* Lesson List */}
      {lessons.length > 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 divide-y divide-slate-800 overflow-hidden shadow-xl">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/80 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                  {idx + 1}
                </div>

                <div className="overflow-hidden space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm truncate">
                      {lesson.title}
                    </h3>
                    {lesson.isPreview && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/80">
                        Free Preview
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Duration: {formatSeconds(lesson.durationSeconds)} • Provider: {lesson.videoProvider}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Reorder Buttons */}
                <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                  <button
                    type="button"
                    disabled={idx === 0 || isReordering}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded"
                    aria-label="Move lesson up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === lessons.length - 1 || isReordering}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded"
                    aria-label="Move lesson down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Edit */}
                <Link to={`/admin/courses/${course.id}/lessons/${lesson.id}/edit`}>
                  <Button variant="secondary" size="sm" leftIcon={<Edit className="w-3.5 h-3.5" />}>
                    Edit
                  </Button>
                </Link>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLessonToDelete(lesson)}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 p-2"
                  aria-label={`Delete lesson ${lesson.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 space-y-4">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No lessons added yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            This course requires at least 1 lesson before it can be published to the public catalog.
          </p>
          <Link to={`/admin/courses/${course.id}/lessons/new`}>
            <Button variant="primary" size="sm">Add First Lesson</Button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={Boolean(lessonToDelete)}
        onClose={() => setLessonToDelete(null)}
        title="Delete Lesson?"
        description={`Are you sure you want to delete lesson "${lessonToDelete?.title}"? This cannot be undone.`}
        confirmLabel="Yes, Delete Lesson"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
