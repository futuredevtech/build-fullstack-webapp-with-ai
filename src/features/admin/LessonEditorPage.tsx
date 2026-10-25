import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useToast } from '@/app/providers/ToastProvider'
import {
  getCourseById,
  getCourseLessons,
  createLesson,
  updateLesson,
} from '@/features/courses/course.service'
import type { Course, Lesson, LessonResource } from '@/types/domain'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getYouTubeEmbedUrl, isValidYouTubeUrl } from '@/lib/utils/videoUrl'
import {
  ArrowLeft,
  Save,
  PlayCircle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

export const LessonEditorPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const isEditing = Boolean(lessonId)
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(5)
  const [durationSecondsRemainder, setDurationSecondsRemainder] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  const [resources, setResources] = useState<LessonResource[]>([])

  useEffect(() => {
    if (!courseId) return
    setIsLoading(true)

    getCourseById(courseId)
      .then(async (c) => {
        if (!c) {
          toastError('Course not found')
          navigate('/admin/courses')
          return
        }
        setCourse(c)

        if (isEditing && lessonId) {
          const lessons = await getCourseLessons(courseId)
          const target = lessons.find((l) => l.id === lessonId)
          if (!target) {
            toastError('Lesson not found')
            navigate(`/admin/courses/${courseId}/lessons`)
            return
          }

          setTitle(target.title)
          setDescription(target.description || '')
          setVideoUrl(target.videoUrl || '')
          setIsPreview(target.isPreview || false)
          setResources(target.resources || [])

          const totalSec = target.durationSeconds || 0
          setDurationMinutes(Math.floor(totalSec / 60))
          setDurationSecondsRemainder(totalSec % 60)
        }
      })
      .catch((err) => {
        toastError('Failed to load lesson', err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [courseId, lessonId, isEditing])

  const handleAddResource = () => {
    setResources((prev) => [...prev, { label: '', url: '' }])
  }

  const handleResourceChange = (
    index: number,
    field: 'label' | 'url',
    val: string
  ) => {
    setResources((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: val }
      return copy
    })
  }

  const handleRemoveResource = (index: number) => {
    setResources((prev) => prev.filter((_, i) => i !== index))
  }

  const embedUrl = getYouTubeEmbedUrl(videoUrl)
  const isVideoValid = Boolean(videoUrl && embedUrl)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseId) return

    if (!title.trim()) {
      toastError('Validation Error', 'Lesson title is required.')
      return
    }

    if (!videoUrl.trim() || !isVideoValid) {
      toastError(
        'Invalid Video URL',
        'Please enter a valid YouTube video watch URL, share URL, or video ID.'
      )
      return
    }

    setIsSaving(true)
    const totalDurationSeconds =
      Number(durationMinutes) * 60 + Number(durationSecondsRemainder)

    const cleanResources = resources
      .map((r) => ({ label: r.label.trim(), url: r.url.trim() }))
      .filter((r) => r.label && r.url)

    try {
      if (isEditing && lessonId) {
        await updateLesson(courseId, lessonId, {
          title: title.trim(),
          description: description.trim(),
          durationSeconds: totalDurationSeconds,
          videoUrl: videoUrl.trim(),
          isPreview,
          resources: cleanResources,
        })
        success('Lesson updated successfully!')
      } else {
        const existingLessons = await getCourseLessons(courseId)
        const nextOrder = existingLessons.length + 1

        await createLesson(courseId, {
          title: title.trim(),
          description: description.trim(),
          order: nextOrder,
          durationSeconds: totalDurationSeconds,
          videoProvider: 'youtube',
          videoUrl: videoUrl.trim(),
          isPreview,
          resources: cleanResources,
        })
        success('Lesson created successfully!')
      }

      navigate(`/admin/courses/${courseId}/lessons`)
    } catch (err: any) {
      toastError('Save failed', err.message || 'Could not save lesson.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !course) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-4 animate-pulse text-left">
        <div className="h-6 bg-slate-800 rounded w-1/4" />
        <div className="h-80 bg-slate-900 border border-slate-800 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <Link
            to={`/admin/courses/${course.id}/lessons`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Lessons
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isEditing ? 'Edit Lesson' : 'Add New Lesson'}
          </h1>
          <p className="text-xs text-slate-400">
            Course: <strong className="text-slate-200">{course.title}</strong>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Lesson Details */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-white">Lesson Content</h2>

          <Input
            label="Lesson Title"
            placeholder="e.g. 01. Setting up Vite, TypeScript and Firebase"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Lesson Description &amp; Notes
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the concepts covered in this lesson, key timestamps, or exercises..."
              className="w-full rounded-lg bg-slate-900 text-slate-100 placeholder-slate-500 border border-slate-700 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Duration Minutes"
              type="number"
              min="0"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
            <Input
              label="Duration Seconds"
              type="number"
              min="0"
              max="59"
              value={durationSecondsRemainder}
              onChange={(e) => setDurationSecondsRemainder(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Video Embed & Preview */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-white">Video Source (YouTube)</h2>

          <Input
            label="YouTube Video URL or ID"
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or video ID"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
            hint="Supports watch URLs (youtube.com/watch?v=...), share URLs (youtu.be/...), and embed URLs."
            error={
              videoUrl && !isVideoValid
                ? 'Invalid YouTube URL or ID format. Please verify the URL.'
                : undefined
            }
          />

          {/* Video Preview */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Player Verification Preview
            </span>
            <div className="aspect-video w-full max-w-lg rounded-xl overflow-hidden bg-black border border-slate-800 shadow-inner flex items-center justify-center">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Video Preview"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs">
                  <PlayCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  Enter a valid YouTube URL to test the embed player
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Free Preview Option */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-base font-bold text-white">Access Permissions</h2>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPreview}
              onChange={(e) => setIsPreview(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <div>
              <span className="text-sm font-semibold text-slate-200">
                Allow as Free Preview
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                If checked, guests and unenrolled learners can watch this lesson directly from the course syllabus without enrolling.
              </p>
            </div>
          </label>
        </div>

        {/* External Resources */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Lesson Resources &amp; Links</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Optional reference links (e.g. GitHub repos, documentation).
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddResource}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Link
            </Button>
          </div>

          <div className="space-y-3">
            {resources.map((res, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Link Label (e.g. Source Code)"
                    value={res.label}
                    onChange={(e) => handleResourceChange(i, 'label', e.target.value)}
                  />
                  <Input
                    placeholder="https://github.com/..."
                    value={res.url}
                    onChange={(e) => handleResourceChange(i, 'url', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveResource(i)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Remove resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link to={`/admin/courses/${course.id}/lessons`}>
            <Button variant="ghost" disabled={isSaving}>
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isEditing ? 'Save Lesson Changes' : 'Create Lesson'}
          </Button>
        </div>
      </form>
    </div>
  )
}
