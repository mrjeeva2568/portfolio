"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Certification } from "@/types";

export function CertificationCard({ cert, index = 0 }: { cert: Certification; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/10 p-2.5 text-primary">
              <Award className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold leading-tight">{cert.name}</h3>
              <p className="text-sm text-muted-foreground">{cert.issuer}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Issued {formatDate(cert.issueDate)}</p>
          {cert.credentialId && (
            <p className="text-xs text-muted-foreground">Credential ID: {cert.credentialId}</p>
          )}
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              View Credential <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
