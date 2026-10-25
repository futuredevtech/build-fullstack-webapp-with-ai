import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, BookOpen, Sparkles, ArrowRight } from 'lucide-react'
import type { Course } from '@/types/domain'
import { formatMinutes } from '@/lib/utils/formatDuration'
import { DEFAULT_COURSE_THUMBNAIL } from '@/lib/utils/imageUrl'

export interface CourseCardProps {
  course: Course
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [imageSrc, setImageSrc] = useState(course.thumbnailUrl || DEFAULT_COURSE_THUMBNAIL)

  const levelColor = {
    Beginner: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    Intermediate: 'bg-sky-950/80 text-sky-400 border-sky-800/60',
    Advanced: 'bg-purple-950/80 text-purple-400 border-purple-800/60',
  }[course.level] || 'bg-slate-800 text-slate-300 border-slate-700'

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-indigo-500/10 card-hover-glow focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {/* Thumbnail Aspect 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={imageSrc}
          alt={course.title}
          loading="lazy"
          onError={() => setImageSrc(DEFAULT_COURSE_THUMBNAIL)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Featured Badge */}
        {course.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-600/90 text-white text-[11px] font-bold tracking-wide shadow-md backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Featured</span>
          </div>
        )}

        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${levelColor}`}
          >
            {course.level}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col justify-between text-left space-y-4">
        <div className="space-y-2">
          {/* Category */}
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">
            {course.category}
          </span>

          {/* Title */}
          <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {course.subtitle || course.description}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {formatMinutes(course.durationMinutes)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              {course.lessonCount || 0} {course.lessonCount === 1 ? 'lesson' : 'lessons'}
            </span>
          </div>

          <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Details <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
