# Product Requirements Document (PRD)
# CourseHub — Full-Stack Course Learning Platform

**Document status:** Build-ready specification; free-tier-conscious; no Firebase Cloud Storage uploads  
**Version:** 1.1 (cost-aware media and deployment revision)  
**Product type:** Responsive web application / learning platform MVP  
**Prepared for:** Google Antigravity (AI development agent)  
**Project direction:** Google Antigravity implementation, React + Firebase Authentication + Cloud Firestore + Firebase Hosting; no Firebase Cloud Storage  
**Primary objective:** Deliver a polished, working full-stack course platform suitable for a public demo and a technical YouTube tutorial.

---

## 0. Instructions to the AI Development Agent

Act as a **senior full-stack developer and UI/UX designer with 4+ years of professional experience**. Think through the product before coding. Prioritize maintainable architecture, accessible user experience, security, responsiveness, and working behavior over flashy but incomplete UI.

Build **CourseHub**, a multi-route course-learning web application according to this document. This must be a real application with separate routes, reusable components, Firebase-backed persistence, authentication, authorization, and clear loading/error/empty states. **Do not build the entire product as one long page or as a single route with conditional sections.**

### Non-negotiable engineering rules
1. Inspect the existing repository before changing files. Preserve working code and existing conventions where sensible.
2. Plan the route map, component structure, data model, and authentication flow before implementation.
3. Implement in small, verifiable milestones. Run the type checker, linter, tests and production build when available; fix errors before moving on.
4. Do not fake working functionality. A button must have a real outcome or be clearly marked disabled with an explanation.
5. Do not use hardcoded sample data as if it came from Firebase. Demo/seed data must be explicitly identified and provided through a controlled seed process.
6. Never place a Firebase Admin SDK service-account key, private API key, or other server secret in client-side code or in a `VITE_*` variable.
7. Enforce authorization in Firebase Security Rules, not only by hiding UI elements.
8. Keep components focused and reusable. Avoid giant page components, duplicate forms, duplicated Firebase calls, and overly complex abstractions.
9. Use semantic HTML, accessible labels, keyboard navigation, visible focus states, sufficient color contrast, and responsive layouts.
10. Do not silently change the product scope or replace the course-platform concept with another project. If a requirement cannot be implemented as written, explain the blocker and offer the smallest safe alternative.
11. Do not leave TODOs, placeholder links, fake charts, nonfunctional forms, or empty route pages in the completed MVP unless they are explicitly labelled as future scope.
12. Provide setup instructions, an `.env.example`, Firestore rules, any required indexes, and a concise completion report.
13. **Do not use Firebase Cloud Storage or implement file-upload widgets in this MVP.** As of February 3, 2026, Cloud Storage for Firebase requires the Blaze billing plan. The MVP must not require a billing account. Use bundled local SVG course artwork and an admin-entered public HTTPS image URL with a working preview/fallback flow instead. Do not initialize or import the Firebase Storage SDK.
14. **Use Firebase Hosting (static Hosting product), not Firebase App Hosting,** for the Vite/React single-page app. Configure SPA rewrites so every React Router URL works after refresh. Keep the MVP on the Firebase Spark no-cost plan unless the project owner explicitly approves a billing change.

### Definition of a successful build
A user can browse public courses without signing in, create an account or sign in, enroll in a published course, open its lessons, mark lessons complete, resume learning, and see their progress after refreshing or signing in again. An authorized administrator can create/edit courses and lessons, and publish/unpublish courses. A normal user cannot access admin routes or another user's private data.

---

## 1. Product Overview

### 1.1 Product name
**CourseHub** (working name; keep the name and visual identity centralized so it can be changed easily later).

### 1.2 Product summary
CourseHub is a modern online learning platform for discovering practical courses and learning through structured video lessons. It includes a public course catalog, course detail pages, secure sign-in, a student dashboard, a lesson player with progress tracking, and a protected admin area for managing course content.

The first release is a small, high-quality MVP for a demo/tutorial. It must feel like a coherent product rather than a static landing-page mockup. Users should be able to move naturally from discovering a course to enrolling, learning, and resuming progress.

### 1.3 Problem statement
Learners need a simple place to discover relevant courses, understand course outcomes before enrolling, study lessons in order, and track progress. A platform owner needs a straightforward way to manage course and lesson content without editing application code.

### 1.4 Product vision
Create a clean, trustworthy learning experience that demonstrates both high-quality UI/UX and real full-stack development: route-based frontend architecture, Firebase Authentication, Firestore persistence, role-protected administration, and secure user-owned learning progress.

### 1.5 Target audiences
- **Learner / student:** Wants to browse courses, understand what they will learn, enroll, watch lessons and resume progress.
- **Course administrator:** Wants to create, edit, organize and publish course content without touching the database manually.
- **First-time visitor:** Wants to understand the platform quickly and inspect available courses before creating an account.

### 1.6 Product principles
- Course discovery should be possible without registration.
- The UI must prioritize legibility and clarity over decoration.
- Public browsing, learning, and administration must be separate route areas.
- Private data must be private by default.
- Every route needs defined loading, error, empty, and unauthorized behavior where applicable.
- The app must be useful on mobile, tablet, and desktop.
- No payment or complex LMS features in version 1.
- Keep the MVP deployable on Firebase Spark without linking a billing account; do not use services that require Blaze for this scope.
- No user-uploaded image/video files: course artwork is bundled in the app or referenced by a public HTTPS image URL.

---

## 2. Goals, Success Criteria, and Non-Goals

### 2.1 MVP goals
1. Deliver a complete responsive web application with a route-based information architecture.
2. Provide a polished public landing page and searchable/filterable course catalog.
3. Implement email/password and Google authentication using Firebase Authentication.
4. Support enrollment in published courses for signed-in users.
5. Provide a lesson learning interface with lesson navigation and persistent progress tracking.
6. Provide an authenticated student dashboard.
7. Provide a protected admin area for course and lesson CRUD and course publishing.
8. Enforce role and ownership rules through Firestore Security Rules.
9. Make the project understandable and maintainable for a developer tutorial.

### 2.2 Success criteria
The MVP is considered successful when:
- All routes listed in Section 5 resolve directly and on refresh (no broken deep links).
- Public visitors can browse and open course details without signing in.
- Sign-up, sign-in, sign-out, and password reset work with configured Firebase credentials.
- A signed-in user can enroll in a published course only once; repeat clicks do not create duplicate enrollments.
- A learner can open a lesson, mark it complete/incomplete, refresh, and see the same progress.
- The dashboard displays actual enrollment/progress data from Firestore, not hardcoded values.
- Admins can create a draft course, add lessons, edit a course, publish/unpublish it, and see changes in the public catalog.
- Non-admin users cannot read or write admin-only content or modify another user’s enrollment/progress.
- The application passes type checking and a production build with no known blocking errors.
- Core screens are usable at 360 px mobile width, tablet width, and desktop width.

