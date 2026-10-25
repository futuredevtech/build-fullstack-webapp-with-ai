import React from 'react'
import { Navigate, Outlet, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { sanitizeReturnTo } from '@/lib/utils/sanitizeReturnTo'
import { Loader2 } from 'lucide-react'

export const PublicOnly: React.FC = () => {
  const { user, isLoading } = useAuth()
  const [searchParams] = useSearchParams()

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (user) {
    const rawReturnTo = searchParams.get('returnTo')
    const destination = sanitizeReturnTo(rawReturnTo, '/dashboard')
    return <Navigate to={destination} replace />
  }

  return <Outlet />
}
