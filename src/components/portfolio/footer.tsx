import Link from "next/link";
import { Mail, Globe } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/shared/brand-icons";
import type { Profile } from "@/types";

export function Footer({ profile }: { profile: Profile | null }) {
  const year = new Date().getFullYear();

  const socials = [
    { href: profile?.github, icon: GithubIcon, label: "GitHub" },
    { href: profile?.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
    { href: profile?.twitter, icon: TwitterIcon, label: "Twitter" },
    { href: profile?.website, icon: Globe, label: "Website" },
    { href: profile?.email ? `mailto:${profile.email}` : undefined, icon: Mail, label: "Email" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {year} {profile?.name || "Portfolio"}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {socials.map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={label}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
