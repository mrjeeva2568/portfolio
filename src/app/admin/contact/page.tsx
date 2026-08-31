"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingPage } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { getMessages, markMessageRead, deleteMessage } from "@/lib/supabase/database";
import type { ContactMessage } from "@/types";
import { toast } from "sonner";

export default function AdminContactPage() {
  const [messages, setMessages] = useState<(ContactMessage & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<(ContactMessage & { id: string }) | null>(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      setMessages(await getMessages());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkRead = async (msg: ContactMessage & { id: string }) => {
    try {
      await markMessageRead(msg.id);
      load();
    } catch {
      toast.error("Unable to update message");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMessage(deleteTarget.id);
      toast.success("Message deleted");
      load();
    } catch {
      toast.error("Unable to delete message");
    }
  };

  return (
    <AdminLayoutShell title="Messages">
      {loading ? (
        <LoadingPage message="Loading messages..." />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : messages.length === 0 ? (
        <EmptyState icon={Mail} title="No messages yet" description="Contact form submissions will appear here." />
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card key={msg.id} className={!msg.read ? "border-primary/50" : ""}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{msg.subject}</p>
                      {!msg.read && <Badge>New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {msg.name} • {msg.email}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleMarkRead(msg)}
                      aria-label="Mark as read"
                      disabled={msg.read}
                    >
                      <MailOpen className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(msg)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm">{msg.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete message?"
        description="This will permanently delete this message. This action cannot be undone."
        onConfirm={handleDelete}
        confirmLabel="Delete"
      />
    </AdminLayoutShell>
  );
}
