import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'

/**
 * Initializes or updates user profile document in Firestore safely.
 * Only writes user-level profile fields; never touches admin claims.
 */
export async function syncUserProfile(user: User): Promise<void> {
  if (!db) return
  const userRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userRef)

  const payload: any = {
    displayName: user.displayName || user.email?.split('@')[0] || 'Learner',
    email: user.email || '',
    photoURL: user.photoURL || null,
    updatedAt: serverTimestamp(),
  }

  if (!userSnap.exists()) {
    payload.createdAt = serverTimestamp()
  }

  await setDoc(userRef, payload, { merge: true })
}

export async function loginWithEmail(email: string, password: string) {
  if (!auth) throw new Error('Firebase Auth is not initialized')
  const userCred = await signInWithEmailAndPassword(auth, email.trim(), password)
  try {
    await syncUserProfile(userCred.user)
  } catch (syncErr) {
    console.warn('Profile sync warning:', syncErr)
  }
  return userCred.user
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  if (!auth) throw new Error('Firebase Auth is not initialized')
  const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password)
  if (displayName) {
    try {
      await updateProfile(userCred.user, { displayName: displayName.trim() })
    } catch (e) {
      console.warn('Could not set displayName on Auth user:', e)
    }
  }
  try {
    await syncUserProfile(userCred.user)
  } catch (syncErr) {
    console.warn('Profile sync warning:', syncErr)
  }
  return userCred.user
}

export async function loginWithGoogle() {
  if (!auth) throw new Error('Firebase Auth is not initialized')
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  const userCred = await signInWithPopup(auth, provider)
  try {
    await syncUserProfile(userCred.user)
  } catch (syncErr) {
    console.warn('Profile sync warning:', syncErr)
  }
  return userCred.user
}

export async function resetPassword(email: string) {
  if (!auth) throw new Error('Firebase Auth is not initialized')
  await sendPasswordResetEmail(auth, email.trim())
}

export async function logoutUser() {
  if (!auth) return
  await signOut(auth)
}

export async function updateDisplayName(name: string) {
  if (!auth?.currentUser) throw new Error('No user is currently signed in')
  await updateProfile(auth.currentUser, { displayName: name.trim() })
  await syncUserProfile(auth.currentUser)
}

/**
 * Checks whether user has the 'admin' custom claim.
 */
export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user) return false
  // Bootstrap demo admin email
  if (user.email && user.email.toLowerCase() === 'admin@coursehub.dev') {
    return true
  }
  try {
    const tokenResult = await user.getIdTokenResult(true)
    return Boolean(tokenResult.claims?.admin === true)
  } catch (err) {
    console.error('Error verifying admin claim:', err)
    return false
  }
}
