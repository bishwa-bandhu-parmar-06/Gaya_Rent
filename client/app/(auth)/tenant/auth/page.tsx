"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SharedLoginForm } from "@/components/features/auth/SharedLoginForm";
import { TenantRegisterForm } from "@/components/features/auth/TenantRegisterForm";
import { Card } from "@/components/ui/card";
import { Home, Search, ShieldCheck, TrendingUp, MessageCircle } from "lucide-react";

export default function TenantAuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 bg-linear-to-br from-background to-secondary/20">
      
      {/* LEFT COLUMN - Benefits Section */}
      <div className="hidden lg:flex flex-col justify-center px-12 xl:px-20 py-12 bg-linear-to-br from-primary/5 via-transparent to-transparent">
        <div className="max-w-lg space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full">
              <TrendingUp size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">10,000+ Happy Tenants</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Find Your Perfect{" "}
              <span className="text-primary">Home</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover thousands of verified rental properties tailored to your needs, budget, and location.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-6 pt-4">
            <div className="flex gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm">
              <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ShieldCheck size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">100% Verified Properties</h3>
                <p className="text-sm text-muted-foreground">Every listing and owner is manually verified for your safety.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm">
              <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Search size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Smart Search & Filters</h3>
                <p className="text-sm text-muted-foreground">Filter homes by price, amenities, ratings, and locations.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm">
              <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageCircle size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Instant WhatsApp Updates</h3>
                <p className="text-sm text-muted-foreground">Get real-time property matches and alerts on WhatsApp.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm">
              <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Home size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Direct Owner Contact</h3>
                <p className="text-sm text-muted-foreground">Connect directly with property owners, no middlemen.</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10k+</div>
              <div className="text-xs text-muted-foreground">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-xs text-muted-foreground">Partners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.8</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Auth Forms */}
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-lg">
          <Card className="w-full p-6 sm:p-8 shadow-2xl border-border bg-card">
            {/* Bind the Tabs to our activeTab state */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full"> 
              <TabsList className="grid w-full grid-cols-2 mb-6 h-11">
                <TabsTrigger value="login" className="text-base">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="text-base">
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0">
                <SharedLoginForm role="tenant" />
              </TabsContent>
              
              <TabsContent value="register" className="mt-0">
                {/* Pass the state-changer function to the form */}
                <TenantRegisterForm onSwitchToLogin={() => setActiveTab("login")} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}