import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, LogIn, LogOut, Clock, Trash2 } from "lucide-react";

type AttendanceRow = {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  notes: string | null;
  profile_email?: string | null;
  profile_name?: string | null;
};

const formatDuration = (start: string, end: string | null) => {
  if (!end) return "—";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}س ${m}د`;
};

const formatDate = (s: string) =>
  new Date(s).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" });

export const AttendanceManager = () => {
  const { user, isAdmin, isStaff } = useAuth();
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [openRecord, setOpenRecord] = useState<AttendanceRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .order("check_in", { ascending: false })
      .limit(200);

    let withProfiles: AttendanceRow[] = data ?? [];
    if (isAdmin && data && data.length) {
      const ids = Array.from(new Set(data.map((r) => r.user_id)));
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", ids);
      const map = new Map(profiles?.map((p) => [p.id, p]) ?? []);
      withProfiles = data.map((r) => ({
        ...r,
        profile_email: map.get(r.user_id)?.email,
        profile_name: map.get(r.user_id)?.full_name,
      }));
    }
    setRows(withProfiles);
    const open = (data ?? []).find((r) => r.user_id === user?.id && !r.check_out) || null;
    setOpenRecord(open);
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user, isAdmin]);

  const checkIn = async () => {
    if (!user) return;
    const { error } = await supabase.from("attendance").insert({
      user_id: user.id,
      notes: notes || null,
    });
    if (error) return toast.error(error.message);
    toast.success("تم تسجيل الحضور ✅");
    setNotes("");
    load();
  };

  const checkOut = async () => {
    if (!openRecord) return;
    const { error } = await supabase
      .from("attendance")
      .update({ check_out: new Date().toISOString() })
      .eq("id", openRecord.id);
    if (error) return toast.error(error.message);
    toast.success("تم تسجيل الانصراف 👋");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف السجل؟")) return;
    const { error } = await supabase.from("attendance").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف");
    load();
  };

  if (!isStaff) {
    return <p className="text-center text-muted-foreground py-12">للموظفين فقط</p>;
  }

  if (loading) return <Loader2 className="animate-spin mx-auto my-12" />;

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Clock className="h-5 w-5" /> تسجيل الحضور والانصراف
        </h3>
        {openRecord ? (
          <div className="space-y-3">
            <div className="bg-accent/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">حضرت في</p>
              <p className="font-bold">{formatDate(openRecord.check_in)}</p>
              {openRecord.notes && <p className="text-sm mt-1">📝 {openRecord.notes}</p>}
            </div>
            <Button onClick={checkOut} className="w-full" variant="default">
              <LogOut className="h-4 w-4 ml-2" /> تسجيل انصراف الآن
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              placeholder="ملاحظات (اختياري)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button onClick={checkIn} className="w-full">
              <LogIn className="h-4 w-4 ml-2" /> تسجيل حضور الآن
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">
          {isAdmin ? "سجلات جميع الموظفين" : "سجلاتي"} ({rows.length})
        </h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {rows.length === 0 && <p className="text-muted-foreground text-center py-6">لا توجد سجلات بعد</p>}
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg gap-3">
              <div className="flex-1 min-w-0">
                {isAdmin && (
                  <p className="font-medium text-sm truncate">
                    {r.profile_name || r.profile_email || r.user_id.slice(0, 8)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  دخول: {formatDate(r.check_in)}
                </p>
                <p className="text-xs text-muted-foreground">
                  خروج: {r.check_out ? formatDate(r.check_out) : "لم ينصرف بعد"}
                </p>
                {r.notes && <p className="text-xs italic mt-1">📝 {r.notes}</p>}
              </div>
              <div className="text-left shrink-0">
                <span className="text-sm font-bold text-primary">
                  {formatDuration(r.check_in, r.check_out)}
                </span>
                {isAdmin && (
                  <button onClick={() => remove(r.id)} className="block mt-1 text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
