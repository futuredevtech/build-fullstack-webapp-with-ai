import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  BookMarked,
  PlusCircle,
  Eye,
  LogOut,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'

export const AdminSidebar: React.FC = () => {
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

  const displayName = profile?.displayName || user?.displayName || 'Admin'

  const navLinks = [
    { to: '/admin', label: 'Admin Overview', icon: BarChart3, end: true },
    { to: '/admin/courses', label: 'Manage Courses', icon: BookMarked },
    { to: '/admin/courses/new', label: 'Create New Course', icon: PlusCircle },
  ]

  return (
    <aside className="w-64 shrink-0 border-r border-violet-900/40 bg-slate-900/60 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Admin Badge Banner */}
        <div className="p-3.5 rounded-xl bg-violet-950/60 border border-violet-700/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-violet-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="overflow-hidden text-left">
            <p className="text-xs font-bold text-violet-200 uppercase tracking-wider">
              Admin Portal
            </p>
            <p className="text-[11px] text-slate-300 truncate">{displayName}</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5" aria-label="Admin menu">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Course Management
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
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-violet-400" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Public view shortcut */}
        <div className="pt-4 border-t border-slate-800/80">
          <NavLink
            to="/courses"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4 shrink-0 text-slate-400" />
            <span>View Public Catalog</span>
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
