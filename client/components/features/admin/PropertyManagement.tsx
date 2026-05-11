"use client";
import { useEffect, useState, useCallback } from "react";
import { adminApi } from "@/lib/api/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle, Loader2, RotateCcw, ChevronLeft, ChevronRight, CheckSquare } from "lucide-react";

export function PropertyManagement({ onUpdate }: { onUpdate: () => void }) {
  const [properties, setProperties] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchProperties = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const data = await adminApi.getProperties(activeTab, page, 10);
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setSelectedIds([]); // Clear selections when tab changes
    fetchProperties(1);
  }, [fetchProperties]);

  const handleAction = async (id: number, status: "approved" | "rejected") => {
    try {
      await adminApi.updatePropertyStatus(id, status);
      fetchProperties(pagination.currentPage);
      onUpdate();
    } catch (error) {
      console.error(`Failed to update property`);
    }
  };

  const handleBulkAction = async (status: "approved" | "rejected") => {
    if (selectedIds.length === 0) return;
    try {
      setIsLoading(true);
      await adminApi.bulkUpdatePropertyStatus(selectedIds, status);
      setSelectedIds([]);
      fetchProperties(pagination.currentPage);
      onUpdate();
    } catch (error) {
      console.error("Failed to perform bulk action");
      setIsLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === properties.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(properties.map(p => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const renderPropertyList = () => {
    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;
    if (properties.length === 0) return <div className="p-12 text-center text-muted-foreground bg-muted/20 border border-dashed rounded-lg mt-4">No properties found in this category.</div>;

    const allSelected = selectedIds.length === properties.length && properties.length > 0;

    return (
      <div className="mt-4 space-y-4">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckSquare size={18} className="text-primary" />
              <span className="text-sm font-semibold text-primary">{selectedIds.length} properties selected</span>
            </div>
            <div className="flex gap-2">
              {activeTab !== "approved" && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleBulkAction("approved")}>
                  Approve Selected
                </Button>
              )}
              {activeTab !== "rejected" && (
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction("rejected")}>
                  Reject Selected
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Header Row for Select All */}
        <div className="flex items-center px-4 py-2 bg-muted/50 rounded-t-md border border-b-0">
          <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} className="mr-4" />
          <span className="text-xs font-semibold text-muted-foreground uppercase">Select All on Page</span>
        </div>

        {/* List of Properties */}
        <div className="divide-y border rounded-b-md">
          {properties.map((p) => (
            <div key={p.id} className={`p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${selectedIds.includes(p.id) ? 'bg-primary/5' : 'bg-card hover:bg-muted/30'}`}>
              <div className="flex items-start gap-4">
                <Checkbox checked={selectedIds.includes(p.id)} onCheckedChange={() => toggleSelect(p.id)} className="mt-1" />
                <div>
                  <p className="font-semibold line-clamp-1">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.location} • ₹{p.rent.toLocaleString()}/mo</p>
                  <p className="text-xs text-muted-foreground mt-1">Owner: {p.owner_name} ({p.owner_mobile})</p>
                </div>
              </div>
              <div className="flex gap-2 ml-8 md:ml-0">
                {activeTab !== "approved" && (
                  <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={() => handleAction(p.id, "approved")}>
                    <CheckCircle size={16} className="md:mr-1" /> <span className="hidden md:inline">Approve</span>
                  </Button>
                )}
                {activeTab !== "rejected" && (
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleAction(p.id, "rejected")}>
                    <XCircle size={16} className="md:mr-1" /> <span className="hidden md:inline">Reject</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => fetchProperties(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>
                <ChevronLeft size={16} className="mr-1" /> Prev
              </Button>
              <Button variant="outline" size="sm" onClick={() => fetchProperties(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages}>
                Next <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-sm border-border">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold">Property Listings</h2>
            <p className="text-sm text-muted-foreground">Review and manage platform listings.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => fetchProperties(pagination.currentPage)}><RotateCcw size={16} /></Button>
        </div>

        <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">{renderPropertyList()}</TabsContent>
          <TabsContent value="approved">{renderPropertyList()}</TabsContent>
          <TabsContent value="rejected">{renderPropertyList()}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}