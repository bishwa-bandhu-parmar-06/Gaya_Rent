"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { logout } from "@/lib/store/authSlice";
import { ownerApi } from "@/lib/api/ownerApi";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, LayoutDashboard, PlusCircle, Settings, Building, Upload } from "lucide-react";

// Import all your modular components
import { OwnerStatsGrid } from "@/components/features/owner/OwnerStatsGrid";
import { PropertyManager } from "@/components/features/owner/PropertyManager";
import { AddPropertyForm } from "@/components/features/owner/AddPropertyForm";
import { OwnerProfileSettings } from "@/components/features/owner/OwnerProfileSettings";
import { EditPropertyForm } from "@/components/features/owner/EditPropertyForm";
import { BulkUploadForm } from "@/components/features/owner/BulkUploadForm";

export default function OwnerDashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [propertyToEdit, setPropertyToEdit] = useState<any>(null);

  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  const fetchStats = useCallback(async () => {
    try {
      const data = await ownerApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats");
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token || user?.role !== "owner") {
      router.push("/owner/auth");
    } else {
      setIsAuthorizing(false);
      fetchStats();
    }
  }, [isAuthenticated, token, user, router, fetchStats]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const handleEditClick = (property: any) => {
    setPropertyToEdit(property);
    setActiveTab("edit");
  };

  if (isAuthorizing) return <div className="min-h-screen bg-slate-50 dark:bg-background" />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Responsive Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-card p-5 md:p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
            <div className="p-2.5 md:p-3 bg-blue-100 text-blue-600 rounded-lg shrink-0">
              <Building className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xl md:text-2xl font-bold truncate">Partner Dashboard</h1>
              <p className="text-sm md:text-base text-muted-foreground truncate">Welcome back, {user?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto gap-2">
            <LogOut size={16} /> Logout
          </Button>
        </div>

        {/* Global Key Metrics */}
        <OwnerStatsGrid stats={stats} isLoading={isLoadingStats} />

        {/* Tabs Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          {/* RESPONSIVE TAB LIST: 
            - w-full, overflow-x-auto (horizontal scroll on mobile)
            - justify-start on mobile so it starts from the left edge
            - md:justify-center to center it on desktop
            - hide standard scrollbars using Tailwind utility classes 
          */}
          <TabsList className="bg-white dark:bg-card border shadow-sm p-1 flex w-full h-auto overflow-x-auto justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TabsTrigger value="overview" className="gap-2 px-4 py-2.5 whitespace-nowrap text-sm">
              <LayoutDashboard size={16} /> My Properties
            </TabsTrigger>
            <TabsTrigger value="add" className="gap-2 px-4 py-2.5 whitespace-nowrap text-sm">
              <PlusCircle size={16} /> Post Property
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2 px-4 py-2.5 whitespace-nowrap text-sm">
              <Upload size={16} /> Bulk Upload
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 px-4 py-2.5 whitespace-nowrap text-sm">
              <Settings size={16} /> Profile Settings
            </TabsTrigger>
            
            {/* Hidden tab trigger for Edit mode (activates only when editing) */}
            {propertyToEdit && <TabsTrigger value="edit" className="hidden">Edit Property</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <PropertyManager onUpdate={fetchStats} onEdit={handleEditClick} />
          </TabsContent>

          <TabsContent value="add" className="mt-0">
            <AddPropertyForm onSuccess={() => { setActiveTab("overview"); fetchStats(); }} />
          </TabsContent>

          <TabsContent value="bulk" className="mt-0">
            <BulkUploadForm onSuccess={() => { setActiveTab("overview"); fetchStats(); }} />
          </TabsContent>

          <TabsContent value="edit" className="mt-0">
            {propertyToEdit && (
              <EditPropertyForm 
                property={propertyToEdit} 
                onCancel={() => { setPropertyToEdit(null); setActiveTab("overview"); }}
                onSuccess={() => { setPropertyToEdit(null); setActiveTab("overview"); fetchStats(); }} 
              />
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <OwnerProfileSettings />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}