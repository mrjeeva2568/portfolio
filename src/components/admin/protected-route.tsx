"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { LoadingPage } from "@/components/shared/loading-spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) return <LoadingPage message="Checking authentication..." />;
  if (!user) return <LoadingPage message="Redirecting to login..." />;

  return <>{children}</>;
}
