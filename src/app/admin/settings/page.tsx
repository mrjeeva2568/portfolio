"use client";

import { useEffect, useState } from "react";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LoadingPage, LoadingSpinner } from "@/components/shared/loading-spinner";
import { getSettings, saveSettings, getProfile, saveProfile } from "@/lib/firebase/firestore";
import type { Settings } from "@/types";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    portfolioTitle: "",
    portfolioStatus: "draft",
    maintenanceMode: false,
    allowContactMessages: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const [s, profile] = await Promise.all([getSettings(), getProfile()]);
        setSettings({
          portfolioTitle: s?.portfolioTitle || "",
          portfolioStatus: profile?.portfolioStatus || "draft",
          maintenanceMode: s?.maintenanceMode || false,
          allowContactMessages: s?.allowContactMessages ?? true,
        });
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        saveSettings({
          portfolioTitle: settings.portfolioTitle,
          maintenanceMode: settings.maintenanceMode,
          allowContactMessages: settings.allowContactMessages,
        }),
        saveProfile({ portfolioStatus: settings.portfolioStatus }),
      ]);
      toast.success("Settings saved successfully ✓");
    } catch {
      toast.error("Unable to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayoutShell title="Settings">
      {loading ? (
        <LoadingPage message="Loading settings..." />
      ) : (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">General</CardTitle>
              <CardDescription>Basic settings for your portfolio site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="portfolioTitle">Portfolio Title</Label>
                <Input
                  id="portfolioTitle"
                  value={settings.portfolioTitle}
                  onChange={(e) => setSettings({ ...settings, portfolioTitle: e.target.value })}
                  placeholder="John Doe — Full-Stack Developer"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publishing</CardTitle>
              <CardDescription>Control the visibility of your portfolio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Publish Portfolio</p>
                  <p className="text-sm text-muted-foreground">Make your portfolio publicly visible.</p>
                </div>
                <Switch
                  checked={settings.portfolioStatus === "published"}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, portfolioStatus: checked ? "published" : "draft" })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Temporarily disable the public site.</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Contact Messages</p>
                  <p className="text-sm text-muted-foreground">Enable the contact form on your site.</p>
                </div>
                <Switch
                  checked={settings.allowContactMessages}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowContactMessages: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving && <LoadingSpinner size={16} className="mr-2" />}
            Save Settings
          </Button>
        </div>
      )}
    </AdminLayoutShell>
  );
}
