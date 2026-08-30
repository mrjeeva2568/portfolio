"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/shared/file-uploader";
import { LoadingPage, LoadingSpinner } from "@/components/shared/loading-spinner";
import { profileSchema, type ProfileFormData } from "@/lib/validations";
import { getProfile, saveProfile } from "@/lib/firebase/firestore";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          reset({
            name: profile.name || "",
            title: profile.title || "",
            bio: profile.bio || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            github: profile.github || "",
            linkedin: profile.linkedin || "",
            twitter: profile.twitter || "",
            website: profile.website || "",
            seoTitle: profile.seoTitle || "",
            seoDescription: profile.seoDescription || "",
          });
          setImageUrl(profile.imageUrl || "");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await saveProfile({ ...data, imageUrl });
      toast.success("Profile saved successfully ✓");
    } catch (error) {
      console.error("Profile save error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Unable to save profile: ${errorMessage}`);
    }
  };

  return (
    <AdminLayoutShell title="Profile">
      {loading ? (
        <LoadingPage message="Loading profile..." />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6" noValidate>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader value={imageUrl} onChange={setImageUrl} folder="profile" accept="image" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input id="title" {...register("title")} placeholder="Full-Stack Developer" />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio / Summary</Label>
                <Textarea id="bio" rows={4} {...register("bio")} />
                {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} placeholder="San Francisco, CA" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="github">GitHub URL</Label>
                <Input id="github" {...register("github")} placeholder="https://github.com/username" />
                {errors.github && <p className="text-xs text-destructive">{errors.github.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input id="linkedin" {...register("linkedin")} placeholder="https://linkedin.com/in/username" />
                {errors.linkedin && <p className="text-xs text-destructive">{errors.linkedin.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="twitter">Twitter/X URL</Label>
                <Input id="twitter" {...register("twitter")} placeholder="https://twitter.com/username" />
                {errors.twitter && <p className="text-xs text-destructive">{errors.twitter.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website">Website URL</Label>
                <Input id="website" {...register("website")} placeholder="https://yourwebsite.com" />
                {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input id="seoTitle" {...register("seoTitle")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea id="seoDescription" rows={3} {...register("seoDescription")} />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting && <LoadingSpinner size={16} className="mr-2" />}
            Save Profile
          </Button>
        </form>
      )}
    </AdminLayoutShell>
  );
}
