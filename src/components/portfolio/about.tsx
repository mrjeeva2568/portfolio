"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";
import type { Profile } from "@/types";

export function About({ profile }: { profile: Profile | null }) {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeading eyebrow="Get to know me" title="About Me" />
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {profile?.bio || "Add your professional summary from the Admin Panel."}
            </p>
          </div>
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Quick Info</h3>
            <dl className="space-y-2 text-sm">
              {profile?.location && (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="text-right font-medium">{profile.location}</dd>
                </div>
              )}
              {profile?.email && (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="text-right font-medium">{profile.email}</dd>
                </div>
              )}
              {profile?.phone && (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="text-right font-medium">{profile.phone}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
