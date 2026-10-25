export interface SeedLesson {
  title: string
  description: string
  order: number
  durationSeconds: number
  videoUrl: string
  isPreview: boolean
  resources: Array<{ label: string; url: string }>
}

export interface SeedCourse {
  title: string
  slug: string
  subtitle: string
  description: string
  thumbnailUrl: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  tags: string[]
  learningOutcomes: string[]
  instructor: {
    name: string
    bio: string
  }
  durationMinutes: number
  featured: boolean
  published: boolean
  lessons: SeedLesson[]
}

export const SEED_COURSES: SeedCourse[] = [
  {
    title: 'Build Your First React UI',
    slug: 'react-first-ui',
    subtitle: 'Learn the core building blocks of modern React: JSX, props, state, and component hierarchies.',
    description: `React is the industry standard library for building dynamic, reactive user interfaces. In this comprehensive beginner course, you will learn how to compose reusable components, pass data via props, manage local state with the useState hook, and respond to user events.
    
By the end of this course, you will have built an interactive application and mastered the mental model behind component-driven development.`,
    thumbnailUrl: '/images/courses/react-basics.svg',
    category: 'Frontend',
    level: 'Beginner',
    tags: ['react', 'javascript', 'components', 'frontend', 'hooks'],
    learningOutcomes: [
      'Master JSX syntax and component composition',
      'Manage interactive state using the useState hook',
      'Pass structured data down component trees with props',
      'Handle form inputs, clicks, and synthetic events cleanly',
      'Organize a maintainable React project structure with Vite',
    ],
    instructor: {
      name: 'Sarah Chen',
      bio: 'Staff Frontend Engineer & React core enthusiast with 8+ years building enterprise web apps.',
    },
    durationMinutes: 45,
    featured: true,
    published: true,
    lessons: [
      {
        title: '01. React Mental Model & Project Setup',
        description: 'Understand declarative UI, the virtual DOM concept, and scaffold a fast project using Vite.',
        order: 1,
        durationSeconds: 480,
        videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
        isPreview: true,
        resources: [
          { label: 'React Documentation', url: 'https://react.dev' },
          { label: 'Vite Getting Started', url: 'https://vite.dev/guide/' },
        ],
      },
      {
        title: '02. Components, JSX, and Passing Props',
        description: 'Learn how to write clean JSX, create nested components, and pass typed props between components.',
        order: 2,
        durationSeconds: 620,
        videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
        isPreview: true,
        resources: [
          { label: 'JSX in Depth', url: 'https://react.dev/learn/writing-markup-with-jsx' },
        ],
      },
      {
        title: '03. Managing Reactive State with useState',
        description: 'Deep dive into state hooks, immutability, and rerendering cycles with live code examples.',
        order: 3,
        durationSeconds: 780,
        videoUrl: 'https://www.youtube.com/watch?v=4ORZ1GmjaMc',
        isPreview: false,
        resources: [
          { label: 'State: A Component Memory', url: 'https://react.dev/learn/state-a-components-memory' },
        ],
      },
      {
        title: '04. Building an Interactive Project UI',
        description: 'Combine everything learned to assemble a cohesive user interface with dynamic lists and inputs.',
        order: 4,
        durationSeconds: 840,
        videoUrl: 'https://www.youtube.com/watch?v=kVeOpcw4GWY',
        isPreview: false,
        resources: [
          { label: 'Rendering Lists', url: 'https://react.dev/learn/rendering-lists' },
        ],
      },
    ],
  },
  {
    title: 'Firebase Authentication Fundamentals',
    slug: 'firebase-auth-fundamentals',
    subtitle: 'Secure user onboarding with Email/Password, Google OAuth, and session persistence.',
    description: `Authentication is a cornerstone of every production web application. This course guides you through configuring Firebase Authentication on the Spark tier, implementing sign-up, sign-in, and OAuth popups, and maintaining reactive session state across browser refreshes.`,
    thumbnailUrl: '/images/courses/firebase-basics.svg',
    category: 'Backend',
    level: 'Beginner',
    tags: ['firebase', 'auth', 'security', 'google-login', 'sessions'],
    learningOutcomes: [
      'Set up Firebase Authentication in the Firebase Console',
      'Implement email and password account creation & sign-in',
      'Enable Google OAuth popup authentication',
      'Handle auth state changes with onAuthStateChanged',
      'Protect client routes and sanitize redirect destinations',
    ],
    instructor: {
      name: 'Marcus Vance',
      bio: 'Cloud Architect & Firebase specialist passionate about secure serverless systems.',
    },
    durationMinutes: 55,
    featured: true,
    published: true,
    lessons: [
      {
        title: '01. Firebase Project Setup & Console Configuration',
        description: 'Create a Firebase project, register a web application, and retrieve your Spark-compatible client configuration.',
        order: 1,
        durationSeconds: 510,
        videoUrl: 'https://www.youtube.com/watch?v=9kRgVxULbag',
        isPreview: true,
        resources: [
          { label: 'Firebase Console', url: 'https://console.firebase.google.com' },
        ],
      },
      {
        title: '02. Email & Password Authentication Flow',
        description: 'Build complete registration, login, and error handling for standard credentials.',
        order: 2,
        durationSeconds: 690,
        videoUrl: 'https://www.youtube.com/watch?v=84f23bM0dFk',
        isPreview: false,
        resources: [
          { label: 'Firebase Auth Web Docs', url: 'https://firebase.google.com/docs/auth/web/start' },
        ],
      },
      {
        title: '03. Google OAuth & Social Sign-In',
        description: 'Configure authorized domains, handle GoogleAuthProvider popups, and manage user profile tokens.',
        order: 3,
        durationSeconds: 610,
        videoUrl: 'https://www.youtube.com/watch?v=3q-v0qfVw-0',
        isPreview: false,
        resources: [
          { label: 'Google Sign-In Guide', url: 'https://firebase.google.com/docs/auth/web/google-signin' },
        ],
      },
    ],
  },
  {
    title: 'Build a Small React + Firebase Project',
    slug: 'react-firebase-project',
    subtitle: 'Connect React components to Cloud Firestore for real-time reads, writes, and security rules.',
    description: `Take your frontend skills to the full-stack realm. Learn how to persist application records to Cloud Firestore, create subcollections, write granular Security Rules, and prevent unauthorized client access without needing expensive servers.`,
    thumbnailUrl: '/images/courses/web-development.svg',
    category: 'Web Development',
    level: 'Intermediate',
    tags: ['react', 'firestore', 'fullstack', 'crud', 'security-rules'],
    learningOutcomes: [
      'Design normalized Firestore schemas with subcollections',
      'Perform typed CRUD operations using modern Firebase SDK',
      'Enforce ownership rules and custom claims in firestore.rules',
      'Handle loading skeletons, optimistic updates, and empty states',
    ],
    instructor: {
      name: 'Elena Rostova',
      bio: 'Full-stack educator and author of modern TypeScript web development guides.',
    },
    durationMinutes: 65,
    featured: true,
    published: true,
    lessons: [
      {
        title: '01. Firestore Data Modeling & Subcollections',
        description: 'Understand document-oriented design, collection hierarchy, and cost-efficient querying on Spark.',
        order: 1,
        durationSeconds: 650,
        videoUrl: 'https://www.youtube.com/watch?v=haMogMRJMSo',
        isPreview: true,
        resources: [
          { label: 'Firestore Data Model', url: 'https://firebase.google.com/docs/firestore/data-model' },
        ],
      },
      {
        title: '02. Performing Typed Firestore Reads & Writes',
        description: 'Implement robust service functions using setDoc, updateDoc, and query filters.',
        order: 2,
        durationSeconds: 820,
        videoUrl: 'https://www.youtube.com/watch?v=2ytdfP5sP6c',
        isPreview: false,
        resources: [
          { label: 'Firestore CRUD Operations', url: 'https://firebase.google.com/docs/firestore/manage-data/add-data' },
        ],
      },
      {
        title: '03. Writing Production Firestore Security Rules',
        description: 'Secure learner progress and enforce admin claims directly in security rules.',
        order: 3,
        durationSeconds: 780,
        videoUrl: 'https://www.youtube.com/watch?v=e_wflT66LBE',
        isPreview: false,
        resources: [
          { label: 'Firestore Security Rules', url: 'https://firebase.google.com/docs/firestore/security/get-started' },
        ],
      },
    ],
  },
  {
    title: 'Deploy a Web App',
    slug: 'deploy-web-app',
    subtitle: 'Deploy your Vite SPA to Firebase Hosting with custom domains, SSL, and SPA rewrites.',
    description: `Learn how to take your web application from local development to a globally distributed HTTPS production URL using Firebase Hosting. Master SPA rewrites, clean URLs, and continuous deployment workflows.`,
    thumbnailUrl: '/images/courses/general-learning.svg',
    category: 'DevOps & Cloud',
    level: 'Beginner',
    tags: ['hosting', 'deployment', 'vite', 'spa', 'cdn'],
    learningOutcomes: [
      'Install and authenticate with Firebase CLI locally',
      'Configure firebase.json for Single Page Application rewrites',
      'Optimize Vite production bundles for minimal transfer size',
      'Deploy and verify live routes with zero deep-link 404 errors',
    ],
    instructor: {
      name: 'David Kim',
      bio: 'DevOps engineer focusing on Jamstack architectures and edge deployments.',
    },
    durationMinutes: 40,
    featured: false,
    published: true,
    lessons: [
      {
        title: '01. Building the Optimized Production Bundle',
        description: 'Compile TypeScript, minify assets, and verify dist/ output using Vite build tools.',
        order: 1,
        durationSeconds: 520,
        videoUrl: 'https://www.youtube.com/watch?v=3fZNEzZfA8s',
        isPreview: true,
        resources: [
          { label: 'Vite Production Build', url: 'https://vite.dev/guide/build.html' },
        ],
      },
      {
        title: '02. Deploying with Firebase CLI',
        description: 'Run firebase init hosting, set SPA rewrites to index.html, and deploy to live SSL CDN.',
        order: 2,
        durationSeconds: 640,
        videoUrl: 'https://www.youtube.com/watch?v=e_1fL67L94E',
        isPreview: false,
        resources: [
          { label: 'Firebase Hosting Guide', url: 'https://firebase.google.com/docs/hosting' },
        ],
      },
    ],
  },
  {
    title: 'JavaScript Essentials for Beginners',
    slug: 'javascript-essentials',
    subtitle: 'Master modern ES6+ syntax, async/await, array methods, and functional patterns.',
    description: `The essential foundation for every aspiring web developer. Deep dive into modern JavaScript features including destructuring, arrow functions, promises, modules, and immutability required for modern frameworks.`,
    thumbnailUrl: '/images/courses/ai-projects.svg',
    category: 'Web Development',
    level: 'Beginner',
    tags: ['javascript', 'es6', 'async', 'promises', 'foundations'],
    learningOutcomes: [
      'Understand variable scopes (const, let) and closures',
      'Master array transformations (map, filter, reduce)',
      'Handle asynchronous programming with Promises and async/await',
      'Work with modern ES module import/export patterns',
    ],
    instructor: {
      name: 'Sarah Chen',
      bio: 'Staff Frontend Engineer & React core enthusiast with 8+ years building enterprise web apps.',
    },
    durationMinutes: 50,
    featured: false,
    published: true,
    lessons: [
      {
        title: '01. Modern ES6+ Syntax & Destructuring',
        description: 'Arrow functions, template literals, object destructuring, and rest/spread operators.',
        order: 1,
        durationSeconds: 610,
        videoUrl: 'https://www.youtube.com/watch?v=NCwa_xi0Uuc',
        isPreview: true,
        resources: [
          { label: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
        ],
      },
      {
        title: '02. Asynchronous JavaScript & Promises',
        description: 'Master asynchronous execution, fetch API requests, and async/await syntax.',
        order: 2,
        durationSeconds: 790,
        videoUrl: 'https://www.youtube.com/watch?v=PoRJizFvM7s',
        isPreview: false,
        resources: [
          { label: 'Using Promises', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises' },
        ],
      },
    ],
  },
]
