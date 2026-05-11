"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SharedLoginForm } from "@/components/features/auth/SharedLoginForm";
import { OwnerRegisterForm } from "@/components/features/auth/OwnerRegisterForm";
import { Card } from "@/components/ui/card";
import { Building2, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function OwnerAuthPage() {
  // 1. Define the state to control which tab is active
  const [activeTab, setActiveTab] = useState("login");

  return (
    // The main container is now a full-height grid
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-background">
      
      {/* LEFT COLUMN: About Us & Marketing Content (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-center px-12 xl:px-24 border-r bg-slate-100/50 dark:bg-slate-900/20">
        <div className="max-w-lg space-y-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-4">
              Partner with <span className="text-primary">GayaRent</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join thousands of property owners who trust GayaRent to manage their listings, find verified tenants, and maximize their rental yield with zero hassle.
            </p>
          </div>

          {/* Benefits Feature List */}
          <div className="space-y-6 pt-4">
            <div className="flex gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full h-fit text-primary">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">Verified Tenants Only</h3>
                <p className="text-sm text-muted-foreground mt-1">Every seeker undergoes strict background and identity checks before they can contact you.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full h-fit text-primary">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">Maximize Your Yield</h3>
                <p className="text-sm text-muted-foreground mt-1">Our dynamic rating system ensures well-maintained properties command the best market prices.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full h-fit text-primary">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">Complete Dashboard Control</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage listings, track rental inquiries, and update availability all from one secure dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Auth Box */}
      <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="max-w-md w-full">
          <Card className="w-full p-6 shadow-2xl border-t-4 border-t-primary bg-white dark:bg-card">
            
            {/* 2. Bind the Tabs to our activeTab state */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0">
                <SharedLoginForm role="owner" />
              </TabsContent>
              
              <TabsContent value="register" className="mt-0">
                {/* 3. Pass the state-changer function to the form */}
                <OwnerRegisterForm onSwitchToLogin={() => setActiveTab("login")} />
              </TabsContent>
            </Tabs>
            
          </Card>
        </div>
      </div>

    </div>
  );
}