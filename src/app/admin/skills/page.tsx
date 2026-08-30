"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Code2 } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { LoadingPage, LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { skillSchema, type SkillFormData } from "@/lib/validations";
import { getSkills, addSkill, updateSkill, deleteSkill } from "@/lib/firebase/firestore";
import { SKILL_CATEGORIES, type Skill } from "@/types";
import { toast } from "sonner";

export default function AdminSkillsPage() {
  const [items, setItems] = useState<(Skill & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<(Skill & { id: string }) | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<(Skill & { id: string }) | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormData>({ resolver: zodResolver(skillSchema) });

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setItems(await getSkills());
    } catch (error) {
      console.error("Skills load error:", error);
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
    reset({ name: "", category: SKILL_CATEGORIES[0], level: 3, visible: true, order: items.length });
    setDialogOpen(true);
  };

  const openEdit = (item: Skill & { id: string }) => {
    setEditing(item);
    reset(item);
    setDialogOpen(true);
  };

  const onSubmit = async (data: SkillFormData) => {
    try {
      if (editing) {
        await updateSkill(editing.id, data);
        toast.success("Skill updated successfully ✓");
      } else {
        await addSkill(data as Omit<Skill, "id">);
        toast.success("Skill added successfully ✓");
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
      await deleteSkill(deleteTarget.id);
      toast.success("Deleted successfully");
      load();
    } catch {
      toast.error("Unable to delete. Please try again.");
    }
  };

  const handleToggleVisible = async (item: Skill & { id: string }) => {
    try {
      await updateSkill(item.id, { visible: !item.visible });
      load();
    } catch {
      toast.error("Unable to update visibility");
    }
  };

  return (
    <AdminLayoutShell title="Skills">
      <div className="mb-4 flex justify-end">
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      </div>

      {loading ? (
        <LoadingPage message="Loading skills..." />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No skills added yet"
          description="Add the technologies and tools you work with."
          actionLabel="Add Skill"
          onAction={openAdd}
        />
      ) : (
        <DataTable
          items={items}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onToggleVisible={handleToggleVisible}
          columns={[
            { header: "Name", render: (i) => <span className="font-medium">{i.name}</span> },
            { header: "Category", render: (i) => i.category },
            { header: "Level", render: (i) => (i.level ? `${i.level}/5` : "—") },
          ]}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Skill" : "Add Skill"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="name">Skill Name</Label>
              <Input id="name" {...register("name")} placeholder="React" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
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
                      {SKILL_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="level">Proficiency Level (1-5, optional)</Label>
              <Input id="level" type="number" min={1} max={5} {...register("level", { valueAsNumber: true })} />
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
        title="Delete skill?"
        description={`This will permanently remove "${deleteTarget?.name}" from your portfolio. This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
      />
    </AdminLayoutShell>
  );
}
