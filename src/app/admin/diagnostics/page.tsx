"use client";

import { useState } from "react";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checkFirebaseHealth } from "@/lib/firebase/health-check";
import { useAuth } from "@/lib/auth/context";

export default function AdminDiagnosticsPage() {
  const { user, loading } = useAuth();
  const [results, setResults] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  const runDiagnostics = async () => {
    setChecking(true);
    const result = await checkFirebaseHealth();
    setResults(result);
    setChecking(false);
  };

  return (
    <AdminLayoutShell title="Diagnostics">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-4 font-mono text-sm dark:bg-slate-900">
              <div>Loading: {loading ? "true" : "false"}</div>
              <div>User Email: {user?.email || "Not authenticated"}</div>
              <div>User ID: {user?.uid || "N/A"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Firebase Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runDiagnostics} disabled={checking}>
              {checking ? "Running..." : "Run Diagnostics"}
            </Button>

            {results && (
              <div className={`rounded-lg p-4 font-mono text-sm ${
                results.success
                  ? "bg-green-50 dark:bg-green-900"
                  : "bg-red-50 dark:bg-red-900"
              }`}>
                <div>Status: {results.success ? "✅ Connected" : "❌ Failed"}</div>
                <div>Auth: {results.auth ? "✅" : "❌"}</div>
                <div>Firestore: {results.firestoreConnected ? "✅" : "❌"}</div>
                {results.error && <div className="mt-2 text-red-600 dark:text-red-400">Error: {results.error}</div>}
                {results.userEmail && <div className="mt-2">Email: {results.userEmail}</div>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browser Console</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Press F12 to open browser developer tools and check the Console tab for detailed error messages.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayoutShell>
  );
}
