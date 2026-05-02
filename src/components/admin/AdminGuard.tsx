import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export const AdminGuard = ({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { user, isAdmin, isStaff, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const allowed = requireAdmin ? isAdmin : isStaff;
  if (!allowed) {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">صلاحية غير كافية 🔒</h1>
          <p className="text-muted-foreground">حسابك مسجّل لكن غير مصرّح له بدخول لوحة التحكم.</p>
          <p className="text-sm text-muted-foreground mt-2">تواصل مع المسؤول لمنحك الصلاحية.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
