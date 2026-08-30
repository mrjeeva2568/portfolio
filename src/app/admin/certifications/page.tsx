"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Award } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FileUploader } from "@/components/shared/file-uploader";
import { LoadingPage, LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { certificationSchema, type CertificationFormData } from "@/lib/validations";
import {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
} from "@/lib/firebase/firestore";
import type { Certification } from "@/types";
import { toast } from "sonner";

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<(Certification & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<(Certification & { id: string }) | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<(Certification & { id: string }) | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificationFormData>({ resolver: zodResolver(certificationSchema) });

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setItems(await getCertifications());
    } catch (error) {
      console.error("Certifications load error:", error);
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
    reset({
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      visible: true,
      order: items.length,
    });
    setDialogOpen(true);
  };

  const openEdit = (item: Certification & { id: string }) => {
    setEditing(item);
    setImageUrl(item.imageUrl || "");
    reset(item);
    setDialogOpen(true);
  };

  const onSubmit = async (data: CertificationFormData) => {
    try {
      const payload = { ...data, imageUrl };
      if (editing) {
        await updateCertification(editing.id, payload);
        toast.success("Certification updated successfully ✓");
      } else {
        await addCertification(payload as Omit<Certification, "id">);
        toast.success("Certification added successfully ✓");
      }
      setDialogOpen(false);
      load();
    } catch {
      toast.error("Unable to save. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCertification(deleteTarget.id);
      toast.success("Deleted successfully");
      load();
    } catch {
      toast.error("Unable to delete. Please try again.");
    }
  };

  const handleToggleVisible = async (item: Certification & { id: string }) => {
    try {
      await updateCertification(item.id, { visible: !item.visible });
      load();
    } catch {
      toast.error("Unable to update visibility");
    }
  };

  return (
    <AdminLayoutShell title="Certifications">
      <div className="mb-4 flex justify-end">
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Certification
        </Button>
      </div>

      {loading ? (
        <LoadingPage message="Loading certifications..." />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certifications added yet"
          description="Add your professional certifications and credentials."
          actionLabel="Add Certification"
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
            { header: "Issuer", render: (i) => i.issuer },
            { header: "Issue Date", render: (i) => i.issueDate },
          ]}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Certification" : "Add Certification"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FileUploader value={imageUrl} onChange={setImageUrl} folder="certifications" accept="image" label="Certificate Image (optional)" />

            <div className="space-y-1.5">
              <Label htmlFor="name">Certification Name</Label>
              <Input id="name" {...register("name")} placeholder="AWS Certified Solutions Architect" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="issuer">Issuing Organization</Label>
              <Input id="issuer" {...register("issuer")} placeholder="Amazon Web Services" />
              {errors.issuer && <p className="text-xs text-destructive">{errors.issuer.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input id="issueDate" type="date" {...register("issueDate")} />
                {errors.issueDate && <p className="text-xs text-destructive">{errors.issueDate.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
                <Input id="expiryDate" type="date" {...register("expiryDate")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="credentialId">Credential ID (optional)</Label>
              <Input id="credentialId" {...register("credentialId")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="credentialUrl">Credential URL (optional)</Label>
              <Input id="credentialUrl" {...register("credentialUrl")} />
              {errors.credentialUrl && <p className="text-xs text-destructive">{errors.credentialUrl.message}</p>}
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
        title="Delete certification?"
        description={`This will permanently remove "${deleteTarget?.name}" from your portfolio. This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
      />
    </AdminLayoutShell>
  );
}
