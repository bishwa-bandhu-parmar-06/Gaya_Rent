"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/adminApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, UserCheck } from "lucide-react";

export function PartnerApprovals({ onUpdate }: { onUpdate: () => void }) {
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getPartners("pending");
      setPartners(data);
    } catch (error) {
      console.error("Failed to fetch partners", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      await adminApi.updatePartnerStatus(id, action);
      fetchPartners(); // Refresh local list
      onUpdate();      // Refresh global dashboard stats
    } catch (error) {
      console.error(`Failed to ${action} partner`);
    }
  };

  return (
    <Card className="shadow-sm border-border flex flex-col h-full">
      <CardHeader className="border-b bg-card pb-4">
        <CardTitle className="text-lg">Partner Approvals</CardTitle>
        <CardDescription>Review new property owners requiring identity verification.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto max-h-100">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
        ) : partners.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <UserCheck size={48} className="mb-4 text-green-500/50" />
            <h3 className="text-lg font-semibold mb-1">All Caught Up!</h3>
            <p className="text-muted-foreground max-w-sm">No new property partners waiting for approval.</p>
          </div>
        ) : (
          <div className="divide-y">
            {partners.map((partner) => (
              <div key={partner.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-semibold text-sm">{partner.name}</p>
                  <p className="text-xs text-muted-foreground">{partner.email} • {partner.mobile}</p>
                  {/* Future enhancement: Add a button here to View Document JSON */}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => handleAction(partner.id, "approve")}>
                    <CheckCircle size={16} className="mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleAction(partner.id, "reject")}>
                    <XCircle size={16} className="mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}