import { Timestamp } from "firebase/firestore";

export interface Profile {
  id?: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  imageUrl?: string;
  resumeUrl?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  seoTitle?: string;
  seoDescription?: string;
  portfolioStatus: "published" | "draft";
  updatedAt?: Timestamp;
}

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  visible: boolean;
  order: number;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
  visible: boolean;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  level?: number; // 1-5
  visible: boolean;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Project {
  id?: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  featured: boolean;
  visible: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  visible: boolean;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt?: Timestamp;
}

export interface Settings {
  portfolioTitle: string;
  portfolioStatus: "published" | "draft";
  maintenanceMode: boolean;
  allowContactMessages: boolean;
}

export const SKILL_CATEGORIES = [
  "Programming Languages",
  "Web Development",
  "Frameworks",
  "Databases",
  "AI/ML",
  "Tools",
  "Cloud & DevOps",
  "Other",
] as const;

export const PROJECT_CATEGORIES = [
  "Web App",
  "Mobile App",
  "AI/ML",
  "Data Science",
  "Open Source",
  "Other",
] as const;