### 2.3 Non-goals for version 1
Do **not** implement these in the MVP unless specifically requested later:
- Payments, subscriptions, checkout, invoices, or paid-course access.
- Live classes, real-time chat, community forums or direct messaging.
- Certificate generation, graded exams, quizzes, badges, leaderboards or gamification.
- Course reviews/ratings or social profiles.
- Uploading video files or building video transcoding/streaming infrastructure.
- Uploading/storing images in Firebase Cloud Storage or another paid/user-configured object-storage service.
- Requiring Firebase Blaze billing, Firebase App Hosting, Cloud Functions, paid APIs, or phone/SMS authentication for the MVP.
- Bank/payment information, sensitive personal details, or identity verification.
- Multi-instructor revenue sharing or complex organization/team accounts.
- AI-generated lessons within the product.
- Native mobile apps.

---

## 3. MVP Scope and Priorities

### P0 — Must have
- Shared application shell, navigation, footer and responsive layout.
- Public landing page and course catalog.
- Course detail page.
- Sign-up, sign-in, Google sign-in, sign-out and password reset.
- Auth state handling and protected routes.
- Firestore data persistence.
- Enrollment and student dashboard.
- Lesson player, lesson navigation, completion tracking and resume learning.
- Admin course and lesson CRUD.
- Course publish/unpublish workflow.
- Firebase security rules and setup documentation.
- Course thumbnail selection from bundled SVG artwork or a public HTTPS image URL, including preview, validation and fallback.
- Spark-compatible Firebase configuration and Firebase Hosting deployment documentation.
- Loading, error, empty and success states.

### P1 — Should have if time permits without compromising P0
- Search, category filters, level filters and sorting on the course catalog.
- Featured courses and recently added courses sections.
- User profile basics.
- Lesson preview for selected lessons before enrollment.
- Toast feedback and confirmation dialogs.

### P2 — Future enhancements
- Quizzes, certificates, favorites/bookmarks, reviews, course ratings, full-text search service, analytics dashboard, progress email notifications, and payments.

---

## 4. User Roles and Permissions

### 4.1 Guest
Can:
- View landing page.
- Browse published courses.
- Search and filter the catalog.
- View course details and curriculum.
- Watch lessons explicitly marked as free preview, if configured.
- Open sign-up/sign-in/password-reset pages.

Cannot:
- Enroll without signing in.
- Access student dashboard or protected lessons.
- View unpublished courses.
- Access any admin route or private user data.

### 4.2 Authenticated learner
Can:
- Do everything a guest can do.
- Enroll in published courses.
- View their own dashboard and enrolled courses.
- Access lessons in courses in which they are enrolled, plus permitted preview lessons.
- Mark their own lesson progress complete/incomplete.
- Resume from their last opened lesson.
- Update basic profile details supported by Firebase.
- Sign out.

Cannot:
- Create, edit, publish, or delete course content.
- Access other users’ enrollments or progress.
- Set their own role to admin.
- Access unpublished courses unless they have admin privileges.

### 4.3 Administrator
Can:
- Access `/admin` and nested admin routes.
- Create, edit, publish/unpublish, and archive/delete courses according to confirmation rules.
- Add, edit, reorder, and delete lessons.
- View an admin course list with status and last-updated information.
- View a course preview before publishing.

Admin role must be granted through trusted Firebase Admin SDK / custom claims setup. **Do not let users become admins by writing `role: "admin"` to their own profile from the client.** UI route protection and Firestore Rules must both validate admin authorization.

---

## 5. Information Architecture and Route Map

This is a **multi-route application**. Use the framework’s route system; do not simulate routes with one giant component, hash-only anchors, or a conditional rendering switch inside a single page.

### 5.1 Public routes
| Route | Page | Purpose | Access |
|---|---|---|---|
| `/` | Home / Landing | Explain the platform and direct visitors to courses | Public |
| `/courses` | Course Catalog | List published courses with search, category and level filters | Public |
| `/courses/[slug]` | Course Details | Course description, outcomes, instructor, curriculum, and enroll CTA | Public |
| `/login` | Sign In | Email/password and Google sign-in | Public; redirect authenticated users appropriately |
| `/register` | Create Account | Create account with name, email and password; Google option | Public |
| `/forgot-password` | Password Reset | Request Firebase password-reset email | Public |
| `/not-found` or framework 404 | Not Found | Clear recovery links for unknown routes | Public |

### 5.2 Learner routes
| Route | Page | Purpose | Access |
|---|---|---|---|
| `/dashboard` | Student Dashboard | Progress summary, continue learning and enrolled courses | Authenticated learner |
| `/dashboard/courses` | My Courses | All enrolled courses with progress and continue action | Authenticated learner |
| `/learn/[courseSlug]/[lessonId]` | Course Player | Play lesson, view course curriculum, track progress | Enrolled learner, or authorized preview |
| `/profile` | Profile | Basic account details | Authenticated learner |
| `/settings` | Account Settings | Sign-out and account preferences supported by MVP | Authenticated learner |

### 5.3 Admin routes
| Route | Page | Purpose | Access |
|---|---|---|---|
| `/admin` | Admin Overview | Summary counts and shortcuts to manage content | Admin only |
| `/admin/courses` | Manage Courses | List, search, filter and manage courses | Admin only |
| `/admin/courses/new` | Create Course | Create a course draft | Admin only |
| `/admin/courses/[courseId]/edit` | Edit Course | Update course metadata and status | Admin only |
| `/admin/courses/[courseId]/lessons` | Manage Lessons | Add, edit, reorder and remove course lessons | Admin only |
| `/admin/courses/[courseId]/lessons/new` | Add Lesson | Create a lesson | Admin only |
| `/admin/courses/[courseId]/lessons/[lessonId]/edit` | Edit Lesson | Update a lesson | Admin only |

### 5.4 Route behavior
- Direct navigation and browser refresh must work for every route.
- Nested routes should preserve the appropriate public, learner, or admin layout.
- If a guest opens a protected learner route, redirect to `/login` with a safe `returnTo` destination; after successful login, return them to that destination.
- If a non-admin opens an admin route, show a clear **Access denied** page or redirect to `/dashboard`; never reveal admin data while checking role.
- If a user opens a protected lesson without enrollment, show a course preview/enroll state or redirect to its course details page.
- If course slug or lesson ID is invalid, show a proper not-found state, not a blank screen.
- If the Firebase request fails, show a retry action and useful error message; do not silently substitute fake data.
- Preserve query parameters such as catalog search/filter state when navigating to and from course details where practical.

### 5.5 Navigation structure
**Public header:** Logo / CourseHub, Courses, About (optional anchor/section on home only), Sign In, Get Started. When signed in, replace auth CTAs with Dashboard and profile menu.

**Learner navigation:** Dashboard, My Courses, Profile, Settings, Sign Out. Use a responsive sidebar on desktop and compact/mobile navigation on small screens.

**Admin navigation:** Overview, Courses, and Sign Out. Clearly display an Admin label so the active mode is unmistakable.

**Learning layout:** Back to course, course title, lesson content/player, curriculum sidebar with lesson completion states, Previous/Next lesson controls, Mark Complete button, and progress indicator.

---

## 6. Primary User Journeys

