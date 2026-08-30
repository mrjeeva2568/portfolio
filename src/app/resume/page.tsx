import { Navbar } from "@/components/portfolio/navbar";
import { Footer } from "@/components/portfolio/footer";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { getProfile } from "@/lib/firebase/firestore";
import { Download, Eye, FileText } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Resume | Developer Portfolio",
};

export default async function ResumePage() {
  const profile = await getProfile().catch(() => null);

  return (
    <>
      <Navbar name={profile?.name} />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="My Resume" title="Resume" align="center" />
          {profile?.resumeUrl ? (
            <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-10 text-center">
              <FileText className="h-12 w-12 text-primary" />
              <p className="text-muted-foreground">
                View or download my latest resume below.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" /> View Resume
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={profile.resumeUrl} download>
                    <Download className="mr-2 h-4 w-4" /> Download Resume
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState icon={FileText} title="Resume not available yet" description="Check back soon." />
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
