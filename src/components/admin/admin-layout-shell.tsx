"use client";

import { ProtectedRoute } from "./protected-route";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

export function AdminLayoutShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden w-64 flex-shrink-0 md:block">
          <AdminSidebar />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader title={title} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
