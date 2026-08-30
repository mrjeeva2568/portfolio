"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Code2,
  Award,
  GraduationCap,
  Globe,
  FileText,
  Plus,
  UserCog,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import {
  getProjects,
  getSkills,
  getCertifications,
  getEducation,
  getProfile,
} from "@/lib/firebase/firestore";
import type { Project } from "@/types";

interface Stats {
  projects: number;
  skills: number;
  certifications: number;
  education: number;
  portfolioStatus: string;
  resumeStatus: string;
  recentProjects: Project[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    setError(false);
    try {
      const [projects, skills, certifications, education, profile] = await Promise.all([
        getProjects(),
        getSkills(),
        getCertifications(),
        getEducation(),
        getProfile(),
      ]);
      
      console.log("Dashboard data loaded:", {
        projects: projects.length,
        skills: skills.length,
        certifications: certifications.length,
        education: education.length,
        profile: !!profile,
      });
      
      setStats({
        projects: projects.length,
        skills: skills.length,
        certifications: certifications.length,
        education: education.length,
        portfolioStatus: profile?.portfolioStatus || "draft",
        resumeStatus: profile?.resumeUrl ? "Uploaded" : "Not uploaded",
        recentProjects: projects.slice(0, 5),
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      // Show a default state with 0 items instead of error
      setStats({
        projects: 0,
        skills: 0,
        certifications: 0,
        education: 0,
        portfolioStatus: "draft",
        resumeStatus: "Not uploaded",
        recentProjects: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = stats
    ? [
        { label: "Projects", value: stats.projects, icon: FolderKanban, href: "/admin/projects" },
        { label: "Skills", value: stats.skills, icon: Code2, href: "/admin/skills" },
        { label: "Certifications", value: stats.certifications, icon: Award, href: "/admin/certifications" },
        { label: "Education", value: stats.education, icon: GraduationCap, href: "/admin/education" },
        { label: "Portfolio", value: stats.portfolioStatus, icon: Globe, href: "/admin/settings" },
        { label: "Resume", value: stats.resumeStatus, icon: FileText, href: "/admin/resume" },
      ]
    : [];

  const quickActions = [
    { label: "Add Project", href: "/admin/projects", icon: Plus },
    { label: "Add Certification", href: "/admin/certifications", icon: Plus },
    { label: "Add Skill", href: "/admin/skills", icon: Plus },
    { label: "Edit Profile", href: "/admin/profile", icon: UserCog },
  ];

  return (
    <AdminLayoutShell title="Dashboard">
      {loading ? (
        <LoadingPage message="Loading dashboard..." />
      ) : error ? (
        <ErrorState description="Unable to load dashboard stats." onRetry={loadStats} />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            {statCards.map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-2 p-4">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold capitalize">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <Button key={action.label} asChild variant="outline" size="sm">
                  <Link href={action.href}>
                    <action.icon className="mr-2 h-4 w-4" /> {action.label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects added yet.</p>
              ) : (
                <div className="divide-y">
                  {stats?.recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-xs text-muted-foreground">{project.category}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          project.visible ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {project.visible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayoutShell>
  );
}
