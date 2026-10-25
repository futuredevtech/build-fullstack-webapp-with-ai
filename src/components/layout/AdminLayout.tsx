import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { AdminSidebar } from './AdminSidebar'
import { BarChart3, BookMarked, PlusCircle } from 'lucide-react'

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Admin Notice Bar */}
      <div className="w-full bg-violet-950/80 border-b border-violet-800/60 px-4 py-1.5 text-center text-xs font-semibold text-violet-200 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
        <span>CourseHub Administrator Mode Active</span>
      </div>

      <SiteHeader />

      {/* Mobile Admin Navigation Tabs */}
      <div className="md:hidden border-b border-slate-800 bg-slate-900/60 px-4 py-2 flex items-center justify-around overflow-x-auto">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Overview
        </NavLink>
        <NavLink
          to="/admin/courses"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <BookMarked className="w-3.5 h-3.5" />
          Courses
        </NavLink>
        <NavLink
          to="/admin/courses/new"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Create Course
        </NavLink>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