### Journey A: Visitor discovers and enrolls in a course
1. Visitor opens `/`.
2. Visitor chooses “Explore Courses” and goes to `/courses`.
3. Visitor searches or filters the catalog.
4. Visitor opens `/courses/[slug]`.
5. Visitor checks outcomes, level, duration and curriculum.
6. Visitor selects “Enroll for Free”.
7. If not authenticated, app sends them to `/login?returnTo=...` or `/register?returnTo=...`.
8. After authentication, the enrollment is created safely and the user is sent to the course player or dashboard.
9. A success message confirms enrollment; repeated clicks must not create duplicates.

### Journey B: Returning learner resumes learning
1. Learner signs in.
2. Learner opens `/dashboard`.
3. “Continue Learning” shows the most recently accessed enrolled course and last lesson.
4. Learner opens the lesson route.
5. Learner watches the embedded lesson and marks it complete.
6. Lesson progress is persisted to Firestore.
7. After refresh/sign-out/sign-in, progress remains accurate.
8. Completing the last lesson shows a course-completed state and a route back to the course or dashboard.

### Journey C: Admin creates and publishes a course
1. Admin signs in with a trusted admin account.
2. Admin opens `/admin/courses/new`.
3. Admin enters required course details and saves a draft.
4. Admin opens Manage Lessons and adds at least one lesson with title, description, duration, and a supported video URL.
5. Admin reorders lessons if needed and previews the course.
6. Admin publishes the course only when required information and at least one lesson are valid.
7. Published course appears in `/courses` and its details page.
8. Unpublishing removes it from public discovery and blocks non-admin access to protected lessons, while preserving existing progress records.

### Journey D: Guest hits a protected route
1. Guest opens `/dashboard` or a non-preview lesson route directly.
2. App waits for Firebase auth initialization rather than flashing the protected page.
3. Guest is redirected to sign-in with a safe return destination.
4. Guest signs in and returns to the intended route if still authorized.

---

## 7. Functional Requirements

### 7.1 Home page
**FR-HOME-01:** Display a clear hero statement describing practical courses and learning outcomes. Avoid generic filler text.  
**FR-HOME-02:** Primary CTA routes to `/courses`; secondary CTA can link to a featured course.  
**FR-HOME-03:** Show a curated featured-course section driven by published Firestore course documents.  
**FR-HOME-04:** Show a short “How it works” section (Discover → Enroll → Learn → Track progress).  
**FR-HOME-05:** Include a footer with links to Courses, Sign In, Create Account, and a simple About section/page if implemented.  
**FR-HOME-06:** If there are no published courses, show a designed empty state and do not break the page.

### 7.2 Course catalog
**FR-CATALOG-01:** Load only published courses for non-admin users.  
**FR-CATALOG-02:** Display course title, thumbnail, short description, category, level, duration and lesson count.  
**FR-CATALOG-03:** Provide keyword search across loaded course title, summary and tags. For this MVP, client-side filtering of the loaded catalog is acceptable; do not claim full-text search.  
**FR-CATALOG-04:** Provide category and level filters, plus a “Clear filters” action.  
**FR-CATALOG-05:** Provide sort options: Featured, Newest, and Title A–Z. Ensure sorting actually updates the list.  
**FR-CATALOG-06:** Show filter chips/count where useful and an explicit no-results state.  
**FR-CATALOG-07:** Each course card navigates to `/courses/[slug]` and is keyboard accessible.

### 7.3 Course details
**FR-DETAIL-01:** Display title, subtitle, hero thumbnail, full description, learning outcomes, level, estimated duration, category, instructor information, and curriculum.  
**FR-DETAIL-02:** Display “Enroll for Free” to non-enrolled users; “Continue Learning” to enrolled users; “Edit Course” for admins where appropriate.  
**FR-DETAIL-03:** Clearly indicate whether a lesson is a free preview.  
**FR-DETAIL-04:** Hide unpublished course details from guests and non-admins. For invalid or unauthorized access, do not reveal unpublished content.  
**FR-DETAIL-05:** Enrollment must be idempotent: one enrollment document per user/course.

### 7.4 Authentication
**FR-AUTH-01:** Support email/password registration with display name, email and password.  
**FR-AUTH-02:** Support email/password sign-in.  
**FR-AUTH-03:** Support Google sign-in via Firebase Authentication.  
**FR-AUTH-04:** Support password reset via Firebase email flow.  
**FR-AUTH-05:** Validate inputs, show field-level messages and display friendly Firebase errors without exposing sensitive internals.  
**FR-AUTH-06:** Show loading state while authentication is processing and prevent duplicate submissions.  
**FR-AUTH-07:** On first sign-in, create/update the user's own profile document without allowing the user to set privileged fields.  
**FR-AUTH-08:** Sign-out clears client auth state and navigates to `/` or `/login`.  
**FR-AUTH-09:** Do not flash private dashboard or admin content before auth and role checks finish.  
**FR-AUTH-10:** Sanitize `returnTo` values; allow only safe same-origin relative paths to avoid open redirects.

### 7.5 Learner dashboard
**FR-DASH-01:** Show a personal greeting based on the signed-in user's display name.  
**FR-DASH-02:** Show the learner's enrolled courses from Firestore, not a shared hardcoded list.  
**FR-DASH-03:** Show progress per course, derived from completion data and total published/active lessons.  
**FR-DASH-04:** Include a “Continue Learning” action that opens the last accessed or first incomplete lesson.  
**FR-DASH-05:** Show a helpful empty state with an “Explore Courses” CTA when the user has no enrollments.  
**FR-DASH-06:** If a course has been unpublished, show a clear availability message and do not allow a learner to bypass publication/access rules.

### 7.6 Course player and lesson progress
**FR-LEARN-01:** Use the route `/learn/[courseSlug]/[lessonId]` for individual lessons.  
**FR-LEARN-02:** Display current lesson title, description, video, duration, lesson navigation and course curriculum.  
**FR-LEARN-03:** Embed supported video URLs responsively. At minimum support YouTube video URLs using a safe embed URL parser; do not accept arbitrary iframe HTML.  
**FR-LEARN-04:** Validate video URLs in the admin form and only render supported providers (YouTube is sufficient for MVP).  
**FR-LEARN-05:** Provide Previous Lesson, Next Lesson and Mark Complete / Mark Incomplete actions.  
**FR-LEARN-06:** Persist each lesson's completion state under the signed-in user's own enrollment.  
**FR-LEARN-07:** Persist the user's last-opened lesson and last activity time.  
**FR-LEARN-08:** Calculate course progress from lesson completion records; do not trust a client-supplied percentage as the source of truth.  
**FR-LEARN-09:** If a course has no lessons, show an admin-facing setup warning in preview mode and a clear learner state; never crash.  
**FR-LEARN-10:** For a non-enrolled learner, allow only lessons whose `isPreview` is true; otherwise show enrollment CTA.  
**FR-LEARN-11:** Keep the curriculum usable on smaller screens; use a drawer/collapsible panel on mobile.  
**FR-LEARN-12:** Display completed, current and locked lesson states distinctly, not only by color.

