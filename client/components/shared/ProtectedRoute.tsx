"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store/store";

export function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode, 
  allowedRoles: string[] 
}) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by ensuring this only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (!isAuthenticated) {
        router.replace("/selection"); // Kick back to auth selection
      } else if (user && !allowedRoles.includes(user.role)) {
        router.replace("/"); // Kick to home if wrong role (e.g., Tenant trying to access Admin)
      }
    }
  }, [isAuthenticated, user, isClient, router, allowedRoles]);

  if (!isClient || !isAuthenticated) return null; // Show nothing while checking

  return <>{children}</>;
}