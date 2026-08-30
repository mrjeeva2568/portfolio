import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/brand-icons";
import { Navbar } from "@/components/portfolio/navbar";
import { Footer } from "@/components/portfolio/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProfile, getProjects } from "@/lib/firebase/firestore";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 0;

async function getProjectBySlug(slug: string) {
  const projects = await getProjects(true).catch(() => []);
  return projects.find((p) => p.slug === slug) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Projects`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [profile, project] = await Promise.all([getProfile().catch(() => null), getProjectBySlug(slug)]);

  if (!project) notFound();

  return (
    <>
      <Navbar name={profile?.name} />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>

          {project.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageUrl}
              alt={project.title}
              className="mb-8 aspect-video w-full rounded-lg object-cover"
            />
          )}

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{project.category}</Badge>
            {project.featured && <Badge>Featured</Badge>}
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>

          {(project.startDate || project.endDate) && (
            <p className="mt-2 text-sm text-muted-foreground">
              {project.startDate && formatDate(project.startDate)}
              {project.endDate ? ` — ${formatDate(project.endDate)}` : ""}
            </p>
          )}

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {project.longDescription || project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.githubUrl && (
              <Button asChild variant="outline">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="mr-2 h-4 w-4" /> View Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
