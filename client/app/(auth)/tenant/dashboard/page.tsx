"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { logout } from "@/lib/store/authSlice";
import { tenantApi } from "@/lib/api/tenantApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, LogOut, Home, Key, ShieldCheck, Heart, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { PropertyCard } from "@/components/features/properties/PropertyCard";

export default function TenantDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  
  // States for fetched data
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [ratedProperties, setRatedProperties] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Pull authentication state directly from Redux Persist
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  // Protected Route Logic & Initial Data Fetch
  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/tenant/auth");
    } else if (user?.role !== "tenant") {
      router.push("/not-found"); 
    } else {
      setIsAuthorizing(false);
      fetchAllDashboardData();
    }
  }, [isAuthenticated, token, user, router]);

  const fetchAllDashboardData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch both saved and rated properties simultaneously
      const [saved, rated] = await Promise.all([
        tenantApi.getSavedProperties(),
        tenantApi.getRatedProperties()
      ]);
      setSavedProperties(saved);
      setRatedProperties(rated);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  if (isAuthorizing) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Seeker Dashboard</h1>
            <p className="text-muted-foreground">Manage your profile and rental journey</p>
          </div>
          <div className="flex gap-3">
            <Link href="/properties">
              <Button variant="outline" className="gap-2">
                <Home size={16} /> Browse Properties
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout} className="gap-2">
              <LogOut size={16} /> Sign Out
            </Button>
          </div>
        </div>

        {/* Interactive Tabs */}
        <Tabs defaultValue="profile" className="w-full space-y-6">
          <TabsList className="bg-card border shadow-sm p-1 grid grid-cols-3 max-w-xl">
            <TabsTrigger value="profile" className="gap-2"><User size={16} className="hidden sm:block"/> Profile</TabsTrigger>
            <TabsTrigger value="saved" className="gap-2"><Heart size={16} className="hidden sm:block"/> Saved</TabsTrigger>
            <TabsTrigger value="rated" className="gap-2"><Star size={16} className="hidden sm:block"/> Reviews</TabsTrigger>
          </TabsList>

          {/* TAB 1: PROFILE DETAILS */}
          <TabsContent value="profile" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm border-border">
                <CardHeader className="bg-primary/5 border-b border-border">
                  <CardTitle className="text-lg flex items-center gap-2"><User size={20} className="text-primary" /> Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="text-lg font-semibold">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      <p>{user?.email || "Signed in with Google"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                    <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-medium uppercase tracking-wider">
                      <Key size={14} /> {user?.role}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border">
                <CardHeader className="bg-primary/5 border-b border-border">
                  <CardTitle className="text-lg flex items-center gap-2"><ShieldCheck size={20} className="text-primary" /> Account Status</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30">
                    <h3 className="font-semibold text-green-800 dark:text-green-400 mb-1">Active & Verified</h3>
                    <p className="text-sm text-green-700/80 dark:text-green-500/80">
                      Your identity has been verified. You can now contact property owners and save listings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: SAVED PROPERTIES */}
          <TabsContent value="saved" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {isLoadingData ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
            ) : savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map(prop => <PropertyCard key={prop.id} property={prop} />)}
              </div>
            ) : (
              <div className="p-12 text-center bg-card rounded-xl border border-dashed shadow-sm">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">No saved properties</h3>
                <p className="text-muted-foreground mt-1 mb-4">You haven't saved any properties yet.</p>
                <Link href="/properties"><Button variant="outline">Start Browsing</Button></Link>
              </div>
            )}
          </TabsContent>

          {/* TAB 3: RATED PROPERTIES */}
          <TabsContent value="rated" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {isLoadingData ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
            ) : ratedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ratedProperties.map(prop => (
                  <div key={prop.id} className="relative">
                    {/* Floating badge to show their specific rating */}
                    <div className="absolute -top-3 -right-3 z-30 bg-amber-500 text-white font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 border-2 border-background">
                      <Star size={14} className="fill-white" /> {prop.my_rating} You
                    </div>
                    <PropertyCard property={prop} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-card rounded-xl border border-dashed shadow-sm">
                <Star className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">No reviews yet</h3>
                <p className="text-muted-foreground mt-1">Properties you rate will appear here.</p>
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}