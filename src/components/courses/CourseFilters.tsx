import React from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { CourseLevel } from '@/types/domain'

export interface FilterState {
  search: string
  category: string
  level: string
  sortBy: 'featured' | 'newest' | 'alphabetical'
}

export interface CourseFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  availableCategories: string[]
  totalResults: number
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  onFilterChange,
  availableCategories,
  totalResults,
}) => {
  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.level || filters.sortBy !== 'featured'
  )

  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      category: '',
      level: '',
      sortBy: 'featured',
    })
  }

  return (
    <div className="space-y-4 rounded-2xl bg-slate-900/60 border border-slate-800/90 p-4 sm:p-5">
      {/* Top Search & Results Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-5">
          <Input
            placeholder="Search by title, topic, or keyword..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            rightIcon={
              filters.search ? (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, search: '' })}
                  className="p-1 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Dropdowns */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>

          <Select
            value={filters.level}
            onChange={(e) => onFilterChange({ ...filters, level: e.target.value })}
            aria-label="Filter by difficulty level"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>

          <Select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as FilterState['sortBy'],
              })
            }
            aria-label="Sort courses"
          >
            <option value="featured">Featured First</option>
            <option value="newest">Newest First</option>
            <option value="alphabetical">Title (A – Z)</option>
          </Select>
        </div>
      </div>

      {/* Active Filter Chips & Clear Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            Showing <strong className="text-slate-200">{totalResults}</strong> {totalResults === 1 ? 'course' : 'courses'}
          </span>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-indigo-400 hover:text-indigo-300 py-1 h-auto text-xs"
          >
            Reset All Filters
          </Button>
        )}
      </div>
    </div>
  )
}
