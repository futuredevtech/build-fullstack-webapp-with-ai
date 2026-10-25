import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '@/lib/firebase/client'
import {
  checkIsAdmin,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logoutUser,
  resetPassword,
} from '@/features/auth/auth.service'
import type { UserProfile } from '@/types/domain'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  isAdmin: boolean
  isLoading: boolean
  isConfigured: boolean
  login: typeof loginWithEmail
  register: typeof registerWithEmail
  loginWithGoogle: typeof loginWithGoogle
  logout: typeof logoutUser
  sendReset: typeof resetPassword
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const verifyAdmin = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false)
      return
    }
    const adminStatus = await checkIsAdmin(currentUser)
    setIsAdmin(adminStatus)
  }, [])

  const refreshUser = useCallback(async () => {
    if (auth?.currentUser) {
      await auth.currentUser.reload()
      setUser({ ...auth.currentUser })
      await verifyAdmin(auth.currentUser)
    }
  }, [verifyAdmin])

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false)
      return
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        await verifyAdmin(currentUser)

        // Listen to Firestore profile updates
        if (db) {
          const userDocRef = doc(db, 'users', currentUser.uid)
          const unsubscribeProfile = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              const data = snap.data()
              setProfile({
                uid: currentUser.uid,
                displayName: data.displayName || currentUser.displayName || 'Learner',
                email: data.email || currentUser.email || '',
                photoURL: data.photoURL || currentUser.photoURL || null,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                isAdmin,
              })
            }
          })

          setIsLoading(false)
          return () => unsubscribeProfile()
        }
      } else {
        setProfile(null)
        setIsAdmin(false)
      }
      setIsLoading(false)
    })

    return () => unsubscribeAuth()
  }, [verifyAdmin, isAdmin])

  const value: AuthContextType = {
    user,
    profile,
    isAdmin,
    isLoading,
    isConfigured: isFirebaseConfigured,
    login: loginWithEmail,
    register: registerWithEmail,
    loginWithGoogle,
    logout: logoutUser,
    sendReset: resetPassword,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
