import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import {
  GraduationCap,
  Menu,
  X,
  User as UserIcon,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const SiteHeader: React.FC = () => {
  const { user, profile, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      setIsProfileDropdownOpen(false)
      setIsMobileMenuOpen(false)
      navigate('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Learner'
  const email = profile?.email || user?.email || ''

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              Course<span className="text-indigo-400">Hub</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <Link
            to="/courses"
            className={`text-sm font-medium transition-colors hover:text-white ${
              location.pathname.startsWith('/courses') ? 'text-indigo-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Courses
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-white ${
                location.pathname.startsWith('/dashboard') ? 'text-indigo-400 font-semibold' : 'text-slate-300'
              }`}
            >
              My Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-950/80 border border-violet-700/60 text-violet-300 hover:bg-violet-900/60 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop User / Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-900 border border-slate-800 transition-colors focus:ring-2 focus:ring-indigo-500"
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="true"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-300 text-xs font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-slate-200 pr-1 max-w-[120px] truncate">
                  {displayName}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-left">
                    <div className="px-4 py-2 border-b border-slate-800/80">
                      <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/courses"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        My Enrolled Courses
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Account Settings
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-violet-300 hover:bg-violet-950/40 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-violet-400" />
                          Admin Console
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <Link
            to="/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-slate-200 hover:text-indigo-400"
          >
            Courses Catalog
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-medium py-2 text-slate-200 hover:text-indigo-400"
              >
                My Dashboard
              </Link>
              <Link
                to="/dashboard/courses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-medium py-2 text-slate-200 hover:text-indigo-400"
              >
                My Courses
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-medium py-2 text-slate-200 hover:text-indigo-400"
              >
                Profile ({displayName})
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-medium py-2 text-slate-200 hover:text-indigo-400"
              >
                Account Settings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold py-2 text-violet-400 hover:text-violet-300"
                >
                  Admin Console
                </Link>
              )}
              <div className="pt-2 border-t border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-rose-400 border-rose-900/60 hover:bg-rose-950/30"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
