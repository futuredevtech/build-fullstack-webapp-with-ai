<<<<<<< HEAD
<div align="center">

# 🎓 CourseHub — Full-Stack Course Web App (Built with AI)

[![Watch on YouTube](https://img.shields.io/badge/YouTube-Watch%20Full%20Tutorial-red?style=for-the-badge&logo=youtube)](https://youtu.be/6up0dQM4Vao)
[![Channel](https://img.shields.io/badge/Channel-Abhimanyu%2048-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/@Abhimanyu48)
[![Future Dev Tech](https://img.shields.io/badge/Agency-Future%20Dev%20Tech-0ea5e9?style=for-the-badge&logo=codewars)](https://instagram.com/futuredevtech48)
[![Instagram](https://img.shields.io/badge/Instagram-@futuredevtech48-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/futuredevtech48)
[![Email](https://img.shields.io/badge/Contact-info%40futuredevtech.com-22c55e?style=for-the-badge&logo=gmail&logoColor=white)](mailto:info@futuredevtech.com)

<br />

[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase%2013-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

<br />

### 🚀 Complete Guide: How to Build a Full Stack Web App with AI from Scratch
**A production-ready Online Course & Learning Management System (LMS) web application powered by React, TypeScript, Tailwind CSS, and Firebase.**

---

### 📺 Watch the Full Step-by-Step Video Tutorial

[![Build a Full Stack Web App with AI Tutorial](https://img.youtube.com/vi/6up0dQM4Vao/maxresdefault.jpg)](https://youtu.be/6up0dQM4Vao)

👉 **[Click Here to Watch the Complete Tutorial on YouTube (Abhimanyu 48)](https://youtu.be/6up0dQM4Vao)**

*Subscribe to **[Abhimanyu 48](https://youtu.be/6up0dQM4Vao)** on YouTube for more in-depth full-stack web development tutorials, AI-assisted coding walkthroughs, and modern software engineering guides!*

---

</div>

## 📌 Keywords & Topics Covered

> **Target Keywords:** `build a full stack web app`, `build a full stack web app with ai`, `build full stack web app using ai`, `full stack course website`, `create lms website`, `react firebase full stack project`, `learn web development with ai`, `ai coding assistant tutorial`, `abhimanyu 48`, `firebase spark plan free hosting`, `react 19 vite full stack tutorial`.

---

## 📖 About The Project

**CourseHub** is a modern, responsive, and complete full-stack course platform engineered from the ground up using **AI-assisted software engineering**. It demonstrates how to architect, develop, secure, and deploy a commercial-grade web application on a **100% free tier (Firebase Spark Plan)** with zero cloud storage costs and no credit card required.

Whether you want to learn **how to build a full stack web app with AI**, build your own educational business platform, or add a standout project to your developer portfolio, this codebase and accompanying tutorial give you everything you need.

---

## ✨ Key Features

### 🌐 1. Public Discovery & Catalog
* **Modern Hero & Showcase**: Interactive hero section highlighting popular tech courses and learning paths.
* **Smart Filter & Search**: Instant client-side search by title, category, difficulty level (Beginner, Intermediate, Advanced), and sorting (Popular, Newest, Duration).
* **Course Detail Overview**: Learning objectives, target audience, instructor bio, estimated completion time, and syllabus breakdown.
* **Free Preview Lessons**: Prospective learners can watch preview lessons before enrolling.

### 🔐 2. Authentication & Authorization (Firebase Auth)
* **Multiple Sign-in Providers**: Email & Password and 1-Click Google OAuth Popup sign-in.
* **Password Reset Workflow**: Automated email recovery link dispatch.
* **Safe Profile Synchronization**: Automatic Firestore profile doc generation (`users/{uid}`) without vulnerability to client privilege escalation.
* **Custom Role Protection**: Admin rights protected by Firebase Auth custom claims and verified on both UI route guards and Cloud Firestore Security Rules.

### 📚 3. Engaging Learner Experience
* **Learner Dashboard (`/dashboard`)**: Personalized welcome, ongoing course progress bars, completed counts, and quick "Resume Learning" cards.
* **Distraction-Free Course Player (`/learn/:courseSlug/:lessonId`)**:
  * Integrated YouTube privacy-enhanced video embed player (`youtube-nocookie.com`).
  * Full lesson curriculum sidebar with visual completion checkmarks.
  * 1-click "Mark as Completed" with instant real-time progress update.
  * **Celebration Modal**: Animated completion dialog when 100% of course lessons are finished!

### 🛠️ 4. Powerful Admin CMS (Content Management System)
* **Overview Analytics**: Real-time stats showing total courses, published vs draft counts, and total curriculum lessons.
* **Course Builder (`/admin/courses/new` & `/admin/courses/:id`)**:
  * Rich course metadata editor with auto-generated URL slugs.
  * **Zero-Cloud-Storage Artwork Picker**: Choose from 5 pre-bundled vector SVG illustrations or supply an external HTTPS image URL with real-time browser load verification (`new Image()`).
* **Curriculum & Lesson Manager (`/admin/courses/:id/lessons`)**:
  * Create, edit, and delete lessons.
  * Reorder lesson sequences with numeric sequence management.
  * Live YouTube video ID extraction and embed testing.
* **1-Click Demo Data Seeder**: Pre-seeds 5 comprehensive tech courses and lessons into Firestore with one click.

---

## 🏗️ Tech Stack & Architecture

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build & Tooling** | [Vite 8](https://vitejs.dev/) + ESBuild |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Design Tokens |
| **Icons & Media** | [Lucide React](https://lucide.dev/) + Bundled SVG Vector Artworks |
| **Backend & Database** | [Google Firebase](https://firebase.google.com/) (Modular SDK v13) |
| **Authentication** | Firebase Authentication (Email/Password & Google OAuth) |
| **Database** | Cloud Firestore (NoSQL Document Store with Security Rules) |
| **Hosting & CDN** | Firebase Hosting (Global CDN, SSL, Single-Page App Rewrites) |
| **AI Pair Programming** | Built using Antigravity AI Coding Assistant |

---

## 🚀 Quick Start Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/full_stack_web_app.git
cd full_stack_web_app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Firebase Environment
Create a `.env` file in the project root:
```ini
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 4: Publish Firestore Security Rules
Go to **Firebase Console ➔ Firestore Database ➔ Rules**, paste the contents of `firestore.rules`, and click **Publish**.

### Step 5: Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🔑 Demo Admin Credentials & Seeding

1. **Sign Up or Sign In** with the built-in admin email:
   * **Email:** `admin@coursehub.dev`
   * **Password:** Any password of your choice (minimum 6 characters)
2. Go to the **Admin Portal** in the navigation bar or visit:
   ```
   http://localhost:5173/admin/courses
   ```
3. Click the purple **"Seed Demo Courses"** button.
4. All 5 demo courses and full lesson curriculums will instantly populate in your Cloud Firestore database!

---

## 🚢 Production Deployment to Firebase Hosting

This project is configured for one-command deployment to Firebase Hosting:

```bash
# 1. Build optimized production bundle
npm run build

# 2. Deploy hosting and rules
firebase deploy --only hosting
```

Your web app will be instantly live on Google's global CDN:
👉 `https://<your-project-id>.web.app`

---

## 🎥 Video Tutorial by Abhimanyu 48

Want to learn how this whole application was planned, architected, and built step-by-step using AI?

Watch the full masterclass on YouTube:
* 🔗 **Video Link:** [https://youtu.be/6up0dQM4Vao](https://youtu.be/6up0dQM4Vao)
* 📺 **Channel:** [Abhimanyu 48](https://youtu.be/6up0dQM4Vao)

Don't forget to **Like**, **Share**, and **Subscribe** to support more free full-stack development content!

---

## 💼 Work With Us — App, Web & Game Development

Looking for a professional development team to build your next big idea? **Future Dev Tech** specializes in end-to-end development for businesses, startups, and creators worldwide.

### 🛠️ Our Services:
* 🌐 **Full-Stack Web Development** (Modern Web Apps, SaaS, Next.js, React, Node.js, Firebase)
* 📱 **Mobile App Development** (Cross-platform iOS & Android, Flutter, React Native)
* 🎮 **Game Development** (2D/3D Games, Unity, Unreal Engine, Web Games)
* 🤖 **AI Integration & Custom Software** (AI agents, custom APIs, database architecture, cloud infrastructure)

### 📬 Get In Touch Today:
* 🏢 **Website:** Future Dev Tech
* ✉️ **Email:** [info@futuredevtech.com](mailto:info@futuredevtech.com)
* 📸 **Instagram:** [@futuredevtech48](https://instagram.com/futuredevtech48)
* 📺 **YouTube:** [Abhimanyu 48](https://youtu.be/6up0dQM4Vao)

> *Feel free to contact us for freelance projects, custom software development, code reviews, or business inquiries!*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use it for your personal learning, portfolio, or commercial products!
=======
# build-fullstack-webapp-with-ai
>>>>>>> 416bda061426a541be0eb81b17049294fe705008
