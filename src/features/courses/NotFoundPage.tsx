import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, Home, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-3xl bg-indigo-950/60 border border-indigo-700/40 flex items-center justify-center text-indigo-400 mb-6 shadow-xl shadow-indigo-950/50">
        <Compass className="w-10 h-10 animate-pulse" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
        404 — Page Not Found
      </h1>
      <p className="mt-3 text-slate-400 max-w-md text-sm sm:text-base leading-relaxed">
        The page or course you are looking for doesn't exist, has been unpublished, or may have moved.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/">
          <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Go Home
          </Button>
        </Link>
        <Link to="/courses">
          <Button variant="secondary" leftIcon={<BookOpen className="w-4 h-4" />}>
            Explore Courses
          </Button>
        </Link>
      </div>
    </div>
  )
}
