/**
 * Seed script — populates Firestore with realistic demo/placeholder data
 * so the portfolio looks complete during development.
 *
 * Usage:
 *   1. Fill in .env.local with your Firebase config
 *   2. Create an admin user in Firebase Authentication (Console → Authentication → Add user)
 *   3. Run: node scripts/seed.mjs
 *
 * This demo data is clearly separate from production data — replace or delete
 * it any time through the Admin Panel (/admin/login).
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Seeding demo data...");

  // Profile
  await setDoc(doc(db, "settings", "profile"), {
    name: "Alex Johnson",
    title: "Full-Stack Software Engineer",
    bio: "I'm a full-stack developer who loves building clean, performant web applications. I specialize in React, Node.js, and cloud-native architectures, and I'm always exploring new ways to solve real-world problems with code.",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    imageUrl: "",
    resumeUrl: "",
    github: "https://github.com/alexjohnson",
    linkedin: "https://linkedin.com/in/alexjohnson",
    twitter: "https://twitter.com/alexjohnson",
    website: "https://alexjohnson.dev",
    seoTitle: "Alex Johnson — Full-Stack Software Engineer",
    seoDescription: "Portfolio of Alex Johnson, a full-stack software engineer specializing in React, Node.js, and cloud architecture.",
    portfolioStatus: "published",
    updatedAt: serverTimestamp(),
  });

  // App settings
  await setDoc(doc(db, "settings", "app"), {
    portfolioTitle: "Alex Johnson — Full-Stack Developer",
    portfolioStatus: "published",
    maintenanceMode: false,
    allowContactMessages: true,
  });

  // Education
  const education = [
    {
      degree: "B.S. in Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2016-09-01",
      endDate: "2020-05-15",
      grade: "3.8 GPA",
      description: "Focused on software engineering, algorithms, and distributed systems. Active member of the ACM student chapter.",
      visible: true,
      order: 0,
    },
    {
      degree: "High School Diploma",
      institution: "Lincoln High School",
      location: "San Francisco, CA",
      startDate: "2012-09-01",
      endDate: "2016-06-15",
      grade: "4.0 GPA",
      description: "Graduated valedictorian with a focus on mathematics and computer science.",
      visible: true,
      order: 1,
    },
  ];
  for (const edu of education) {
    await addDoc(collection(db, "education"), { ...edu, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  // Skills
  const skills = [
    { name: "JavaScript", category: "Programming Languages", level: 5, visible: true, order: 0 },
    { name: "TypeScript", category: "Programming Languages", level: 5, visible: true, order: 1 },
    { name: "Python", category: "Programming Languages", level: 4, visible: true, order: 2 },
    { name: "React", category: "Frameworks", level: 5, visible: true, order: 0 },
    { name: "Next.js", category: "Frameworks", level: 5, visible: true, order: 1 },
    { name: "Node.js", category: "Web Development", level: 4, visible: true, order: 0 },
    { name: "REST APIs", category: "Web Development", level: 5, visible: true, order: 1 },
    { name: "PostgreSQL", category: "Databases", level: 4, visible: true, order: 0 },
    { name: "Firebase", category: "Databases", level: 4, visible: true, order: 1 },
    { name: "TensorFlow", category: "AI/ML", level: 3, visible: true, order: 0 },
    { name: "Git", category: "Tools", level: 5, visible: true, order: 0 },
    { name: "Docker", category: "Tools", level: 4, visible: true, order: 1 },
  ];
  for (const skill of skills) {
    await addDoc(collection(db, "skills"), { ...skill, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  // Projects
  const projects = [
    {
      title: "AI Resume Analyzer",
      slug: "ai-resume-analyzer",
      description: "An AI-powered tool that analyzes resumes and provides actionable feedback for job seekers.",
      longDescription: "Built a full-stack application that uses natural language processing to parse resumes, identify strengths and gaps, and suggest improvements tailored to specific job descriptions. Includes a scoring system and exportable feedback reports.",
      technologies: ["React", "Node.js", "Python", "OpenAI API", "PostgreSQL"],
      imageUrl: "",
      githubUrl: "https://github.com/alexjohnson/ai-resume-analyzer",
      liveUrl: "https://ai-resume-analyzer.example.com",
      category: "AI/ML",
      featured: true,
      visible: true,
      order: 0,
      startDate: "2024-01-01",
      endDate: "2024-04-01",
    },
    {
      title: "TaskFlow — Project Management App",
      slug: "taskflow-project-management",
      description: "A collaborative project management tool with real-time updates and kanban boards.",
      longDescription: "TaskFlow helps small teams organize their work with drag-and-drop kanban boards, real-time collaboration, and deadline tracking. Built with a focus on performance and a clean, distraction-free UI.",
      technologies: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
      imageUrl: "",
      githubUrl: "https://github.com/alexjohnson/taskflow",
      liveUrl: "https://taskflow.example.com",
      category: "Web App",
      featured: true,
      visible: true,
      order: 1,
      startDate: "2023-06-01",
      endDate: "2023-09-01",
    },
    {
      title: "Weather Dashboard",
      slug: "weather-dashboard",
      description: "A responsive weather dashboard with 7-day forecasts and interactive maps.",
      technologies: ["React", "Chart.js", "OpenWeather API"],
      imageUrl: "",
      githubUrl: "https://github.com/alexjohnson/weather-dashboard",
      liveUrl: "",
      category: "Web App",
      featured: false,
      visible: true,
      order: 2,
      startDate: "2023-02-01",
      endDate: "2023-03-01",
    },
  ];
  for (const project of projects) {
    await addDoc(collection(db, "projects"), { ...project, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  // Certifications
  const certifications = [
    {
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023-08-01",
      credentialId: "AWS-SAA-123456",
      credentialUrl: "https://www.credly.com/badges/example",
      imageUrl: "",
      visible: true,
      order: 0,
    },
    {
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta (Coursera)",
      issueDate: "2022-11-01",
      credentialId: "META-FE-789012",
      credentialUrl: "https://www.coursera.org/verify/example",
      imageUrl: "",
      visible: true,
      order: 1,
    },
  ];
  for (const cert of certifications) {
    await addDoc(collection(db, "certifications"), { ...cert, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  console.log("✓ Demo data seeded successfully!");
  console.log("Visit /admin/login to manage this content.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
