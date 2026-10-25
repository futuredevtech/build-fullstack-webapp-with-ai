import React from 'react'
import type { Course } from '@/types/domain'
import { CourseCard } from './CourseCard'
import { CourseCardSkeleton } from '@/components/ui/Skeleton'

export interface CourseGridProps {
  courses: Course[]
  isLoading?: boolean
  skeletonCount?: number
}

export const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  isLoading = false,
  skeletonCount = 6,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <CourseCardSkeleton key={idx} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id || course.slug} course={course} />
      ))}
    </div>
  )
}
