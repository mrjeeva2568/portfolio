import { Navbar } from "@/components/portfolio/navbar";
import { Footer } from "@/components/portfolio/footer";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { ContactForm } from "@/components/portfolio/contact-form";
import { getProfile } from "@/lib/supabase/database";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/shared/brand-icons";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact | Developer Portfolio",
  description: "Get in touch with me.",
};

export default async function ContactPage() {
  const profile = await getProfile().catch(() => null);

  const links = [
    { href: profile?.email ? `mailto:${profile.email}` : undefined, icon: Mail, label: profile?.email },
    { href: profile?.github, icon: GithubIcon, label: "GitHub" },
    { href: profile?.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
    { href: profile?.twitter, icon: TwitterIcon, label: "Twitter" },
  ].filter((l) => l.href);

  return (
    <>
      <Navbar name={profile?.name} />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Let's connect"
            title="Get In Touch"
            description="Have a project in mind or just want to say hi? Send me a message."
          />
          <div className="grid gap-10 md:grid-cols-5">
            <div className="md:col-span-2 space-y-4">
              {links.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border p-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-5 w-5" /> {label}
                </a>
              ))}
            </div>
            <div className="md:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
