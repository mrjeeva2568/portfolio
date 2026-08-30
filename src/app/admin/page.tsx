"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { LoadingPage } from "@/components/shared/loading-spinner";

export default function AdminRootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(user ? "/admin/dashboard" : "/admin/login");
    }
  }, [user, loading, router]);

  return <LoadingPage />;
}
