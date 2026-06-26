export const site = {
  name: 'Malik Fajar',
  fullName: 'Muhammad Malik Fajar El-Syarif',
  domain: 'malikfajar.me',
  website: 'https://malikfajar.me',
  title: 'Malik Fajar — Cybersecurity & Full Stack Developer',
  description:
    'A cybersecurity learner focused on pentesting and secure web development, while exploring 3D web experiences and modern UI.',
  linkedin: 'https://linkedin.com/in/malikfajar',
} as const

export const websites = [
  { label: 'malikfajar.my.id', href: 'https://malikfajar.my.id', primary: true, accent: 'yellow' as const },
  { label: 'malikdev.dpdns.org', href: 'https://malikdev.dpdns.org', primary: true, accent: 'yellow' as const },
  { label: 'malikfajar.me', href: 'https://malikfajar.me', accent: 'purple' as const },
  { label: 'malikfajar.tech', href: 'https://malikfajar.tech', accent: 'purple' as const },
] as const

export const githubProfiles = [
  { label: 'Malikkun09', href: 'https://github.com/Malikkun09/' },
  { label: 'MalikSMK09', href: 'https://github.com/MalikSMK09/' },
] as const

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
] as const

export const heroMarqueeTags = [
  'Student',
  'Cybersecurity Learner',
  'Web Security',
  'Pentesting',
  '3D Web',
  'Frontend Developer',
  'React',
  'Three.js',
] as const

export const about = {
  headline: "Hey! I'm Malik.",
  profileImage: '/images/profile.jpg',
  profileImageHover: '/images/MalikProfile.png',
  profileImageLongPress: '/images/MyAnime.jpeg',
  paragraphs: [
    "I'm a Grade 11 student at SMK Informatika Fithrah Insani who is passionate about cybersecurity and web security. I focus on learning how to build secure, reliable web experiences and understanding the fundamentals behind them.",
    "Right now I'm learning pentesting and application security. I also explore 3D web technology and modern UI to sharpen my skills and creativity.",
  ],
  interests: [
    'Interested in cybersecurity',
    'Full stack development',
    'UI/UX design',
  ],
} as const

export const aboutCards = [
  {
    label: 'Education',
    value: 'Grade 11 PPLG',
    detail: 'SMK Informatika Fithrah Insani',
  },
  {
    label: 'Focus',
    value: 'Cybersecurity',
    detail: 'Pentesting & web security',
  },
  {
    label: 'Development',
    value: 'Full Stack',
    detail: 'Secure web applications',
  },
  {
    label: 'AI Prompter',
    value: 'Prompt Craft',
    detail: 'AI prompts & creative workflows',
  },
  {
    label: 'Design',
    value: 'UI/UX',
    detail: 'Modern interfaces & systems',
  },
] as const

export const skillCategories = [
  {
    title: 'Frontend',
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Vite',
      'Three.js',
      'GSAP',
    ],
  },
  {
    title: 'Backend',
    skills: [
      'Laravel',
      'Node.js',
      'Express',
      'MySQL',
      'SQLite',
      'PostgreSQL',
      'MongoDB',
      'REST APIs',
      'GraphQL',
    ],
  },
  {
    title: 'Security',
    skills: ['Pentesting', 'Web security', 'OWASP', 'Linux', 'Docker', 'Git'],
  },
  {
    title: 'Design',
    skills: ['Figma', 'UI/UX', 'VS Code', 'AWS', 'Vercel'],
  },
] as const

