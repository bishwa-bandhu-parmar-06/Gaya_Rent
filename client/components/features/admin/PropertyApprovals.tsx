"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/adminApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Home } from "lucide-react";

export function PropertyApprovals({ onUpdate }: { onUpdate: () => void }) {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getProperties("pending");
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAction = async (id: number, status: "approved" | "rejected") => {
    try {
      await adminApi.updatePropertyStatus(id, status);
      fetchProperties(); // Refresh local list
      onUpdate();        // Refresh global dashboard stats
    } catch (error) {
      console.error(`Failed to mark property as ${status}`);
    }
  };

  return (
    <Card className="shadow-sm border-border flex flex-col h-full">
      <CardHeader className="border-b bg-card pb-4">
        <CardTitle className="text-lg">Property Approvals</CardTitle>
        <CardDescription>Review newly listed homes before they go live.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto max-h-100">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <CheckCircle size={48} className="mb-4 text-green-500/50" />
            <h3 className="text-lg font-semibold mb-1">Queue Empty</h3>
            <p className="text-muted-foreground max-w-sm">No pending properties waiting for review.</p>
          </div>
        ) : (
          <div className="divide-y">
            {properties.map((property) => (
              <div key={property.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-semibold text-sm line-clamp-1">{property.title}</p>
                  <p className="text-xs text-muted-foreground">{property.location} • ₹{property.rent}/mo</p>
                  <p className="text-xs text-muted-foreground mt-1">Owner: {property.owner_name}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => handleAction(property.id, "approved")}>
                    <CheckCircle size={16} className="mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleAction(property.id, "rejected")}>
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