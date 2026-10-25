import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layouts
import { PublicLayout } from '@/components/layout/PublicLayout'
import { LearnerLayout } from '@/components/layout/LearnerLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'

// Route Guards
import { RequireAuth } from '@/app/route-guards/RequireAuth'
import { RequireAdmin } from '@/app/route-guards/RequireAdmin'
import { PublicOnly } from '@/app/route-guards/PublicOnly'

// Public Pages
import { HomePage } from '@/features/courses/HomePage'
import { CourseCatalogPage } from '@/features/courses/CourseCatalogPage'
import { CourseDetailsPage } from '@/features/courses/CourseDetailsPage'
import { NotFoundPage } from '@/features/courses/NotFoundPage'

// Auth Pages
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'

// Learner Pages
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { MyCoursesPage } from '@/features/dashboard/MyCoursesPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { SettingsPage } from '@/features/profile/SettingsPage'

// Learning Player
import { CoursePlayerPage } from '@/features/learning/CoursePlayerPage'

// Admin Pages
import { AdminOverviewPage } from '@/features/admin/AdminOverviewPage'
import { AdminCoursesPage } from '@/features/admin/AdminCoursesPage'
import { CourseEditorPage } from '@/features/admin/CourseEditorPage'
import { LessonManagerPage } from '@/features/admin/LessonManagerPage'
import { LessonEditorPage } from '@/features/admin/LessonEditorPage'

export const router = createBrowserRouter([
  // Public Section
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/courses', element: <CourseCatalogPage /> },
      { path: '/courses/:slug', element: <CourseDetailsPage /> },

      // Auth (PublicOnly)
      {
        element: <PublicOnly />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
        ],
      },

      { path: '/404', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Dedicated Learning Player (Standalone layout for focused study)
  {
    path: '/learn/:courseSlug/:lessonId',
    element: <CoursePlayerPage />,
  },

  // Learner Section (RequireAuth)
  {
    element: <RequireAuth />,
    children: [
      {
        element: <LearnerLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/dashboard/courses', element: <MyCoursesPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },

  // Admin Section (RequireAdmin)
  {
    element: <RequireAdmin />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminOverviewPage /> },
          { path: 'courses', element: <AdminCoursesPage /> },
          { path: 'courses/new', element: <CourseEditorPage /> },
          { path: 'courses/:courseId/edit', element: <CourseEditorPage /> },
          { path: 'courses/:courseId/lessons', element: <LessonManagerPage /> },
          { path: 'courses/:courseId/lessons/new', element: <LessonEditorPage /> },
          { path: 'courses/:courseId/lessons/:lessonId/edit', element: <LessonEditorPage /> },
        ],
      },
    ],
  },
])
