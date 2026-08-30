"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { GithubIcon } from "@/components/shared/brand-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Project } from "@/types";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageUrl}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          {project.featured && (
            <div className="absolute right-3 top-3">
              <Badge className="gap-1">
                <Star className="h-3 w-3 fill-current" /> Featured
              </Badge>
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <Link href={`/projects/${project.slug}`}>
            <h3 className="text-lg font-semibold transition-colors hover:text-primary">{project.title}</h3>
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5 pb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="secondary" className="font-normal">
              {tech}
            </Badge>
          ))}
        </CardContent>
        <CardFooter className="gap-3 pt-0">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubIcon className="h-4 w-4" /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
