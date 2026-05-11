import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLoginForm } from "../../../components/features/auth/AdminLoginForm";
import { AdminRegisterForm } from "@/components/features/auth/AdminRegisterForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function AdminAuthPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-100 dark:bg-background">
      <Card className="w-full max-w-md p-6 shadow-2xl border-t-4 border-t-slate-900 dark:border-t-primary relative overflow-hidden">
        
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 text-slate-200 dark:text-slate-800 opacity-20 pointer-events-none">
          <ShieldAlert size={150} />
        </div>

        <CardHeader className="px-0 pt-0 relative z-10">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-slate-900 dark:text-primary" size={24} />
            Command Center
          </CardTitle>
          <CardDescription>System Administration Portal</CardDescription>
        </CardHeader>

        <Tabs defaultValue="login" className="w-full relative z-10">
          <TabsList className="grid w-full grid-cols-2 bg-slate-200 dark:bg-slate-900">
            <TabsTrigger value="login" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">Login</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">Setup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-0">
            <AdminLoginForm />
          </TabsContent>
          
          <TabsContent value="register" className="mt-0">
            <AdminRegisterForm />
          </TabsContent>
        </Tabs>

      </Card>
    </div>
  );
}