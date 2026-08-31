"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, FolderKanban, Star } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { FileUploader } from "@/components/shared/file-uploader";
import { LoadingPage, LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { projectSchema, type ProjectFormData } from "@/lib/validations";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/supabase/database";
import { PROJECT_CATEGORIES, type Project } from "@/types";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminProjectsPage() {
  const [items, setItems] = useState<(Project & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<(Project & { id: string }) | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<(Project & { id: string }) | null>(null);
  const [techInput, setTechInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({ resolver: zodResolver(projectSchema) });

  const technologies = watch("technologies") || [];
  const titleValue = watch("title");

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setItems(await getProjects());
    } catch (error) {
      console.error("Projects load error:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setImageUrl("");
    setTechInput("");
    reset({
      title: "",
      slug: "",
      description: "",
      longDescription: "",
      technologies: [],
      githubUrl: "",
      liveUrl: "",
      category: PROJECT_CATEGORIES[0],
      featured: false,
      visible: true,
      order: items.length,
      startDate: "",
      endDate: "",
    });
    setDialogOpen(true);
  };

  const openEdit = (item: Project & { id: string }) => {
    setEditing(item);
    setImageUrl(item.imageUrl || "");
    setTechInput("");
    reset(item);
    setDialogOpen(true);
  };

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !technologies.includes(tech)) {
      setValue("technologies", [...technologies, tech]);
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setValue("technologies", technologies.filter((t) => t !== tech));
  };

  // Auto-generate slug from title if not editing
  useEffect(() => {
    if (!editing && titleValue) {
      setValue("slug", slugify(titleValue));
    }
  }, [titleValue, editing, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const payload = { ...data, imageUrl };
      if (editing) {
        await updateProject(editing.id, payload);
        toast.success("Project updated successfully ✓");
      } else {
        await addProject(payload as Omit<Project, "id">);
        toast.success("Project added successfully ✓");
      }
      setDialogOpen(false);
      load();
    } catch {
      toast.error("Unable to save project. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject(deleteTarget.id);
      toast.success("Deleted successfully");
      load();
    } catch {
      toast.error("Unable to delete. Please try again.");
    }
  };

  const handleToggleVisible = async (item: Project & { id: string }) => {
    try {
      await updateProject(item.id, { visible: !item.visible });
      load();
    } catch {
      toast.error("Unable to update visibility");
    }
  };

  const handleToggleFeatured = async (item: Project & { id: string }) => {
    try {
      await updateProject(item.id, { featured: !item.featured });
      load();
    } catch {
      toast.error("Unable to update featured status");
    }
  };

  return (
    <AdminLayoutShell title="Projects">
      <div className="mb-4 flex justify-end">
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      {loading ? (
        <LoadingPage message="Loading projects..." />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects added yet"
          description="Showcase your work by adding your first project."
          actionLabel="Add Project"
          onAction={openAdd}
        />
      ) : (
        <DataTable
          items={items}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onToggleVisible={handleToggleVisible}
          columns={[
            { header: "Title", render: (i) => <span className="font-medium">{i.title}</span> },
            { header: "Category", render: (i) => i.category },
            {
              header: "Featured",
              render: (i) => (
                <button onClick={() => handleToggleFeatured(i)} aria-label="Toggle featured">
                  <Star className={`h-4 w-4 ${i.featured ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </button>
              ),
            },
          ]}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FileUploader value={imageUrl} onChange={setImageUrl} folder="projects" accept="image" label="Project Image" />

            <div className="space-y-1.5">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" {...register("title")} placeholder="AI Resume Analyzer" />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">URL Slug</Label>
              <Input id="slug" {...register("slug")} placeholder="ai-resume-analyzer" />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Short Description</Label>
              <Textarea id="description" rows={2} {...register("description")} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="longDescription">Detailed Description (optional)</Label>
              <Textarea id="longDescription" rows={4} {...register("longDescription")} />
            </div>

            <div className="space-y-1.5">
              <Label>Technologies</Label>
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  placeholder="Type a technology and press Enter"
                />
                <Button type="button" variant="outline" onClick={addTech}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTech(tech)}>
                    {tech} ×
                  </Badge>
                ))}
              </div>
              {errors.technologies && <p className="text-xs text-destructive">{errors.technologies.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input id="githubUrl" {...register("githubUrl")} />
                {errors.githubUrl && <p className="text-xs text-destructive">{errors.githubUrl.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="liveUrl">Live Demo URL</Label>
                <Input id="liveUrl" {...register("liveUrl")} />
                {errors.liveUrl && <p className="text-xs text-destructive">{errors.liveUrl.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="featured"
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="visible"
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
                <Label>Visible on portfolio</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoadingSpinner size={16} className="mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete project?"
        description={`This will permanently remove "${deleteTarget?.title}" from your portfolio. This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
      />
    </AdminLayoutShell>
  );
}
