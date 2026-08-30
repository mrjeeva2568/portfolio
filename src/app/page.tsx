import { Navbar } from "@/components/portfolio/navbar";
import { Footer } from "@/components/portfolio/footer";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { EducationSection } from "@/components/portfolio/education-section";
import { SkillsSection } from "@/components/portfolio/skills-section";
import { getProfile, getEducation, getSkills } from "@/lib/firebase/firestore";

export const revalidate = 0;

export default async function HomePage() {
  const [profile, education, skills] = await Promise.all([
    getProfile().catch(() => null),
    getEducation().catch(() => []),
    getSkills().catch(() => []),
  ]);

  // Filter visible items - treat undefined visible as false (not visible by default)
  const visibleEducation = education.filter((e) => e.visible === true);
  const visibleSkills = skills.filter((s) => s.visible === true);

  console.log("Homepage data:", {
    education: education.length,
    visibleEducation: visibleEducation.length,
    skills: skills.length,
    visibleSkills: visibleSkills.length,
    educationSample: education[0],
  });

  return (
    <>
      <Navbar name={profile?.name} />
      <main className="flex-1">
        <Hero profile={profile} />
        <About profile={profile} />
        <EducationSection items={visibleEducation} />
        <SkillsSection skills={visibleSkills} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
