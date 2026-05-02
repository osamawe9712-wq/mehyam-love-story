import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Eye, MessageCircle, MailOpen, TrendingUp, Users as UsersIcon, Wallet } from "lucide-react";

type EventRow = {
  id: string;
  event_name: string;
  page_path: string | null;
  created_at: string;
  session_id: string | null;
};

const last7Days = () => {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

export const AnalyticsDashboard = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [financial, setFinancial] = useState({ income: 0, expense: 0 });
  const [attendanceCount, setAttendanceCount] = useState(0);

  const load = async () => {
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const sinceISO = since.toISOString();

    const [{ data: ev }, { data: fin }, { data: att }] = await Promise.all([
      supabase
        .from("analytics_events")
        .select("id, event_name, page_path, created_at, session_id")
        .gte("created_at", sinceISO)
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("financial_records")
        .select("type, amount")
        .gte("occurred_at", since.toISOString().slice(0, 10)),
      supabase
        .from("attendance")
        .select("id", { count: "exact", head: true })
        .gte("check_in", sinceISO),
    ]);

    setEvents((ev ?? []) as EventRow[]);
    const totals = (fin ?? []).reduce(
      (a, r: { type: string; amount: number }) => {
        if (r.type === "income") a.income += Number(r.amount);
        else a.expense += Number(r.amount);
        return a;
      },
      { income: 0, expense: 0 }
    );
    setFinancial(totals);
    setAttendanceCount((att as unknown as { count?: number })?.count ?? 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Loader2 className="animate-spin mx-auto my-12" />;

  const counts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.event_name] = (acc[e.event_name] || 0) + 1;
    return acc;
  }, {});

  const uniqueSessions = new Set(events.map((e) => e.session_id).filter(Boolean)).size;

  // page views per day
  const days = last7Days();
  const dailyViews = days.map((d) => ({
    day: d.slice(5),
    count: events.filter((e) => e.event_name === "page_view" && e.created_at.startsWith(d)).length,
  }));
  const maxDaily = Math.max(...dailyViews.map((d) => d.count), 1);

  // top pages
  const pageCounts: Record<string, number> = {};
  events.filter((e) => e.event_name === "page_view").forEach((e) => {
    const p = e.page_path || "/";
    pageCounts[p] = (pageCounts[p] || 0) + 1;
  });
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const stats = [
    { label: "زيارات الصفحات (30 يوم)", value: counts["page_view"] ?? 0, Icon: Eye, color: "text-blue-600" },
    { label: "زوار فريدون", value: uniqueSessions, Icon: UsersIcon, color: "text-purple-600" },
    { label: "نقرات واتساب", value: counts["whatsapp_click"] ?? 0, Icon: MessageCircle, color: "text-green-600" },
    { label: "إرسال نموذج التواصل", value: counts["contact_form_submit"] ?? 0, Icon: MailOpen, color: "text-amber-600" },
    { label: "صافي الدخل (30 يوم)", value: (financial.income - financial.expense).toFixed(2), Icon: Wallet, color: financial.income >= financial.expense ? "text-green-600" : "text-destructive" },
    { label: "سجلات حضور (30 يوم)", value: attendanceCount, Icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map(({ label, value, Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{label}</p>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </Card>
        ))}
      </div>

      {/* Daily chart */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">زيارات آخر 7 أيام</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {dailyViews.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs text-muted-foreground">{d.count}</div>
              <div
                className="w-full bg-gradient-gold rounded-t transition-all"
                style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: "4px" }}
              />
              <div className="text-xs text-muted-foreground">{d.day}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top pages */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">الصفحات الأكثر زيارة</h3>
        {topPages.length === 0 && <p className="text-muted-foreground text-sm">لا توجد بيانات بعد</p>}
        <div className="space-y-2">
          {topPages.map(([path, count]) => (
            <div key={path} className="flex items-center justify-between p-2 border rounded">
              <code className="text-sm" dir="ltr">{path}</code>
              <span className="font-bold">{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent events */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">آخر الأحداث</h3>
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {events.slice(0, 50).map((e) => (
            <div key={e.id} className="flex items-center justify-between text-xs p-2 border-b">
              <span className="font-mono">{e.event_name}</span>
              <span className="text-muted-foreground" dir="ltr">{e.page_path}</span>
              <span className="text-muted-foreground">
                {new Date(e.created_at).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