### 7.7 Profile and settings
**FR-PROFILE-01:** Display the signed-in user's display name, email and available profile image.  
**FR-PROFILE-02:** Allow updating display name where supported; validate and save safely.  
**FR-PROFILE-03:** Account settings must include sign-out.  
**FR-PROFILE-04:** Do not collect unnecessary sensitive personal information.

### 7.8 Admin overview and course management
**FR-ADMIN-01:** Admin routes require a verified admin claim.  
**FR-ADMIN-02:** Admin overview shows useful counts such as total courses, published courses and draft courses based on Firestore data.  
**FR-ADMIN-03:** Admin course list supports search and status filter.  
**FR-ADMIN-04:** Admin can create, edit and delete/archive courses. Show a confirmation dialog for destructive actions.  
**FR-ADMIN-05:** Admin can save drafts without publishing.  
**FR-ADMIN-06:** Admin can publish only when required fields and at least one valid lesson are present.  
**FR-ADMIN-07:** Admin can unpublish a course; it must immediately disappear from public catalog queries.  
**FR-ADMIN-08:** Admin can create, edit, delete and reorder lessons.  
**FR-ADMIN-09:** Lesson order must be persisted with a numeric `order` field, and the player must follow that order.  
**FR-ADMIN-10:** Admin forms show validation errors next to the relevant fields.  
**FR-ADMIN-11:** Course preview must clearly indicate draft/preview mode so admins do not confuse unpublished content with a public course.  
**FR-ADMIN-12:** Do not expose user private data in admin views unless explicitly needed; MVP admin management concerns content only.
**FR-ADMIN-13:** Course thumbnail selection must not upload a file. Provide two modes: choose from bundled local course artwork (recommended default) or enter a public HTTPS image URL.
**FR-ADMIN-14:** When an administrator enters an image URL, show a live preview, loading/error state, and a local placeholder fallback. Validate the URL protocol and confirm the browser can load the image before allowing a course to be published with that URL.
**FR-ADMIN-15:** Store only the selected local asset path or external image URL string in Firestore; never store image bytes/base64 blobs.
**FR-ADMIN-16:** Do not show an image upload/dropzone control anywhere in the product. Do not integrate Firebase Storage or any image-hosting SDK.

### 7.9 General system states
**FR-STATE-01:** Use skeletons or clear loading indicators for route-level data loads.  
**FR-STATE-02:** Provide useful error states with retry actions where retry is meaningful.  
**FR-STATE-03:** Provide empty states for catalog, search results, dashboard, enrollments and admin lists.  
**FR-STATE-04:** Use toasts or inline status messages for successful create/update/delete/enroll/progress actions.  
**FR-STATE-05:** Prevent double submit and duplicate requests when possible.  
**FR-STATE-06:** Use confirmation dialogs for irreversible or destructive actions.  
**FR-STATE-07:** Avoid blank screens on route or data errors; use a global error boundary and route-level not-found page.

---

## 8. UI/UX and Visual Design Requirements

### 8.1 Experience direction
Create a **modern, calm, premium learning platform**. The interface should look credible and product-led, not like a generic AI-generated dashboard template. Use generous spacing, consistent typography, strong hierarchy, thoughtful empty states and real course artwork.

### 8.2 Visual identity
- **Product name:** CourseHub.
- **Visual tone:** Clear, helpful, contemporary, confident, learner-first.
- **Color system:** Neutral surfaces with one main indigo/violet accent and a restrained teal/green success color. Define colors as design tokens/CSS variables; do not sprinkle unrelated hex values across components.
- **Typography:** Use a highly legible modern sans-serif (for example, Inter or Geist if available). Define a consistent type scale.
- **Surfaces:** Clean cards, subtle borders, restrained shadows and consistent corner radii.
- **Iconography:** Use one icon library consistently; do not mix emoji and mismatched icon styles in navigation.
- **Motion:** Small purposeful transitions only. Respect reduced-motion settings. Never make basic navigation depend on animation.

### 8.3 Layout and spacing
- Establish a consistent spacing scale (for example multiples of 4 or 8 px).
- Use a centered content container with a sensible max-width on desktop.
- Avoid excessively wide line lengths for readable course descriptions.
- Course cards should have consistent thumbnail ratios and aligned text/metadata.
- Use a responsive grid: approximately 1 column on small mobile, 2 on tablet, and 3 on wide desktop where space permits.
- Ensure the mobile layout does not overflow horizontally.

### 8.4 Required visual components
- Public header and footer.
- Primary, secondary, text and destructive buttons.
- Course card and course metadata row.
- Search input, filter dropdowns/chips and sort control.
- Form fields with labels, hints, disabled states and error messages.
- Avatar/profile menu.
- Dashboard stat cards and course-progress rows/cards.
- Lesson player container, curriculum list and completion states.
- Admin sidebar, table/list view, status badges and form sections.
- Toast/status feedback, confirmation modal, skeletons, empty states and error panels.

### 8.5 Accessibility requirements
- Use semantic landmarks (`header`, `nav`, `main`, `footer`) and correct heading hierarchy.
- Every form input has a persistent visible label or a properly associated accessible label.
- Every interactive control is keyboard accessible and displays a visible focus indicator.
- Do not use color as the only indicator of error, completion, selection or status.
- Provide alt text for meaningful course imagery and empty alt text for decorative imagery.
- Ensure text/background contrast meets WCAG 2.1 AA where practical.
- Dialogs must manage focus, support Escape where appropriate, and return focus to the triggering control.
- Provide reduced motion support and avoid flashing effects.
- Video iframe titles must be descriptive.

### 8.6 Page-specific UX
**Home:** One strong headline, one clear primary CTA, a real preview of available courses, concise benefits, no excessive marketing sections.  
**Catalog:** Search and filters are easy to scan; selected filters are visible and easy to clear; cards are consistent; no-results state offers reset.  
**Course details:** Put the core value proposition and enrollment CTA above the fold; show curriculum and outcomes before requiring sign-in.  
**Authentication:** Minimal distraction, obvious errors, password visibility control if implemented, accessible alternative to Google sign-in.  
**Dashboard:** Prioritize “Continue Learning”; show enrollment progress without overwhelming stats.  
**Player:** Content area is dominant; curriculum is accessible but not intrusive; lesson progress is obvious; mobile curriculum collapses.  
**Admin:** Focus on clarity and efficient content entry. Use explicit labels for Draft/Published and clear destructive confirmations.

