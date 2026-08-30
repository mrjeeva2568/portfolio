import { Navbar } from "@/components/portfolio/navbar";
import { Footer } from "@/components/portfolio/footer";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { getProfile } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About | Developer Portfolio",
};

export default async function AboutPage() {
  const profile = await getProfile().catch(() => null);

  return (
    <>
      <Navbar name={profile?.name} />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Learn more" title="About Me" />
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>{profile?.bio || "Add your professional summary from the Admin Panel."}</p>
          </div>
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
