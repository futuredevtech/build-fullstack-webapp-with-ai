import React, { useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { updateDisplayName } from '@/features/auth/auth.service'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { User, Mail, Calendar, ShieldCheck, Check } from 'lucide-react'
import { formatDate } from '@/lib/utils/formatDate'

export const ProfilePage: React.FC = () => {
  const { user, profile, isAdmin, refreshUser } = useAuth()
  const { success, error: toastError } = useToast()

  const [nameInput, setNameInput] = useState(
    profile?.displayName || user?.displayName || ''
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) return

    setIsSaving(true)
    try {
      await updateDisplayName(nameInput)
      await refreshUser()
      success('Profile updated successfully!')
    } catch (err: any) {
      toastError('Update failed', err.message || 'Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const email = profile?.email || user?.email || ''
  const displayName = profile?.displayName || user?.displayName || 'Learner'

  return (
    <div className="max-w-3xl space-y-8 text-left">
      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Learner Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal account information and credentials.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex items-center gap-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/40"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 font-bold text-xl">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {displayName}
              {isAdmin && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-950 text-violet-300 border border-violet-800/60">
                  Admin
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">{email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-800">
          <Input
            label="Display Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            required
            leftIcon={<User className="w-4 h-4" />}
            disabled={isSaving}
          />

          <Input
            label="Email Address"
            value={email}
            disabled
            hint="Email address is managed by your authentication provider."
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
