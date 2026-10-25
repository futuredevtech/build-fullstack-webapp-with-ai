import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { LearnerSidebar } from './LearnerSidebar'
import { LayoutDashboard, BookOpen, User, Settings } from 'lucide-react'

export const LearnerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <SiteHeader />

      {/* Mobile learner sub-navigation tabs */}
      <div className="md:hidden border-b border-slate-800 bg-slate-900/60 px-4 py-2 flex items-center justify-around overflow-x-auto">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard
        </NavLink>
        <NavLink
          to="/dashboard/courses"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <BookOpen className="w-3.5 h-3.5" />
          My Courses
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <User className="w-3.5 h-3.5" />
          Profile
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <Settings className="w-3.5 h-3.5" />
          Settings
        </NavLink>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <LearnerSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