### 8.7 Course image and lesson media policy (required)
The MVP must not upload files to Firebase Storage. Implement this exact thumbnail workflow in the admin course form:
1. **Choose built-in artwork:** show a small selectable gallery of original SVG illustrations bundled in `public/images/courses/`. Include topic-neutral variants for web development, React, Firebase, AI projects, and general learning. These assets deploy with the frontend and are not uploaded to a storage service.
2. **Use an image URL:** an administrator can paste a direct, publicly accessible HTTPS image URL from a host they are permitted to use (for example, their own public CDN or a provider that permits direct embedding). Do not accept an image search page, Google Drive share page, authentication-required URL, `data:` URL, or `javascript:` URL.
3. Show a live preview and accessible status text. Validate HTTPS syntax and test whether the image loads in the browser. If loading fails, offer the built-in artwork picker and do not allow publishing with a broken thumbnail URL. Drafts may be saved with a built-in fallback.
4. Persist only `thumbnailUrl` as a string in Firestore. For bundled assets, use a root-relative path such as `/images/courses/firebase-basics.svg`; for external images, store the full HTTPS URL. Do not download, proxy, or upload the image through Firebase.
5. Always set suitable `alt` text, lazy-load below-the-fold thumbnails, use a consistent aspect ratio, and display a bundled fallback when an external image later becomes unavailable. Admins are responsible for having rights to use externally hosted images.
6. Seed courses must use bundled original SVG artwork by default so the project works without depending on third-party image URLs.

**Lesson videos:** only accept a YouTube watch/share URL or valid YouTube video ID and generate the embed URL through the app's safe parser. Do not upload video files, accept raw iframe HTML, or use Firebase Storage. External lesson/resource links must use HTTPS and open safely.

---

## 9. Technical Architecture

### 9.1 Recommended stack
Use this stack unless the repository already has a sensible, working equivalent. If changing an existing stack, explain why before replacing it.

- **Frontend:** React + TypeScript + Vite.
- **Routing:** React Router with nested layouts and protected route guards.
- **Styling:** Tailwind CSS with shared design tokens; use an accessible component library such as shadcn/ui only if it integrates cleanly with the repository.
- **Backend services:** Firebase Authentication and Cloud Firestore.
- **Hosting:** Firebase Hosting (the static Hosting product) on the Spark plan. Do not use Firebase App Hosting for this static Vite/React SPA, and do not require billing for the documented default deployment.
- **Forms/validation:** Use a consistent typed validation approach (e.g., React Hook Form + Zod) if it meaningfully simplifies complex admin forms.
- **Charts:** Use a lightweight accessible chart library only for real data; do not add charts solely for decoration.
- **Testing:** Vitest and React Testing Library for critical UI/data logic; use browser E2E testing if the repository already supports it.

**Why this stack:** It provides real URL routes, component reuse, a manageable codebase for a learning project, and a straightforward Firebase deployment. Do not implement one route that swaps page content based on local state.

### 9.2 Application layers
1. **Route/page layer:** Route entry points and page-level composition only.
2. **Component layer:** Reusable layout, course cards, filters, progress indicators, forms and dialogs.
3. **Feature/service layer:** Auth, courses, enrollments, lesson progress and admin operations.
4. **Firebase layer:** Firebase initialization, Authentication, Firestore references and typed data converters/helpers.
5. **Shared utilities:** URL sanitization, date formatting, validation, errors and constants.

### 9.3 Suggested folder structure
Adapt names to existing repo conventions, but maintain equivalent separation.

```text
public/
  images/
    courses/
      web-development.svg
      react-basics.svg
      firebase-basics.svg
      ai-projects.svg
      general-learning.svg
src/
  app/
    App.tsx
    router.tsx
    providers/
      AuthProvider.tsx
      ToastProvider.tsx
    route-guards/
      RequireAuth.tsx
      RequireAdmin.tsx
      PublicOnly.tsx
  components/
    layout/
      PublicLayout.tsx
      LearnerLayout.tsx
      AdminLayout.tsx
      SiteHeader.tsx
      SiteFooter.tsx
      LearnerSidebar.tsx
      AdminSidebar.tsx
    ui/
      Button.tsx
      Input.tsx
      Select.tsx
      Dialog.tsx
      Toast.tsx
      Skeleton.tsx
      EmptyState.tsx
      ErrorState.tsx
    courses/
      CourseCard.tsx
      CourseGrid.tsx
      CourseFilters.tsx
      CourseMetadata.tsx
      CurriculumList.tsx
    learning/
      LessonPlayer.tsx
      LessonNavigation.tsx
      LessonProgress.tsx
      VideoEmbed.tsx
  features/
    auth/
      auth.service.ts
      auth.schemas.ts
      LoginPage.tsx
      RegisterPage.tsx
      ForgotPasswordPage.tsx
    courses/
      course.service.ts
      course.types.ts
      course.schemas.ts
      HomePage.tsx
      CourseCatalogPage.tsx
      CourseDetailsPage.tsx
    dashboard/
      dashboard.service.ts
      DashboardPage.tsx
      MyCoursesPage.tsx
    learning/
      learning.service.ts
      CoursePlayerPage.tsx
    profile/
      ProfilePage.tsx
      SettingsPage.tsx
    admin/
      admin.service.ts
      AdminOverviewPage.tsx
      AdminCoursesPage.tsx
      CourseEditorPage.tsx
      LessonManagerPage.tsx
      LessonEditorPage.tsx
  lib/
    firebase/
      client.ts
      auth.ts
      firestore.ts
    errors/
      normalizeFirebaseError.ts
    utils/
      formatDate.ts
      formatDuration.ts
      sanitizeReturnTo.ts
      videoUrl.ts
  styles/
    globals.css
  types/
    domain.ts
  main.tsx
firestore.rules
firestore.indexes.json
.env.example
README.md
```

Do not create empty files for every suggested path just to match the tree. Create the files actually required by the implementation, and keep imports and naming consistent.

### 9.4 Firebase product selection and cost guardrails
Use only these Firebase products for the MVP:
- **Firebase Authentication:** Email/password and Google sign-in. Do not add phone/SMS authentication.
- **Cloud Firestore:** Persist courses, lessons, user profiles, enrollments, and lesson progress. Design queries to avoid unnecessary reads. Current Spark free quota includes one free database with 1 GiB stored data, 50,000 document reads/day, 20,000 writes/day, 20,000 deletes/day, and 10 GiB outbound transfer/month; quotas and terms may change, so confirm the current official pricing before deployment.
- **Firebase Hosting (static Hosting):** Host the built `dist/` frontend. Current Spark quota lists 10 GB hosting storage and 360 MB/day data transfer, with custom domain and SSL support. Keep optimized assets small. Exceeding Spark no-cost limits can make the affected product unavailable until the quota resets; do not imply unlimited free hosting.

**Explicitly prohibited in this MVP:** Firebase Cloud Storage, Firebase App Hosting, deployed Cloud Functions, Cloud Run, paid external APIs, phone/SMS verification, and any workflow that asks the project owner to attach a billing account. Firebase's current official documentation states Cloud Storage for Firebase requires the Blaze pay-as-you-go plan (the requirement took effect February 3, 2026); the existence of a no-cost usage allowance on Blaze does not remove the billing-account requirement.

**Important distinction:** Firebase Hosting's free static-site asset quota is not the same thing as Firebase Cloud Storage for end-user uploads. Do not confuse the two. Hosting stores the website build; CourseHub will not provide file uploads.

The admin custom-claim provisioning flow must be run manually from a trusted local environment using the Firebase Admin SDK, if needed. Do not deploy a Cloud Function just to bootstrap the first admin. Keep service-account credentials outside the repository and browser bundle.

