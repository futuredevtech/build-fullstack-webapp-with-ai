import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  User,
  Settings,
  Compass,
  LogOut,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'

export const LearnerSidebar: React.FC = () => {
  const { logout, profile, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const displayName = profile?.displayName || user?.displayName || 'Learner'

  const navLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-300 font-bold text-sm shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden text-left">
            <p className="text-xs font-semibold text-white truncate">{displayName}</p>
            <p className="text-[11px] text-indigo-400 font-medium">Active Learner</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5" aria-label="Learner menu">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Student Space
          </p>
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Catalog discovery shortcut */}
        <div className="pt-4 border-t border-slate-800/80">
          <NavLink
            to="/courses"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors"
          >
            <Compass className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Browse Catalog</span>
          </NavLink>
        </div>
      </div>

      {/* Sign Out Action */}
      <div className="pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
