import React from 'react'
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const RequireAdmin: React.FC = () => {
  const { user, isAdmin, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium text-slate-400">Verifying administrator permissions...</p>
      </div>
    )
  }

  if (!user) {
    const returnTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-600/40 flex items-center justify-center text-rose-400 mb-6 shadow-xl shadow-rose-950/50">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Access Denied</h1>
        <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
          You do not have administrative privileges to view this area. Administrator roles are securely provisioned via custom claims.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Learner Dashboard
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="secondary">Browse Public Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return <Outlet />
}