### 9.5 Deployment configuration (Firebase Hosting)
For the recommended Vite + React Router SPA, configure Firebase Hosting to serve `dist/` and rewrite requests to `/index.html` so routes such as `/courses/react-basics` and `/admin/courses` work on direct navigation and refresh. A suitable `firebase.json` shape is:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "trailingSlash": false,
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

Document these deployment steps in `README.md`: install/use Firebase CLI; authenticate locally; select the existing Firebase project; run `npm run build`; verify `dist/`; deploy Hosting (and Firestore rules/indexes where configured). Do not choose Firebase App Hosting or any configuration that forces Blaze billing. Check current Firebase Hosting quotas before public launch.

### 9.6 Route configuration outline
Use route layouts to separate application areas. Example path definitions (not a required exact implementation):

```text
/
/courses
/courses/:slug
/login
/register
/forgot-password
/dashboard                      [RequireAuth]
/dashboard/courses              [RequireAuth]
/learn/:courseSlug/:lessonId    [RequireAuth or preview-aware guard]
/profile                        [RequireAuth]
/settings                       [RequireAuth]
/admin                          [RequireAdmin]
/admin/courses                  [RequireAdmin]
/admin/courses/new              [RequireAdmin]
/admin/courses/:courseId/edit   [RequireAdmin]
/admin/courses/:courseId/lessons [RequireAdmin]
/admin/courses/:courseId/lessons/new [RequireAdmin]
/admin/courses/:courseId/lessons/:lessonId/edit [RequireAdmin]
```

Use nested route layouts where helpful. Every protected route must wait for auth initialization and role verification before rendering private content. The route guard is a usability layer; Firestore Security Rules remain the actual data security boundary.

---

## 10. Firebase Data Model

Use a predictable schema with TypeScript types. Store timestamps as Firestore timestamps. Use server timestamps for creation/update fields where possible.

