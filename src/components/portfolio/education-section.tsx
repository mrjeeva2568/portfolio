"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";
import type { Education } from "@/types";

export function EducationSection({ items }: { items: Education[] }) {
  return (
    <section id="education" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Academic Background" title="Education" />
      {items.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No education entries yet" />
      ) : (
        <div className="space-y-6">
          {items.map((edu, i) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative rounded-lg border bg-card p-6 pl-8"
            >
              <div className="absolute left-0 top-6 h-3 w-3 -translate-x-1/2 rounded-full bg-primary" />
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <p className="text-muted-foreground">{edu.institution}</p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : "Present"}
                </span>
              </div>
              {edu.grade && <p className="mt-2 text-sm font-medium text-primary">Grade: {edu.grade}</p>}
              {edu.description && <p className="mt-3 text-sm text-muted-foreground">{edu.description}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
