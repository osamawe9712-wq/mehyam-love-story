import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, TrendingUp, TrendingDown, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Record = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string | null;
  description: string | null;
  occurred_at: string;
};

export const FinancialManager = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    type: "income" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
    occurred_at: new Date().toISOString().slice(0, 10),
  });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("financial_records")
      .select("*")
      .order("occurred_at", { ascending: false })
      .limit(200);
    setRows((data ?? []) as Record[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return toast.error("أدخل مبلغًا صحيحًا");
    const { error } = await supabase.from("financial_records").insert({
      type: form.type,
      amount,
      category: form.category || null,
      description: form.description || null,
      occurred_at: form.occurred_at,
      created_by: user?.id,
    });
    if (error) return toast.error(error.message);
    toast.success("تم إضافة السجل ✅");
    setForm({ ...form, amount: "", category: "", description: "" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف السجل؟")) return;
    const { error } = await supabase.from("financial_records").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف");
    load();
  };

  const totals = rows.reduce(
    (acc, r) => {
      if (r.type === "income") acc.income += Number(r.amount);
      else acc.expense += Number(r.amount);
      return acc;
    },
    { income: 0, expense: 0 }
  );
  const net = totals.income - totals.expense;

  if (loading) return <Loader2 className="animate-spin mx-auto my-12" />;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <TrendingUp className="h-5 w-5 mx-auto text-green-600 mb-1" />
          <p className="text-xs text-muted-foreground">دخل</p>
          <p className="font-bold text-lg text-green-600">{totals.income.toFixed(2)}</p>
        </Card>
        <Card className="p-4 text-center">
          <TrendingDown className="h-5 w-5 mx-auto text-destructive mb-1" />
          <p className="text-xs text-muted-foreground">عجز/مصروفات</p>
          <p className="font-bold text-lg text-destructive">{totals.expense.toFixed(2)}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xs text-muted-foreground mt-1">الصافي</p>
          <p className={`font-bold text-lg ${net >= 0 ? "text-green-600" : "text-destructive"}`}>
            {net.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Add form */}
      <Card className="p-6 space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Plus className="h-5 w-5" /> إضافة سجل مالي
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as never })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="income">💰 دخل</SelectItem>
              <SelectItem value="expense">💸 مصروف / عجز</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            step="0.01"
            placeholder="المبلغ"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <Input
            placeholder="الفئة (مثال: مبيعات، رواتب، إيجار)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Input
            type="date"
            value={form.occurred_at}
            onChange={(e) => setForm({ ...form, occurred_at: e.target.value })}
          />
          <Input
            className="sm:col-span-2"
            placeholder="ملاحظات"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <Button onClick={add} className="w-full">إضافة السجل</Button>
      </Card>

      {/* List */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">السجلات ({rows.length})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {rows.length === 0 && <p className="text-muted-foreground text-center py-6">لا توجد سجلات</p>}
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {r.type === "income" ? "دخل" : "مصروف"}
                  </span>
                  {r.category && <span className="text-xs text-muted-foreground">{r.category}</span>}
                </div>
                {r.description && <p className="text-sm mt-1 truncate">{r.description}</p>}
                <p className="text-xs text-muted-foreground">{r.occurred_at}</p>
              </div>
              <div className="text-left shrink-0 flex items-center gap-3">
                <span className={`font-bold ${r.type === "income" ? "text-green-600" : "text-destructive"}`}>
                  {r.type === "income" ? "+" : "-"}{Number(r.amount).toFixed(2)}
                </span>
                <button onClick={() => remove(r.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