### 10.1 `courses/{courseId}`
```ts
{
  title: string,
  slug: string,                 // unique, URL-safe slug
  subtitle: string,
  description: string,
  thumbnailUrl: string,          // bundled `/images/courses/*.svg` path or validated public HTTPS image URL; no upload/storage
  category: string,
  level: "Beginner" | "Intermediate" | "Advanced",
  tags: string[],
  learningOutcomes: string[],
  instructor: {
    name: string,
    avatarUrl?: string,          // optional public HTTPS URL or bundled artwork; no upload/storage
    bio?: string
  },
  durationMinutes: number,      // course-level estimate
  featured: boolean,
  published: boolean,
  lessonCount?: number,         // derived/cached; keep in sync when lessons change
  createdBy: string,            // admin UID
  createdAt: Timestamp,
  updatedAt: Timestamp,
  publishedAt?: Timestamp | null
}
```

### 10.2 `courses/{courseId}/lessons/{lessonId}`
```ts
{
  title: string,
  description: string,
  order: number,                // zero- or one-based; choose one convention and apply consistently
  durationSeconds: number,
  videoProvider: "youtube",
  videoUrl: string,             // validated URL, not raw iframe HTML
  isPreview: boolean,
  resources: Array<{
    label: string,
    url: string
  }>,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 10.3 `users/{uid}`
```ts
{
  displayName: string,
  email: string,
  photoURL?: string | null,       // use Firebase Auth provider photoURL (e.g. Google); no profile-photo upload
  createdAt: Timestamp,
  updatedAt: Timestamp,
  // Do not use this client-writable document as the source of admin privilege.
  // Admin authorization must come from a trusted custom claim.
}
```

### 10.4 `users/{uid}/enrollments/{courseId}`
Use `courseId` as the enrollment document ID to guarantee one enrollment per user/course.
```ts
{
  courseId: string,
  courseSlug: string,
  enrolledAt: Timestamp,
  lastLessonId?: string | null,
  lastAccessedAt?: Timestamp,
  updatedAt: Timestamp
}
```

### 10.5 `users/{uid}/enrollments/{courseId}/lessonProgress/{lessonId}`
```ts
{
  lessonId: string,
  completed: boolean,
  completedAt?: Timestamp | null,
  lastPositionSeconds?: number,  // optional; save only if implemented safely
  updatedAt: Timestamp
}
```

### 10.6 Data model rules
- Course IDs should be generated document IDs; `slug` should be unique and validated before publishing.
- Store lessons as a subcollection so curriculum can grow without oversized course documents.
- Progress is scoped to a user and enrollment. A client must never query or mutate another user's path.
- Course progress percentage should be derived from completion records and the number of valid lessons. If a cached field is introduced for performance, document the source of truth and ensure it cannot be forged to unlock content.
- Avoid storing redundant personal information.
- For enrollment and course cards, fetch minimal required fields and avoid unbounded repeated document reads. Use caching/batching where reasonable, without compromising correctness.
- Admin-only seed script may create initial demo courses and lessons. Seed script must be documented, repeatable, and safe against accidental duplicate seed data.

---

## 11. Security and Authorization Requirements

Security is a launch blocker, not a polish item.

### 11.1 Firebase Authentication
- Use Firebase Authentication for Google and email/password sign-in.
- Handle account creation and profile document initialization safely.
- Never trust display name, email or role fields received from arbitrary client data without using Firebase Auth as the identity source.

### 11.2 Admin role
- Assign admin privileges through Firebase Admin SDK custom claims, executed in a trusted environment, or through a documented trusted server-side provisioning process.
- The browser must not be able to set its own admin claim.
- Route guards may read the ID token's custom claims for UI routing, but Firestore Rules must enforce admin access independently.
- Document how to provision the first admin in `README.md` without exposing service-account credentials.

### 11.3 Required Firestore rules behavior
Implement and test rules that follow these principles:
- Public unauthenticated users can read published course documents and the lessons needed to build the public course curriculum. Do not make unpublished course data publicly readable.
- Only admins can create, edit, publish, unpublish or delete courses and lessons.
- A signed-in owner may read/update only their own profile document, but may not write privileged fields.
- A signed-in learner may read/write only their own enrollments and lesson progress.
- Enrollment creation must require the authenticated user to own the path and should validate that the target course exists and is published, where feasible in rules.
- Non-admin learners may not create or alter course/lesson content.
- Unpublished course lessons must not become readable to non-admins merely because a learner knows the lesson ID. If public read rules on the `lessons` subcollection cannot check the parent publication state as implemented, explicitly perform parent lookup in rules or choose a rule structure that safely enforces it.
- Admins may access content management operations using the verified custom claim.
- Deny by default for unspecified collections and operations.

### 11.4 Additional protections
- Validate form inputs on client and security-sensitive writes in rules.
- Sanitize safe redirect paths.
- Validate video URLs and external resource URLs. Do not render admin-provided arbitrary HTML.
- Do not log passwords, tokens, private course data or full auth tokens.
- Firebase client config values are identifiers, not Admin SDK secrets; use `.env.example` for client config. Never commit service-account JSON files.
- Include tests or documented manual verification of user isolation and admin access control.

---

## 12. Seed/Demo Content Requirements

The initial project should be easy to demonstrate even before an administrator creates content. Provide a documented, optional seed process that creates **4–6 original demo courses** and several lessons for each. Use sample or openly embeddable lesson videos only; do not assume rights to copyrighted course material.

Suggested demo topics consistent with the intended tech audience:
1. Build Your First React UI
2. Firebase Authentication Fundamentals
3. Build a Small React + Firebase Project
4. Deploy a Web App
5. JavaScript Essentials for Beginners

Each demo course should have realistic metadata, a concise description, 3–5 learning outcomes, level, estimated duration, category, a bundled local SVG thumbnail, and 3–5 lesson records. Do not require remote image URLs for seed content. If an administrator later adds a remote thumbnail, use the URL-preview workflow described in Section 8.7 and fall back to the local artwork if it becomes unavailable.

Seeded content must be actual Firestore data once seeded, and the UI must not pretend that seed data was loaded from Firestore if Firebase isn't configured. Provide a clear configuration error/empty state when environment values are missing.

---

## 13. Error, Empty, and Loading States

At minimum design and implement the following:
- Global initialization/auth loading state.
- Course catalog loading skeleton.
- Course catalog empty state when no published courses exist.
- Search/filter no-results state with “Clear filters”.
- Course detail not-found state.
- Login/register invalid input, wrong password, email already in use, popup closed, popup blocked/network error states.
- Password reset success and failure messages.
- Enrollment in progress, success, already-enrolled and failure states.
- Dashboard empty state for users with no courses.
- Lesson video unavailable/invalid URL state with retry or contact-admin guidance.
- Lesson save/progress failure state that does not falsely indicate completion.
- Admin list empty state and server-error state.
- Course draft validation errors prior to publishing.
- Delete confirmation dialog and delete failure state.
- Access denied page for non-admin users attempting `/admin`.
- Global 404 page and route-level error boundary.

Never display a success toast until the relevant operation is confirmed by Firebase. Avoid raw error dumps to end users; log useful diagnostic details in development only.

---

## 14. Performance and Reliability

- Split route-level code where supported so admin/editor code is not loaded unnecessarily on public pages.
- Use appropriately sized and optimized images; lazy-load below-the-fold images.
- Prefer bundled SVG course illustrations for predictable, low-cost media. External image URLs must have a bundled fallback; do not proxy them through server functions or upload them to Firebase.
- Avoid excessive Firestore listeners. Use real-time subscriptions only where they improve user value; use one-time reads for content that does not need live updates.
- Unsubscribe from listeners when components unmount.
- Avoid duplicate requests caused by effects running repeatedly.
- Cache or share course data where reasonable and invalidate after admin changes.
- Use pagination or progressive loading if course catalog grows beyond a small demo set; do not load an unbounded collection forever.
- Handle offline/network failure clearly; never silently show stale or fake progress as current.
- Do not rely on client-only hiding for authorization.

---

## 15. SEO, Metadata, and Sharing

Since this MVP uses a client-rendered React app, implement the best practical route-level metadata supported by the chosen setup:
- Unique document title per route.
- Unique meta description for home, catalog and course detail pages.
- Open Graph title/description/image for public course pages where practical.
- Meaningful slug URLs and human-readable headings.
- Course metadata should be derived from the actual course document.
- Include a sitemap/robots setup only if supported by the project and hosting approach; document client-rendering SEO limitations rather than claiming full server-rendered SEO.
- Do not include private dashboard, player, profile or admin routes in public sitemaps.

If the repository already uses an SSR-capable framework, preserve and use its route-level metadata capabilities rather than migrating to Vite solely because this document lists a suggested stack.

---

## 16. Testing and Acceptance Checklist

### 16.1 Authentication tests
- [ ] Registration creates a Firebase Auth user and a safe profile document.
- [ ] Email/password login works.
- [ ] Google login works when configured.
- [ ] Password reset request produces a useful confirmation.
- [ ] Sign-out removes access to protected pages.
- [ ] A protected route does not flash before auth initialization completes.
- [ ] `returnTo` cannot redirect to an external or unsafe destination.

### 16.2 Public discovery tests
- [ ] Home page loads without authentication.
- [ ] Catalog shows published courses only.
- [ ] Search, filters, sort and clear-filter behavior work.
- [ ] Course card navigation uses the proper slug route.
- [ ] Course detail displays actual Firestore metadata/curriculum.
- [ ] Unknown slug displays not-found UI, not a crash.
- [ ] A non-admin cannot discover unpublished courses through direct URLs or client queries.

### 16.3 Enrollment and learning tests
- [ ] Guest can trigger sign-in/register from an enroll CTA.
- [ ] Authenticated learner can enroll in a published course.
- [ ] Duplicate enrollment attempts do not create duplicate records.
- [ ] Non-enrolled learner cannot access locked lessons by guessing a URL.
- [ ] Preview lessons are accessible only as configured.
- [ ] Lesson order and previous/next navigation work.
- [ ] Mark complete/incomplete persists across refresh.
- [ ] Progress percentage is correct for a course with multiple lessons.
- [ ] Continue Learning reopens last accessed/first incomplete lesson.
- [ ] A learner cannot read/update another user's enrollment or progress.

### 16.4 Admin tests
- [ ] Non-admin user is blocked from all admin routes.
- [ ] Firestore Rules block non-admin course/lesson writes even if the UI is bypassed.
- [ ] Admin can create/edit a draft course.
- [ ] Admin can add/edit/delete/reorder lessons.
- [ ] Invalid course cannot be published.
- [ ] Publishing places the course in public catalog.
- [ ] Unpublishing removes it from public catalog and protects its non-preview lesson content.
- [ ] Deletion requires confirmation and reports failures accurately.

### 16.5 UI/UX and build tests
- [ ] Mobile width ~360 px has no horizontal overflow.
- [ ] Tablet and desktop layouts are balanced and usable.
- [ ] All visible buttons/links work or are explicitly disabled.
- [ ] Form labels, keyboard focus and dialog interactions are accessible.
- [ ] Loading, error and empty states exist on data-dependent screens.
- [ ] No broken thumbnail or video embeds in demo data.
- [ ] Type checker passes.
- [ ] Linter passes, if configured.
- [ ] Production build passes.
- [ ] README setup steps have been followed successfully on a clean environment.

---

## 17. Implementation Plan for Antigravity

Work in the following order. Do not attempt to generate every page in one huge edit.

### Phase 1 — Inspect and plan
1. Inspect project files and existing dependencies.
2. Report current framework, entry point, styling approach and existing functionality.
3. Confirm or propose the file structure and route map.
4. Identify Firebase configuration requirements.
5. Do not delete or replace working code without a reason.

**Deliverable:** Short implementation plan and list of required environment variables.

### Phase 2 — Foundation and visual system
1. Configure TypeScript, routing, global styles and design tokens.
2. Build public, learner and admin layout shells.
3. Create reusable UI primitives, course cards, forms, status messages and responsive navigation.
4. Implement route placeholders with correct layouts and 404 handling, then replace placeholders with real features in later phases.

**Acceptance:** All listed routes resolve to the correct layout; route refresh works; responsive navigation is usable.

### Phase 3 — Firebase and authentication
1. Create central Firebase client initialization.
2. Add `.env.example` and configuration validation.
3. Implement AuthProvider/auth service and route guards.
4. Implement register, login, Google login, password reset and sign-out.
5. Implement safe user profile initialization.

**Acceptance:** Auth flows work with a configured Firebase project; protected content never flashes to guests.

### Phase 4 — Public course discovery
1. Implement typed course/lesson models and service functions.
2. Implement home, catalog and course details routes.
3. Add search, filters, sorting, catalog loading/error/empty states.
4. Add bundled SVG artwork and the admin image-URL preview/validation flow; no upload UI or Firebase Storage.
5. Add course slug handling and public/draft visibility.

**Acceptance:** Public routes use Firestore data and filter to published courses.

### Phase 5 — Enrollment and learner experience
1. Implement idempotent enrollment.
2. Implement dashboard and My Courses routes.
3. Implement lesson player and curriculum navigation.
4. Implement lesson completion, resume state and derived progress.
5. Verify access logic for enrolled, not-enrolled and preview cases.

**Acceptance:** A learner can enroll, study, persist progress and resume after reload.

### Phase 6 — Admin content management
1. Implement admin custom-claim verification and protected routes.
2. Implement course list/create/edit/publish workflow.
3. Implement lesson CRUD and ordering.
4. Implement preview, thumbnail selection/URL validation, and destructive confirmation flows.
5. Verify changes flow through to public pages and image fallbacks work.

**Acceptance:** Admin can manage content; a learner cannot bypass authorization.

### Phase 7 — Security, testing and polish
1. Implement Firestore Security Rules and indexes.
2. Test ownership boundaries, unpublished content and admin permission.
3. Complete loading/error/empty states and responsive refinements.
4. Add/update tests.
5. Run typecheck, lint, test and production build.
6. Fix broken navigation, console errors, broken media and visual inconsistencies.

**Acceptance:** Section 16 checklist passes or remaining blockers are explicitly documented.

### Phase 8 — Documentation and handoff
1. Complete `README.md` with setup, Firebase configuration, OAuth authorized domains, Firestore setup, seed data, admin provisioning, local dev, and Firebase Hosting deployment steps.
2. Document necessary Firestore indexes/rules and Firebase Hosting SPA rewrite deployment. State that Firebase Cloud Storage is intentionally not used because it requires Blaze billing.
3. Confirm `.env` and service-account secrets are excluded from version control.
4. Provide a final report listing implemented features, files of note, commands run, test/build results and any genuine limitations.

---

## 18. Environment and Setup Requirements

Create `.env.example` with the names below. Use the matching Vite variable prefix if the selected stack is Vite. Do not put secrets in client environment variables.

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

- Explain how to create a Firebase project and register a web app.
- Explain how to enable Google and Email/Password providers in Firebase Authentication.
- Explain how to create Firestore and deploy Security Rules.
- Do not enable or initialize Firebase Cloud Storage. Do not include `VITE_FIREBASE_STORAGE_BUCKET` in `.env.example` and do not install/import the Firebase Storage SDK.
- Explain the two course-thumbnail sources: bundled `/public/images/courses/*.svg` assets or a validated public HTTPS image URL. Include preview, error/fallback states, and publication validation.
- Provide `firebase.json` with the `dist/` public directory and SPA rewrite to `/index.html`; document Firebase Hosting Spark deployment and current quotas.
- Explain OAuth authorized domains when applicable.
- Add a safe admin provisioning script or documented trusted workflow. If a script requires the Firebase Admin SDK, run it only in a trusted local/server environment and never from the browser bundle.
- Add `.env`, service-account files and local secrets to `.gitignore`.
- If Firebase configuration is missing, show an explicit development/setup error screen or console diagnostic; do not make the app appear fully functional using a silent mock backend.

---

## 19. Content and Product Copy Guidance

Use clear, concise English and avoid exaggerated marketing claims. Suggested initial copy:

**Home hero headline:** “Learn by building real projects.”  
**Home subheadline:** “Explore practical courses, follow hands-on lessons, and track your progress as you grow your skills.”  
**Primary CTA:** “Explore Courses”  
**Secondary CTA:** “Start Learning”  
**Catalog heading:** “Explore Courses”  
**Catalog subheading:** “Practical lessons to help you build skills one step at a time.”  
**Dashboard greeting:** “Welcome back, {firstName}.”  
**Empty enrollments:** “Your learning journey starts here.”  
**Empty CTA:** “Browse Courses”  
**Mark-complete action:** “Mark as Complete”  
**Continue action:** “Continue Learning”

Avoid using fake testimonials, unsupported student counts, fabricated ratings, fake reviews or inflated course metrics. If stats are shown, they must come from real data or be omitted.

---

## 20. Deliverables Required from Antigravity

At completion, provide:
1. A fully functioning route-based CourseHub application.
2. Public, learner and admin routes specified in Section 5.
3. Reusable component and feature/service architecture.
4. Firebase Authentication integration.
5. Firestore-backed courses, lessons, enrollments and lesson progress.
6. Admin course/lesson CRUD and publishing workflow.
7. Firestore Security Rules and necessary index configuration.
8. `.env.example` and `.gitignore` updates.
9. Optional, documented seed script for original demo content.
10. README with local setup, Firebase configuration, admin provisioning and Firebase Hosting Spark deployment instructions, including SPA rewrites and cost/quota caveats.
11. Tests or documented verification results for authentication, permissions, enrollment, progress and routing.
12. Final completion report that distinguishes what is implemented and tested from anything that remains incomplete.

---

## 21. Final Build Checklist

Before claiming the build is complete, verify each of these:

- [ ] This is a real multi-route app—not a single-page mockup.
- [ ] Public pages, learner pages and admin pages have distinct layouts and permissions.
- [ ] All route paths in Section 5 exist and work on direct navigation/refresh.
- [ ] Firebase authentication is real and handles loading/error states.
- [ ] Courses, lessons, enrollments and progress are persisted in Firestore.
- [ ] The UI does not falsely show success when a write fails.
- [ ] Firestore Rules protect learner-owned data and unpublished content.
- [ ] Admin privilege cannot be granted from the client.
- [ ] Admin CRUD is complete enough to create and publish a course with lessons.
- [ ] The design is consistent and responsive on mobile/tablet/desktop.
- [ ] Empty states, errors, loading states and 404s are implemented.
- [ ] No private credentials or service-account files are committed.
- [ ] No Firebase Storage SDK, Storage bucket configuration, file upload UI, or Cloud Storage dependency exists.
- [ ] Firebase Authentication + Firestore + Firebase Hosting are the only required Firebase services; no deployed Cloud Functions or billing-required products are used.
- [ ] Course thumbnails work using bundled local SVG assets; admin HTTPS URL entry has preview, validation, error and fallback behavior.
- [ ] Deployment uses Firebase Hosting (not App Hosting), supports direct route refresh, and does not require a billing account for the intended Spark setup.
- [ ] README setup steps and required environment variables are documented.
- [ ] Typecheck, tests/lint (where configured) and production build have been run.
- [ ] The final report accurately lists any known limitations.

**End of PRD.**
