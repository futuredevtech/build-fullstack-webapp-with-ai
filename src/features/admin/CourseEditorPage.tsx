import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import {
  getCourseById,
  createCourse,
  updateCourse,
  getCourseLessons,
} from '@/features/courses/course.service'
import type { Course, CourseLevel } from '@/types/domain'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { CourseArtworkPicker } from '@/components/courses/CourseArtworkPicker'
import { DEFAULT_COURSE_THUMBNAIL } from '@/lib/utils/imageUrl'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from 'lucide-react'

export const CourseEditorPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const isEditing = Boolean(courseId)
  const { user } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [lessonCount, setLessonCount] = useState(0)

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState(DEFAULT_COURSE_THUMBNAIL)
  const [isThumbnailValid, setIsThumbnailValid] = useState(true)
  const [category, setCategory] = useState('Web Development')
  const [level, setLevel] = useState<CourseLevel>('Beginner')
  const [durationMinutes, setDurationMinutes] = useState(120)
  const [featured, setFeatured] = useState(false)
  const [published, setPublished] = useState(false)

  // Instructor
  const [instructorName, setInstructorName] = useState('')
  const [instructorBio, setInstructorBio] = useState('')

  // Tags & Outcomes
  const [tagsInput, setTagsInput] = useState('')
  const [outcomes, setOutcomes] = useState<string[]>([
    'Build full-stack modern web applications from scratch',
  ])

  // Auto-generate slug from title if user hasn't customized it manually
  const [manualSlug, setManualSlug] = useState(false)

  useEffect(() => {
    if (!isEditing || !courseId) return

    setIsLoading(true)
    getCourseById(courseId)
      .then(async (course) => {
        if (!course) {
          toastError('Course not found')
          navigate('/admin/courses')
          return
        }

        setTitle(course.title)
        setSlug(course.slug)
        setManualSlug(true)
        setSubtitle(course.subtitle || '')
        setDescription(course.description || '')
        setThumbnailUrl(course.thumbnailUrl || DEFAULT_COURSE_THUMBNAIL)
        setCategory(course.category || 'Web Development')
        setLevel(course.level || 'Beginner')
        setDurationMinutes(course.durationMinutes || 60)
        setFeatured(course.featured || false)
        setPublished(course.published || false)

        setInstructorName(course.instructor?.name || '')
        setInstructorBio(course.instructor?.bio || '')

        setTagsInput(course.tags ? course.tags.join(', ') : '')
        setOutcomes(
          course.learningOutcomes && course.learningOutcomes.length > 0
            ? course.learningOutcomes
            : ['']
        )

        const lessons = await getCourseLessons(courseId)
        setLessonCount(lessons.length)
      })
      .catch((err) => {
        toastError('Failed to load course', err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [courseId, isEditing])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!manualSlug && !isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlug(generated)
    }
  }

  const handleAddOutcome = () => {
    setOutcomes((prev) => [...prev, ''])
  }

  const handleOutcomeChange = (index: number, val: string) => {
    setOutcomes((prev) => {
      const updated = [...prev]
      updated[index] = val
      return updated
    })
  }

  const handleRemoveOutcome = (index: number) => {
    setOutcomes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !slug.trim()) {
      toastError('Validation Error', 'Title and slug are required.')
      return
    }

    if (!isThumbnailValid) {
      toastError(
        'Invalid Thumbnail',
        'Please select a valid bundled artwork or test a working HTTPS image URL before saving.'
      )
      return
    }

    // If publishing, enforce at least 1 lesson rule
    if (published && isEditing && lessonCount === 0) {
      toastError(
        'Cannot Publish Empty Course',
        'A course must contain at least 1 lesson before it can be published. Save as draft first, then add lessons.'
      )
      return
    }

    setIsSaving(true)

    const cleanTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const cleanOutcomes = outcomes.map((o) => o.trim()).filter((o) => o.length > 0)

    const coursePayload: any = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      thumbnailUrl: thumbnailUrl.trim(),
      category: category.trim(),
      level,
      tags: cleanTags,
      learningOutcomes: cleanOutcomes,
      instructor: {
        name: instructorName.trim() || 'CourseHub Instructor',
        bio: instructorBio.trim(),
      },
      durationMinutes: Number(durationMinutes) || 0,
      featured,
      published,
    }

    try {
      if (isEditing && courseId) {
        await updateCourse(courseId, coursePayload)
        success('Course updated successfully!')
        navigate('/admin/courses')
      } else {
        if (!user) throw new Error('You must be signed in as admin to create a course')
        // When newly created, initial course should be draft until lessons are added
        const newId = await createCourse(
          { ...coursePayload, published: false },
          user.uid
        )
        success(
          'Course created!',
          'Course saved as draft. Now you can add curriculum lessons.'
        )
        navigate(`/admin/courses/${newId}/lessons`)
      }
    } catch (err: any) {
      toastError('Save failed', err.message || 'An error occurred while saving the course.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6 animate-pulse text-left">
        <div className="h-8 bg-slate-800 rounded w-1/4" />
        <div className="h-96 bg-slate-900 border border-slate-800 rounded-2xl" />
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
            {isEditing ? 'Edit Course' : 'Create Course'}
          </h1>
        </div>

        {isEditing && (
          <Link to={`/admin/courses/${courseId}/lessons`}>
            <Button variant="secondary" leftIcon={<BookOpen className="w-4 h-4 text-indigo-400" />}>
              Manage Lessons ({lessonCount})
            </Button>
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Course Info */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-white">1. Course Essentials</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Course Title"
              placeholder="e.g. Modern Full-Stack React & Firebase"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />

            <Input
              label="URL Slug"
              placeholder="e.g. react-firebase-basics"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                setManualSlug(true)
              }}
              required
              hint="Unique URL path: /courses/[slug]"
            />
          </div>

          <Input
            label="Short Subtitle / Summary"
            placeholder="A concise, punchy description of what students will build"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Full Course Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of course scope, prerequisites, and key topics..."
              className="w-full rounded-lg bg-slate-900 text-slate-100 placeholder-slate-500 border border-slate-700 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Web Development">Web Development</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Mobile Development">Mobile Development</option>
            </Select>

            <Select
              label="Difficulty Level"
              value={level}
              onChange={(e) => setLevel(e.target.value as CourseLevel)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </Select>

            <Input
              label="Est. Duration (Minutes)"
              type="number"
              min="0"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Course Artwork Picker (Section 8.7 PRD flow) */}
        <div className="space-y-2">
          <CourseArtworkPicker
            value={thumbnailUrl}
            onChange={setThumbnailUrl}
            onValidityChange={setIsThumbnailValid}
          />
        </div>

        {/* Learning Outcomes */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">2. Learning Outcomes</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Key skills or milestones the student will acquire.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOutcome}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Outcome
            </Button>
          </div>

          <div className="space-y-3">
            {outcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  placeholder={`Learning outcome #${idx + 1}`}
                  value={outcome}
                  onChange={(e) => handleOutcomeChange(idx, e.target.value)}
                />
                {outcomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOutcome(idx)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    aria-label="Remove outcome"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructor & Tags */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-white">3. Instructor &amp; Discovery Tags</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Instructor Name"
              placeholder="e.g. Alex Rivera"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
            />

            <Input
              label="Instructor Bio"
              placeholder="e.g. Senior Frontend Engineer & Tech Educator"
              value={instructorBio}
              onChange={(e) => setInstructorBio(e.target.value)}
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            placeholder="react, typescript, firebase, tailwind"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            hint="Used for client catalog keyword searches."
          />
        </div>

        {/* Publication & Status */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">4. Visibility &amp; Promotion</h2>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div>
                <span className="text-sm font-semibold text-slate-200">
                  Feature this course on the homepage
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Featured courses are highlighted with a badge and given priority on the home page.
                </p>
              </div>
            </label>

            {isEditing && (
              <label className="flex items-start gap-3 cursor-pointer pt-3 border-t border-slate-800">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-200">
                    Publish Course (Live in Public Catalog)
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Unchecking saves this course as a draft. Requires at least 1 lesson to publish.
                  </p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link to="/admin/courses">
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
            {isEditing ? 'Save Changes' : 'Create & Proceed to Lessons'}
          </Button>
        </div>
      </form>
    </div>
  )
}
