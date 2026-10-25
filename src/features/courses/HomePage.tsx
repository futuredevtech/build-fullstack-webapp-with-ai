import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  PlayCircle,
  Sparkles,
  Trophy,
  Layers,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CourseGrid } from '@/components/courses/CourseGrid'
import { getPublishedCourses } from './course.service'
import type { Course } from '@/types/domain'

export const HomePage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    getPublishedCourses()
      .then((courses) => {
        if (!active) return
        const featured = courses.filter((c) => c.featured)
        // If no course explicitly marked featured, display first 3 published
        setFeaturedCourses(featured.length > 0 ? featured.slice(0, 3) : courses.slice(0, 3))
      })
      .catch((err) => console.error('Failed to load courses on homepage:', err))
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-24 py-8 sm:py-16">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 -top-12 flex justify-center -z-10 pointer-events-none">
          <div className="w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-xs font-semibold text-indigo-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Modern Project-Driven Learning Platform</span>
          </div>

          {/* PRD Headings */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Learn by building <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              real projects.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Explore practical courses, follow hands-on lessons, and track your progress as you grow your skills.
          </p>

          {/* Primary CTAs */}
          <div className="pt-4 flex flex-wrap gap-4 justify-center items-center">
            <Link to="/courses">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="shadow-xl shadow-indigo-600/30"
              >
                Explore Courses
              </Button>
            </Link>

            <Link to="/register">
              <Button variant="secondary" size="lg">
                Start Learning Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Bar */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-1">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-slate-100">Zero Latency</span>
            <span className="text-xs text-slate-400">Bundled vector artwork</span>
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <PlayCircle className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-bold text-slate-100">Structured Lessons</span>
            <span className="text-xs text-slate-400">Step-by-step video player</span>
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-slate-100">Live Persistence</span>
            <span className="text-xs text-slate-400">Progress saved in Firestore</span>
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <Trophy className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-bold text-slate-100">100% Free Tier</span>
            <span className="text-xs text-slate-400">Spark compliant, no billing</span>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Curated Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Featured Courses
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Hand-picked courses designed to take you from foundational syntax to shipping full-stack apps.
            </p>
          </div>
          <Link to="/courses" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All Courses
            </Button>
          </Link>
        </div>

        {/* Courses Grid or Empty State */}
        {isLoading ? (
          <CourseGrid courses={[]} isLoading={true} skeletonCount={3} />
        ) : featuredCourses.length > 0 ? (
          <CourseGrid courses={featuredCourses} />
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200">No courses published yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Check back shortly or visit the admin area to create and publish initial courses.
            </p>
          </div>
        )}
      </section>

      {/* "How It Works" Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 pt-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Simple 4-Step Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            How CourseHub Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            No convoluted setups. Move seamlessly from discovering a topic to mastering lessons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-white">Discover</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore practical courses, review learning outcomes, and sample preview lessons without signing up.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-950 border border-violet-700/60 flex items-center justify-center text-violet-400 font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-white">Enroll Free</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create an account or sign in with Google in seconds. Single-click idempotent enrollment links courses to your profile.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-white">Learn &amp; Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch structured lessons with a distraction-free player, full curriculum drawer, and verified YouTube embeds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-bold text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-white">Track Progress</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mark lessons complete and resume anytime. Your progress percentage is verified in Firestore and always kept in sync.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
