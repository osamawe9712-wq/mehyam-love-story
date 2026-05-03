import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Coffee, Settings, FileText, Users, BarChart3, Clock, Wallet } from "lucide-react";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { ContentManager } from "@/components/admin/ContentManager";
import { UsersManager } from "@/components/admin/UsersManager";
import { AttendanceManager } from "@/components/admin/AttendanceManager";
import { FinancialManager } from "@/components/admin/FinancialManager";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import logo from "@/assets/logo.png";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-cream">
      {/* Header */}
      <header className="bg-card border-b shadow-soft sticky top-0 z-30">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="مهيام" className="h-10 w-10" />
            <div>
              <h1 className="font-display text-xl text-primary">لوحة تحكم مهيام</h1>
              <p className="text-xs text-muted-foreground">وصول مفتوح 👑</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>عرض الموقع</Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Tabs defaultValue="analytics">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full mb-6 h-auto">
            <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 ml-2" />التحليلات</TabsTrigger>
            <TabsTrigger value="attendance"><Clock className="h-4 w-4 ml-2" />الحضور</TabsTrigger>
            <TabsTrigger value="financial"><Wallet className="h-4 w-4 ml-2" />المالية</TabsTrigger>
            <TabsTrigger value="products"><Coffee className="h-4 w-4 ml-2" />المنتجات</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="h-4 w-4 ml-2" />الإعدادات</TabsTrigger>
            <TabsTrigger value="content"><FileText className="h-4 w-4 ml-2" />المحتوى</TabsTrigger>
            <TabsTrigger value="users"><Users className="h-4 w-4 ml-2" />المستخدمون</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
          <TabsContent value="attendance"><AttendanceManager /></TabsContent>
          <TabsContent value="financial"><FinancialManager /></TabsContent>
          <TabsContent value="products"><ProductsManager /></TabsContent>
          <TabsContent value="settings"><SettingsManager /></TabsContent>
          <TabsContent value="content"><ContentManager /></TabsContent>
          <TabsContent value="users"><UsersManager /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
