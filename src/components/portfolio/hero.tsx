"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, Download, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/shared/brand-icons";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

export function Hero({ profile }: { profile: Profile | null }) {
  const socials = [
    { href: profile?.github, icon: GithubIcon, label: "GitHub" },
    { href: profile?.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
    { href: profile?.twitter, icon: TwitterIcon, label: "Twitter" },
    { href: profile?.website, icon: Globe, label: "Website" },
  ].filter((s) => s.href);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_theme(colors.primary/8%),_transparent_60%)]" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-24 sm:px-6 md:flex-row md:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-left"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Welcome to my portfolio
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {profile?.name || "Your Name"}
          </h1>
          <p className="mt-3 text-xl font-medium text-muted-foreground sm:text-2xl">
            {profile?.title || "Software Engineer"}
          </p>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground md:mx-0">
            {profile?.bio || "A short introduction about yourself goes here. Edit this from the Admin Panel."}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <Button asChild size="lg">
              <Link href="/projects">
                View My Work <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {profile?.resumeUrl && (
              <Button asChild size="lg" variant="outline">
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="mr-2 h-4 w-4" /> Download Resume
                </a>
              </Button>
            )}
          </div>

          {socials.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-4 md:justify-start">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border p-2.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex-shrink-0"
        >
          <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary/10 shadow-xl sm:h-64 sm:w-64">
            {profile?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.imageUrl} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-4xl font-bold text-muted-foreground">
                {profile?.name?.[0] || "?"}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
