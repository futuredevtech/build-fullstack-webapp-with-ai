import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { LogOut, Shield, KeyRound } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const isPasswordUser = user?.providerData.some((p) => p.providerId === 'password')
  const isGoogleUser = user?.providerData.some((p) => p.providerId === 'google.com')

  return (
    <div className="max-w-3xl space-y-8 text-left">
      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review your connected login providers and session preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Security / Provider Status */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-400" />
            Authentication Method
          </h3>

          <div className="space-y-2 text-sm text-slate-300">
            {isGoogleUser && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span>Google OAuth Authentication</span>
                <span className="text-xs text-emerald-400 font-semibold">Active</span>
              </div>
            )}
            {isPasswordUser && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span>Email &amp; Password</span>
                <span className="text-xs text-emerald-400 font-semibold">Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Session / Sign Out */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Active Session</h3>
          <p className="text-xs text-slate-400">
            End your current session on this device. You will need to sign in again to resume your learning progress.
          </p>

          <Button
            variant="outline"
            className="text-rose-400 border-rose-900/60 hover:bg-rose-950/30"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sign Out of CourseHub
          </Button>
        </div>
      </div>
    </div>
  )
}
