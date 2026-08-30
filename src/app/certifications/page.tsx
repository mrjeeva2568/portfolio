import { Navbar } from "@/components/portfolio/navbar";
import { Footer } from "@/components/portfolio/footer";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { CertificationCard } from "@/components/portfolio/certification-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getProfile, getCertifications } from "@/lib/firebase/firestore";
import { Award } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Certifications | Developer Portfolio",
  description: "Professional certifications and credentials.",
};

export default async function CertificationsPage() {
  const [profile, certifications] = await Promise.all([
    getProfile().catch(() => null),
    getCertifications(true).catch(() => []),
  ]);

  console.log("Certifications page:", { certCount: certifications.length, certifications });

  return (
    <>
      <Navbar name={profile?.name} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Credentials"
            title="Certifications"
            description="Courses and certifications I've completed."
          />
          {certifications.length === 0 ? (
            <EmptyState icon={Award} title="No certifications published yet" />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert, i) => (
                <CertificationCard key={cert.id} cert={cert} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
