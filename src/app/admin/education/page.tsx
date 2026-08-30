"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, GraduationCap } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingPage, LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { educationSchema, type EducationFormData } from "@/lib/validations";
import {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} from "@/lib/firebase/firestore";
import type { Education } from "@/types";
import { toast } from "sonner";

export default function AdminEducationPage() {
  const [items, setItems] = useState<(Education & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<(Education & { id: string }) | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<(Education & { id: string }) | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormData>({ resolver: zodResolver(educationSchema) });

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setItems(await getEducation());
    } catch (error) {
      console.error("Education load error:", error);
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
    reset({ degree: "", institution: "", location: "", startDate: "", endDate: "", grade: "", description: "", visible: true, order: items.length });
    setDialogOpen(true);
  };

  const openEdit = (item: Education & { id: string }) => {
    setEditing(item);
    reset(item);
    setDialogOpen(true);
  };

  const onSubmit = async (data: EducationFormData) => {
    try {
      if (editing) {
        await updateEducation(editing.id, data);
        toast.success("Education updated successfully ✓");
      } else {
        await addEducation(data as Omit<Education, "id">);
        toast.success("Education added successfully ✓");
      }
      setDialogOpen(false);
      load();
    } catch (error) {
      console.error("Submit error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Unable to save: ${errorMsg}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEducation(deleteTarget.id);
      toast.success("Deleted successfully");
      load();
    } catch {
      toast.error("Unable to delete. Please try again.");
    }
  };

  const handleToggleVisible = async (item: Education & { id: string }) => {
    try {
      await updateEducation(item.id, { visible: !item.visible });
      load();
    } catch {
      toast.error("Unable to update visibility");
    }
  };

  return (
    <AdminLayoutShell title="Education">
      <div className="mb-4 flex justify-end">
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Education
        </Button>
      </div>

      {loading ? (
        <LoadingPage message="Loading education..." />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education entries yet"
          description="Add your degrees and academic background."
          actionLabel="Add Education"
          onAction={openAdd}
        />
      ) : (
        <DataTable
          items={items}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onToggleVisible={handleToggleVisible}
          columns={[
            { header: "Degree", render: (i) => <span className="font-medium">{i.degree}</span> },
            { header: "Institution", render: (i) => i.institution },
            { header: "Duration", render: (i) => `${i.startDate} — ${i.endDate || "Present"}` },
            { header: "Grade", render: (i) => i.grade || "—" },
          ]}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Education" : "Add Education"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="degree">Degree</Label>
              <Input id="degree" {...register("degree")} placeholder="B.S. in Computer Science" />
              {errors.degree && <p className="text-xs text-destructive">{errors.degree.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="institution">Institution</Label>
              <Input id="institution" {...register("institution")} />
              {errors.institution && <p className="text-xs text-destructive">{errors.institution.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="grade">Grade/CGPA</Label>
              <Input id="grade" {...register("grade")} placeholder="3.8 GPA" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...register("description")} />
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
        title="Delete education entry?"
        description={`This will permanently remove "${deleteTarget?.degree}" from your portfolio. This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
      />
    </AdminLayoutShell>
  );
}
