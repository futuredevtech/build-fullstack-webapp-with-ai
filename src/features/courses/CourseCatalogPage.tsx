import React, { useEffect, useState, useMemo } from 'react'
import { CourseGrid } from '@/components/courses/CourseGrid'
import { CourseFilters, type FilterState } from '@/components/courses/CourseFilters'
import { EmptyState } from '@/components/ui/EmptyState'
import { getPublishedCourses } from './course.service'
import type { Course } from '@/types/domain'
import { BookOpen } from 'lucide-react'

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    level: '',
    sortBy: 'featured',
  })

  useEffect(() => {
    let active = true
    getPublishedCourses()
      .then((data) => {
        if (!active) return
        setCourses(data)
      })
      .catch((err) => console.error('Error fetching course catalog:', err))
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Derive unique categories from loaded courses
  const availableCategories = useMemo(() => {
    const set = new Set<string>()
    courses.forEach((c) => {
      if (c.category) set.add(c.category)
    })
    return Array.from(set).sort()
  }, [courses])

  // Filter & sort logic
  const filteredCourses = useMemo(() => {
    let result = [...courses]

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }

    // Category
    if (filters.category) {
      result = result.filter((c) => c.category === filters.category)
    }

    // Level
    if (filters.level) {
      result = result.filter((c) => c.level === filters.level)
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'featured') {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
      }
      if (filters.sortBy === 'newest') {
        const timeA = a.createdAt?.seconds || 0
        const timeB = b.createdAt?.seconds || 0
        return timeB - timeA
      }
      if (filters.sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

    return result
  }, [courses, filters])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalog Header */}
      <div className="text-left space-y-2 border-b border-slate-800/80 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Courses
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
          Practical lessons to help you build skills one step at a time.
        </p>
      </div>

      {/* Filter and search bar */}
      <CourseFilters
        filters={filters}
        onFilterChange={setFilters}
        availableCategories={availableCategories}
        totalResults={filteredCourses.length}
      />

      {/* Course Grid or Empty State */}
      {isLoading ? (
        <CourseGrid courses={[]} isLoading={true} skeletonCount={6} />
      ) : filteredCourses.length > 0 ? (
        <CourseGrid courses={filteredCourses} />
      ) : (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="No courses found"
          description={
            filters.search || filters.category || filters.level
              ? 'No courses matched your current search filters. Try resetting the filters or searching for another term.'
              : 'There are currently no published courses available in the catalog.'
          }
          actionLabel={
            filters.search || filters.category || filters.level
              ? 'Reset Filters'
              : undefined
          }
          onAction={
            filters.search || filters.category || filters.level
              ? () =>
                  setFilters({
                    search: '',
                    category: '',
                    level: '',
                    sortBy: 'featured',
                  })
              : undefined
          }
        />
      )}
    </div>
  )
}