export const experiences = [
  {
    year: '2026',
    title: 'Full Stack (Personal Project)',
    company: 'SkillMatch SMK / KerjaIn From Dicoding',
    description:
      'Building full-stack platform with React (Vite) + TailwindCSS and Laravel 12. Implemented AI roadmap generator and Laravel Sanctum authentication. Focus on modern and usable UI/UX.',
    tags: ['React', 'Laravel', 'AI', 'TailwindCSS'],
  },
  {
    year: '2025',
    title: 'Hackathon Participant',
    company: 'BPJS Hackathon & Web KulinaAI Powered with AI',
    description:
      'Collaborated in a team to create prototypes within limited time. Contributed to frontend development and API integration. Focused on problem solving and presenting solutions to judges.',
    tags: ['React', 'API Integration', 'Teamwork'],
  },
  {
    year: '2024 — 2025',
    title: 'Frontend Student (Self Project)',
    company: 'Various Web Portfolio & UI Projects',
    description:
      'Built responsive websites using HTML, CSS, and JavaScript. Practiced modern UI trends like glassmorphism, dark theme, and 3D elements. Sharpened UX through layout and interaction design.',
    tags: ['HTML', 'CSS', 'JavaScript', '3D'],
  },
  {
    year: '2024',
    title: 'Learning Phase — Web Development',
    company: 'Self Learning',
    description:
      'Learned HTML, CSS, JavaScript basics. Started exploring React and component-based architecture. Created mini projects and UI clones to strengthen fundamentals.',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
] as const

export const projects = [
  {
    title: 'SkillMatch Website',
    description:
      'Full-stack platform with React (Vite) + TailwindCSS and Laravel 12. AI roadmap generator and Laravel Sanctum authentication with modern UI/UX.',
    image: '/images/project-skillmatch.jpg',
    tags: ['React', 'Laravel', 'TailwindCSS', 'AI'],
    live: 'https://skillmatch.malikfajar.my.id',
    github: 'https://github.com/Malikkun09/skillmatch-website-open-source',
    featured: true,
    status: 'Project - Ongoing',
  },
  {
    title: 'EduVerse Website',
    description:
      'Educational web experience with modern UI patterns, responsive layouts, and engaging learning flows.',
    image: '/images/project-eduverse.png',
    tags: ['React', 'TypeScript', 'UI/UX'],
    live: 'https://eduverse.malikfajar.my.id',
    github: 'https://github.com/Malikkun09/eduverse-open-source',
    featured: true,
    status: 'Project - Ongoing',
  },
  {
    title: 'Courtline Website',
    description:
      'Information and services website focusing on clean design and fast performance.',
    image: '/images/project-court.jpg',
    tags: ['Next.js', 'TailwindCSS', 'UI/UX'],
    live: 'https://courtline.malikfajar.me/',
    github: 'https://github.com/MalikSMK09/courtline-23.06.2026',
    featured: true,
    status: 'Project - Ongoing',
  },
  {
    title: 'API Downloader',
    description:
      'API service for downloading content with database management and neat endpoints.',
    image: '/images/project-api.jpg',
    tags: ['Node.js', 'Express', 'MySQL'],
    live: 'https://malikfajar.my.id',
    github: 'https://github.com/MalikSMK09/mlikfjr-api',
    featured: false,
  },
  {
    title: 'JKN Mobile',
    description:
      'Application combining modern frontend and AI features to assist JKN users.',
    image: '/images/project-jkn.jpg',
    tags: ['React', 'Electron', 'AI'],
    live: 'https://jkn.malikfajar.my.id',
    github: 'https://github.com/Malikkun09/jkn-ai-navigator',
    featured: false,
  },
  {
    title: 'Teacher & Student Attendance',
    description:
      'Web-based attendance recording system for teachers and students in school environment.',
    image: '/images/project-attendance.jpg',
    tags: ['Laravel', 'MySQL', 'Bootstrap'],
    live: 'https://kehadiran-siswa-dan-guru.malikfajar.my.id',
    github: 'https://github.com/Malikkun09/kehadiran-with-API-and-python-web',
    featured: false,
  },
  {
    title: 'Media 2 Link',
    description:
      'Simple tool to manage and share multiple media links in one page.',
    image: '/images/project-media.jpg',
    tags: ['React', 'Vite', 'REST API'],
    live: 'https://media2link.malikfajar.my.id',
    github: 'https://github.com/Malikkun09/Media-Share-With-Link',
    featured: false,
  },
  {
    title: 'ChatLive',
    description:
      'Real-time live chat application using WebSockets for instant messaging and seamless communication.',
    image: '/images/project-chat.jpg',
    tags: ['Node.js', 'WebSockets', 'Real-time'],
    live: 'https://chatlive.malikfajar.my.id',
    github: 'https://github.com/Malikkun09/chatlive-BETA-',
    featured: false,
  },
] as const

export const certificates = [
  {
    title: 'Belajar Back-end Pemula dengan JavaScript',
    pages: ['/Sertifikat/sertfikat1-1.png', '/Sertifikat/sertfikat1-2.png'],
    description:
      'Certificate from Dicoding for the Beginner Back-end with JavaScript class, proving mastery of basic JS syntax, DOM manipulation, and programming logic.',
  },
  {
    title: 'Belajar Membuat Aplikasi Web dengan React',
    pages: ['/Sertifikat/sertfikat2-1.png', '/Sertifikat/sertfikat2-2.png'],
    description:
      'Certificate of completion for Learning to Create Web Applications with React, proving the ability to build interactive web applications using React.',
  },
  {
    title: 'Belajar Membuat Front-End Web untuk Pemula',
    pages: ['/Sertifikat/sertfikat3-1.png', '/Sertifikat/sertfikat3-2.png'],
    description:
      'Certificate of completion for Learning to Create Front-End Web for Beginners, proving the ability to create website displays using HTML, CSS, and JavaScript.',
  },
  {
    title: 'Belajar Dasar Pemrograman JavaScript',
    pages: [
      '/Sertifikat/sertfikat4-1.png',
      '/Sertifikat/sertfikat4-2.png',
      '/Sertifikat/sertfikat4-3.png',
    ],
    description:
      'Certificate of completion for Learning JavaScript Programming Basics, proving the ability to understand JavaScript basics such as variables, functions, objects, arrays, and DOM.',
  },
  {
    title: 'Belajar Dasar Pemrograman Web',
    pages: [
      '/Sertifikat/sertfikat5-1.png',
      '/Sertifikat/sertfikat5-2.png',
      '/Sertifikat/sertfikat5-3.png',
    ],
    description:
      'Certificate of completion for Learning Basic Web Programming, proving the ability to understand website development basics using HTML, CSS, and JavaScript.',
  },
  {
    title: 'Belajar Dasar Cloud dan Gen AI di AWS',
    pages: [
      '/Sertifikat/sertfikat6-1.png',
      '/Sertifikat/sertfikat6-2.png',
      '/Sertifikat/sertfikat6-3.png',
    ],
    description:
      'Certificate of completion for Learning Cloud and Gen AI Basics on AWS, proving understanding of cloud computing concepts, AWS basic services, and Generative AI technology.',
  },
  {
    title: 'Pengenalan ke Logika Pemrograman (Programming Logic 101)',
    pages: ['/Sertifikat/sertfikat7-1.png', '/Sertifikat/sertfikat7-2.png'],
    description:
      'Dicoding graduation certificate for Introduction to Programming Logic, proving understanding of basic programming logic, algorithms, and problem-solving fundamentals.',
  },
  {
    title: 'Memulai Dasar Pemrograman untuk Menjadi Pengembang Software',
    pages: [
      '/Sertifikat/sertfikat8-1.png',
      '/Sertifikat/sertfikat8-2.png',
      '/Sertifikat/sertfikat8-3.png',
      '/Sertifikat/sertfikat8-4.png',
    ],
    description:
      'Dicoding graduation certificate for Starting Programming Basics to Become a Software Developer, proving foundational programming concepts and readiness to grow as a developer.',
  },
  {
    title: 'Hackathon IMPHNEN x Kolosal.ai — Sertifikat Partisipasi',
    pages: ['/Sertifikat/sertifikat9.png'],
    description:
      'Participation certificate for the IMPHNEN x Kolosal.ai Hackathon with the theme "Inovasi AI: Mendorong Usaha Lokal dengan AI Inklusif".',
  },
  {
    title: 'Hackathon IMPHNEN x Kolosal AI — Sertifikat Kehadiran',
    pages: ['/Sertifikat/sertifikat10.png'],
    description:
      'Attendance certificate as a participant of the IMPHNEN x Kolosal AI Hackathon at the IMPHNEN community, December 7, 2025.',
  },
] as const

export const certificatesSection = {
  title: 'Sertifikat Pencapaian',
  description:
    'A collection of certificates with graduation achievements and attendance that I earned while learning and creating.',
} as const

export const contactLinks = [
  {
    id: 'email-school',
    label: 'Email',
    value: 'Send a message',
    kind: 'email-school' as const,
    accent: 'blue' as const,
  },
  {
    id: 'email-personal',
    label: 'Personal Email',
    value: 'Send a message',
    kind: 'email-personal' as const,
    accent: 'blue' as const,
  },
  {
    id: 'github-malikkun09',
    label: 'GitHub',
    value: 'Malikkun09',
    href: 'https://github.com/Malikkun09/',
    accent: 'blue' as const,
  },
  {
    id: 'github-maliksmk09',
    label: 'GitHub',
    value: 'MalikSMK09',
    href: 'https://github.com/MalikSMK09/',
    accent: 'yellow' as const,
  },
  {
    id: 'website-primary',
    label: 'Website',
    value: 'malikfajar.my.id',
    href: 'https://malikfajar.my.id',
    accent: 'yellow' as const,
  },
  {
    id: 'website-alt',
    label: 'Website',
    value: 'malikdev.dpdns.org',
    href: 'https://malikdev.dpdns.org',
    accent: 'yellow' as const,
  },
  {
    id: 'website-me',
    label: 'Website',
    value: 'malikfajar.me',
    href: 'https://malikfajar.me',
    accent: 'purple' as const,
  },
  {
    id: 'website-tech',
    label: 'Website',
    value: 'malikfajar.tech',
    href: 'https://malikfajar.tech',
    accent: 'purple' as const,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: 'Send a message',
    kind: 'whatsapp' as const,
    accent: 'yellow' as const,
  },
] as const
