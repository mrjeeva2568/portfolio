"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import type { Skill } from "@/types";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="What I work with" title="Skills & Technologies" />
      {skills.length === 0 ? (
        <EmptyState icon={Code2} title="No skills added yet" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(grouped).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-lg border bg-card p-5"
            >
              <h3 className="mb-4 font-semibold text-primary">{category}</h3>
              <div className="space-y-3">
                {items.map((skill) => (
                  <div key={skill.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    {skill.level ? (
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
