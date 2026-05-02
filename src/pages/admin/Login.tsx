import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import logo from "@/assets/logo.png";

const schema = z.object({
  email: z.string().trim().email("بريد غير صالح").max(255),
  password: z.string().min(6, "٦ أحرف على الأقل").max(72),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, isStaff, loading } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isStaff) navigate("/admin", { replace: true });
  }, [user, isStaff, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      if (tab === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("أهلاً بك 👑");
      } else {
        const redirectUrl = `${window.location.origin}/admin`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: name || email },
          },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب! تحقق من بريدك للتفعيل.");
      }
    } catch (err: any) {
      const msg = err.message?.includes("Invalid login")
        ? "بيانات غير صحيحة"
        : err.message?.includes("registered")
        ? "هذا الإيميل مسجّل مسبقاً"
        : err.message ?? "حدث خطأ";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-cream p-4">
      <Card className="w-full max-w-md p-8 shadow-elegant border-border/50">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="مهيام" className="h-16 w-16 mb-3" />
          <h1 className="font-display text-3xl text-primary">لوحة تحكم مهيام</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <Lock className="h-3 w-3" /> صفحة محمية للمسؤولين فقط
          </p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
          </TabsList>

          <form onSubmit={onSubmit} className="space-y-4">
            <TabsContent value="signup" className="m-0 space-y-4">
              <div>
                <Label htmlFor="name">الاسم</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" />
              </div>
            </TabsContent>

            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" disabled={busy} className="w-full">
              {busy && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              {tab === "signin" ? "دخول" : "إنشاء حساب"}
            </Button>
          </form>
        </Tabs>

        <p className="text-xs text-center text-muted-foreground mt-6">
          الحسابات الجديدة تحتاج تأكيد بريد + موافقة من المسؤول قبل الدخول للوحة التحكم.
        </p>
      </Card>
    </div>
  );
};

export default AdminLogin;
