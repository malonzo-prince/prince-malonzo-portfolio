export const profile = {
  name: "Prince Barachiel Malonzo",
  title: "Full Stack Developer",
  availability: "Open to freelance projects",
  email: "malonzo.princebarachiel31@gmail.com",
  location: "Manila, Philippines",
  github: "https://github.com/malonzo-prince",
  githubUsername: "malonzo-prince",
  linkedin: "https://www.linkedin.com/in/prince-barachiel-malonzo-614942389/",
  resume: "/resume/prince-barachiel-malonzo-resume.pdf",
  description:
    "Full Stack Developer based in Manila, Philippines. Building thoughtful web and mobile applications, from the interface to the infrastructure.",
} as const;

export const navigation = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Project builder", href: "/#project-builder" },
  { label: "Contact", href: "#contact" },
] as const;

export const experience = [
  {
    id: "microgenesis-full-time",
    company: "Microgenesis Business Systems",
    role: "Junior Full Stack Developer",
    type: "Full-time",
    period: "May 2026 — October 2026",
    dateTime: "2026-05",
    summary: "From internship to full-time development.",
    details: [
      "Promoted to a full-time Junior Full Stack Developer after completing an 800-hour internship.",
      "Developed and maintained frontend and backend features for internal and client projects.",
      "Collaborated with cross-functional teams on testing, deployment, troubleshooting, and technical documentation.",
    ],
  },
  {
    id: "freelance",
    company: "Solo Freelance",
    role: "Full Stack Developer",
    type: "Remote",
    period: "February 2026 — Present",
    dateTime: "2026-02",
    summary: "Practical solutions for small businesses and academic projects.",
    details: [
      "Developed websites and web applications for small business clients and academic/capstone projects.",
      "Built and customized features around client and project requirements.",
      "Handled deployment, integrations, bug fixes, and technical support.",
    ],
  },
  {
    id: "microgenesis-internship",
    company: "Microgenesis Business Systems",
    role: "Full Stack Developer / Project Manager / Quality Assurance",
    type: "Internship",
    period: "December 2025 — April 2026",
    dateTime: "2025-12",
    summary: "An 800-hour internship across development, coordination, and QA.",
    details: [
      "Completed an 800-hour internship in full-stack development and project management.",
      "Led and coordinated a team of 17 fellow interns, managing tasks and project deliverables.",
      "Developed, tested, and maintained frontend and backend features.",
    ],
  },
] as const;

export const skillFilters = ["All skills", "Development", "Data & cloud", "Workflow"] as const;
export type SkillFilter = (typeof skillFilters)[number];

export const skillGroups: {
  name: string;
  category: Exclude<SkillFilter, "All skills">;
  icon: string;
  skills: string[];
}[] = [
  {
    name: "Languages",
    category: "Development",
    icon: "code",
    skills: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "Kotlin",
      "Dart",
      "PHP",
      "C++",
      "C#",
      "HTML5",
      "CSS3",
    ],
  },
  {
    name: "Frontend & mobile",
    category: "Development",
    icon: "layout",
    skills: [
      "React.js",
      "Next.js",
      "Vue.js",
      "React Native",
      "Flutter",
      "Tailwind CSS",
      "shadcn/ui",
      "Responsive Web Design",
    ],
  },
  {
    name: "Backend & APIs",
    category: "Development",
    icon: "server",
    skills: ["Node.js", "Express.js", "Django", "RESTful APIs", "Third-Party API Integration"],
  },
  {
    name: "Authentication",
    category: "Development",
    icon: "shield",
    skills: [
      "Google SSO",
      "Microsoft SSO",
      "OAuth 2.0",
      "OpenID Connect",
      "JWT",
      "Role-Based Access Control",
    ],
  },
  {
    name: "Databases & services",
    category: "Data & cloud",
    icon: "database",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Firebase", "Supabase", "Neon"],
  },
  {
    name: "Cloud & deployment",
    category: "Data & cloud",
    icon: "cloud",
    skills: ["Microsoft Azure", "Google Cloud Platform", "Vercel", "Render"],
  },
  {
    name: "Architecture",
    category: "Data & cloud",
    icon: "network",
    skills: [
      "Microservices Architecture",
      "Monolithic Architecture",
      "System Design",
      "Database Design",
    ],
  },
  {
    name: "Version control & delivery",
    category: "Workflow",
    icon: "git",
    skills: ["Git", "GitHub", "Azure DevOps", "CI/CD Pipelines", "GitHub Actions"],
  },
  {
    name: "Testing & quality",
    category: "Workflow",
    icon: "check",
    skills: [
      "Manual Testing",
      "Functional Testing",
      "Integration Testing",
      "User Acceptance Testing",
      "API Testing",
      "Postman",
    ],
  },
  {
    name: "AI & development tools",
    category: "Workflow",
    icon: "sparkles",
    skills: ["ChatGPT", "OpenAI Codex", "Claude Code", "Google Gemini", "OpenAI API", "Gemini API"],
  },
  {
    name: "Design & integrations",
    category: "Workflow",
    icon: "pen",
    skills: ["Notion", "Jira", "Figma", "Canva", "Google Maps API", "Mapbox API"],
  },
];

export type Project = {
  id: string;
  number: string;
  name: string;
  category: "Web" | "Mobile";
  kind: "commerce" | "mobile" | "workspace";
  description: string;
  stack: string[];
  status: "concept" | "published";
  contribution?: string;
  repository?: string;
  liveUrl?: string;
  image?: string;
};

// Temporary concepts explicitly requested by Prince. These are never presented
// as completed projects, client work, or professional accomplishments.
export const projects: Project[] = [
  {
    id: "commerce-concept",
    number: "01",
    name: "Commerce, simplified.",
    category: "Web",
    kind: "commerce",
    description:
      "A sample dashboard concept for keeping products, orders, and everyday operations in one place.",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    status: "concept",
  },
  {
    id: "city-guide-concept",
    number: "02",
    name: "A city in your pocket.",
    category: "Mobile",
    kind: "mobile",
    description:
      "A sample mobile concept for discovering nearby places through a simple, map-first experience.",
    stack: ["React Native", "Mapbox", "Supabase"],
    status: "concept",
  },
  {
    id: "workspace-concept",
    number: "03",
    name: "Room for better teamwork.",
    category: "Web",
    kind: "workspace",
    description:
      "A sample workspace concept that brings tasks, project progress, and team conversations together.",
    stack: ["React", "Node.js", "MongoDB"],
    status: "concept",
  },
];

export const certifications = [
  {
    title: "Information Technology Specialist",
    subject: "JavaScript",
    issuer: "Certiport · Pearson VUE",
    date: "April 2026",
    number: "01",
  },
  {
    title: "Information Technology Specialist",
    subject: "HTML and CSS",
    issuer: "Certiport · Pearson VUE",
    date: "April 2026",
    number: "02",
  },
] as const;
