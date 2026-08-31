import { Navbar } from "@/components/portfolio/navbar";
import { Footer } from "@/components/portfolio/footer";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { ProjectCard } from "@/components/portfolio/project-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getProfile, getProjects } from "@/lib/supabase/database";
import { FolderKanban } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects | Developer Portfolio",
  description: "Explore my projects and technical work.",
};

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([
    getProfile().catch(() => null),
    getProjects(true).catch(() => []),
  ]);

  console.log("Projects page:", { projectCount: projects.length, projects });

  return (
    <>
      <Navbar name={profile?.name} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Portfolio"
            title="Projects"
            description="A collection of things I've built and shipped."
          />
          {projects.length === 0 ? (
            <EmptyState icon={FolderKanban} title="No projects published yet" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
