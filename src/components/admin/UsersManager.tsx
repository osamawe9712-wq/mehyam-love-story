import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, UserPlus, Shield, Trash2 } from "lucide-react";

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  roles: string[];
};

export const UsersManager = () => {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "staff">("staff");

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("id, email, full_name");
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const map: UserRow[] = (profiles ?? []).map((p) => ({
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role),
    }));
    setRows(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const grant = async (userId: string, role: "admin" | "staff") => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success("تم منح الصلاحية");
    load();
  };

  const revoke = async (userId: string, role: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as "admin" | "staff");
    if (error) return toast.error(error.message);
    toast.success("تم سحب الصلاحية");
    load();
  };

  const grantByEmail = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email) return toast.error("اكتب الإيميل");
    const { data: profile } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
    if (!profile) return toast.error("لا يوجد مستخدم بهذا الإيميل. اطلب منه إنشاء حساب أولاً.");
    await grant(profile.id, newRole);
    setNewEmail("");
  };

  if (loading) return <Loader2 className="animate-spin mx-auto my-12" />;

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <UserPlus className="h-5 w-5" /> منح صلاحية لمستخدم موجود
        </h3>
        <p className="text-sm text-muted-foreground">
          المستخدم لازم ينشئ حساب أولاً من <code className="bg-muted px-1 rounded">/admin/login</code> ثم تعطيه الصلاحية هنا.
        </p>
        <div className="flex gap-2">
          <Input
            type="email"
            dir="ltr"
            placeholder="user@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1"
          />
          <Select value={newRole} onValueChange={(v) => setNewRole(v as any)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="staff">موظف</SelectItem>
              <SelectItem value="admin">مسؤول</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={grantByEmail}>منح</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" /> المستخدمون والصلاحيات ({rows.length})
        </h3>
        <div className="space-y-2">
          {rows.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{u.full_name || "—"}</p>
                <p className="text-xs text-muted-foreground" dir="ltr">{u.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {u.roles.length === 0 && <span className="text-xs text-muted-foreground">بدون صلاحية</span>}
                {u.roles.map((r) => (
                  <span key={r} className="flex items-center gap-1 bg-accent/20 text-accent-foreground px-2 py-1 rounded-full text-xs">
                    {r === "admin" ? "👑 مسؤول" : "👤 موظف"}
                    <button onClick={() => revoke(u.id, r)} className="hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {!u.roles.includes("staff") && !u.roles.includes("admin") && (
                  <Button size="sm" variant="outline" onClick={() => grant(u.id, "staff")}>+ موظف</Button>
                )}
                {!u.roles.includes("admin") && (
                  <Button size="sm" variant="outline" onClick={() => grant(u.id, "admin")}>+ مسؤول</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
