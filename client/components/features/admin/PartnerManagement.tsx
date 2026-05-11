"use client";
import { useEffect, useState, useCallback } from "react";
import { adminApi } from "@/lib/api/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Loader2, RotateCcw } from "lucide-react";

export function PartnerManagement({ onUpdate }: { onUpdate: () => void }) {
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

  const fetchPartners = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getPartners(activeTab);
      setPartners(data);
    } catch (error) {
      console.error("Failed to fetch partners");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      await adminApi.updatePartnerStatus(id, action);
      fetchPartners(); 
      onUpdate(); 
    } catch (error) {
      console.error(`Failed to ${action} partner`);
    }
  };

  const renderPartnerList = () => {
    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (partners.length === 0) return <div className="p-8 text-center text-muted-foreground">No partners found in this category.</div>;

    return (
      <div className="divide-y border rounded-md mt-4">
        {partners.map((p) => (
          <div key={p.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-muted-foreground">{p.email} • {p.mobile}</p>
            </div>
            <div className="flex gap-2">
              {activeTab !== "approved" && (
                <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={() => handleAction(p.id, "approve")}>
                  <CheckCircle size={16} className="mr-1" /> Approve
                </Button>
              )}
              {activeTab !== "rejected" && (
                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleAction(p.id, "reject")}>
                  <XCircle size={16} className="mr-1" /> Reject
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="shadow-sm border-border">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold">Partner Management</h2>
            <p className="text-sm text-muted-foreground">Verify and manage property owners.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchPartners}><RotateCcw size={16} /></Button>
        </div>

        <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">{renderPartnerList()}</TabsContent>
          <TabsContent value="approved">{renderPartnerList()}</TabsContent>
          <TabsContent value="rejected">{renderPartnerList()}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}