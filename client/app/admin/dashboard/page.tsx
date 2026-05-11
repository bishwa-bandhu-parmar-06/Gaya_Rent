"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { logout } from "@/lib/store/authSlice";
import { adminApi } from "@/lib/api/adminApi";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LogOut, ShieldAlert, LayoutDashboard, 
  Users, Home, Settings, BellRing, 
  Sparkles, Activity, Menu, X,
  Sun, Moon, RefreshCw
} from "lucide-react";
import { useTheme } from "next-themes";

import { AdminStatsGrid } from "@/components/features/admin/AdminStatsGrid";
import { PartnerManagement } from "@/components/features/admin/PartnerManagement";
import { PropertyManagement } from "@/components/features/admin/PropertyManagement";
import { AdminProfileSettings } from "@/components/features/admin/AdminProfileSettings";

interface AdminStats {
  totalTenants: number;
  totalPartners: number;
  pendingPartners: number;
  totalProperties: number;
  pendingProperties: number;
  activeProperties: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false); // FIXED: Hydration wrapper
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  // FIXED: Handle hydration for theme and dates
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      const data = await adminApi.getDashboardStats();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load metrics");
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardStats();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    if (!isAuthenticated || !token || user?.role !== "admin") {
      router.push("/admin/auth");
    } else {
      setIsAuthorizing(false);
      fetchDashboardStats();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchDashboardStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token, user, router, fetchDashboardStats]);

  if (isAuthorizing) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingItems = (stats?.pendingProperties || 0) + (stats?.pendingPartners || 0);

  const tabs = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-500" },
    { id: "partners", label: "Partner Accounts", icon: Users, color: "text-green-500" },
    { id: "properties", label: "Property Listings", icon: Home, color: "text-purple-500" },
    { id: "settings", label: "System Config", icon: Settings, color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/10">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-xl border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl" />
                <div className="relative bg-linear-to-br from-primary to-primary/80 p-2 rounded-lg shadow-lg">
                  <ShieldAlert size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Command Center
                </h1>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  GayaRent System Admin
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* Last Updated */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity size={12} />
                <span>Last updated: {mounted ? lastUpdated.toLocaleTimeString() : "--:--"}</span>
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
              )}

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary transition-colors">
                <BellRing size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </Button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Master Account</p>
                </div>
                <div className="w-8 h-8 bg-linear-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { dispatch(logout()); router.push("/"); }}
                className="gap-2 text-destructive hover:bg-destructive/10 transition-all duration-300"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-slideIn">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Last updated: {mounted ? lastUpdated.toLocaleTimeString() : "--:--"}
                    </span>
                  </div>
                  {mounted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                      {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">Master Account</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => { dispatch(logout()); router.push("/"); }}
                    className="text-destructive"
                  >
                    <LogOut size={16} />
                    <span className="ml-1">Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Welcome Banner with Animation - FIXED SVG SYNTAX */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary via-primary/90 to-primary/70 p-6 md:p-10 shadow-2xl animate-fadeIn">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-white/80 animate-pulse" />
                <span className="text-white/80 text-sm font-medium">Welcome Back</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {user?.name?.split(' ')[0]}, ready to manage?
              </h2>
              <p className="text-white/80 max-w-md">
                You have <span className="font-bold text-white">{pendingItems}</span> items requiring your immediate attention.
              </p>
            </div>
            
            <Button 
              onClick={handleRefresh}
              variant="secondary" 
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 shadow-lg group"
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              Refresh Data
            </Button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Stats Grid with Animation */}
        <div className="animate-fadeIn animation-delay-100">
          <AdminStatsGrid stats={stats} isLoading={isLoadingStats} />
        </div>

        {/* Main Tabs Section */}
        <div className="space-y-6 animate-fadeIn animation-delay-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <TabsList className="bg-card border border-border shadow-sm p-1 inline-flex w-full md:w-auto h-auto gap-1">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    <tab.icon size={16} className={activeTab === tab.id ? "text-white" : tab.color} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="animate-slideIn animation-delay-100">
                  <PartnerManagement onUpdate={fetchDashboardStats} />
                </div>
                <div className="animate-slideIn animation-delay-200">
                  <PropertyManagement onUpdate={fetchDashboardStats} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="partners" className="mt-6 animate-fadeIn">
              <PartnerManagement onUpdate={fetchDashboardStats} />
            </TabsContent>

            <TabsContent value="properties" className="mt-6 animate-fadeIn">
              <PropertyManagement onUpdate={fetchDashboardStats} />
            </TabsContent>

            <TabsContent value="settings" className="mt-6 animate-fadeIn">
              <AdminProfileSettings />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="pt-8 mt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © 2024 GayaRent Admin Panel. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}