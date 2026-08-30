"use client";

import { useEffect, useState } from "react";
import { Eye, Download } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/shared/file-uploader";
import { LoadingPage } from "@/components/shared/loading-spinner";
import { getProfile, saveProfile } from "@/lib/firebase/firestore";
import { toast } from "sonner";

export default function AdminResumePage() {
  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        setResumeUrl(profile?.resumeUrl || "");
      } catch {
        toast.error("Failed to load resume");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = async (url: string) => {
    setResumeUrl(url);
    try {
      await saveProfile({ resumeUrl: url });
      toast.success(url ? "Resume uploaded successfully ✓" : "Resume removed");
    } catch {
      toast.error("Unable to save resume. Please try again.");
    }
  };

  return (
    <AdminLayoutShell title="Resume">
      {loading ? (
        <LoadingPage message="Loading resume..." />
      ) : (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle className="text-base">Resume File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader value={resumeUrl} onChange={handleChange} folder="resume" accept="pdf" label="Upload your resume (PDF)" />
            {resumeUrl && (
              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" /> View
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={resumeUrl} download>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </AdminLayoutShell>
  );
}
