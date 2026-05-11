"use client";
import { useEffect, useState } from "react";
import { ownerApi } from "@/lib/api/ownerApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Trash2, Home, AlertCircle, Edit } from "lucide-react";

export function PropertyManager({ onUpdate, onEdit }: { onUpdate: () => void, onEdit: (property: any) => void }) {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const data = await ownerApi.getMyProperties();
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await ownerApi.deleteProperty(id);
      fetchProperties();
      onUpdate(); // Update dashboard stats
    } catch (error) {
      alert("Failed to delete property.");
    }
  };

  const toggleAvailability = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'rented' : 'available';
    try {
      await ownerApi.toggleAvailability(id, newStatus);
      fetchProperties();
      onUpdate(); // Update dashboard stats
    } catch (error) {
      alert("Failed to update availability.");
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;

  if (properties.length === 0) {
    return (
      <div className="text-center p-12 bg-card border rounded-lg border-dashed">
        <Home className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium">No properties yet</h3>
        <p className="text-muted-foreground">Add your first property to start receiving tenant inquiries.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p) => (
        <Card key={p.id} className="overflow-hidden flex flex-col">
          <div className="h-48 bg-muted relative">
            {/* Display first image or placeholder */}
            {p.photos && JSON.parse(p.photos).length > 0 ? (
              <img src={JSON.parse(p.photos)[0]} alt={p.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800">
                <Home size={40} className="text-muted-foreground/30" />
              </div>
            )}
            
            {/* Status Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              {p.status === 'pending' && <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow flex items-center gap-1"><AlertCircle size={12}/> Pending Approval</span>}
              {p.status === 'approved' && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow">Live</span>}
              {p.status === 'rejected' && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow">Rejected</span>}
              
              <span className={`text-xs px-2 py-1 rounded-full font-medium shadow border ${p.availability === 'available' ? 'bg-white text-blue-600 border-blue-200' : 'bg-slate-800 text-white border-slate-700'}`}>
                {p.availability === 'available' ? 'Available' : 'Rented Out'}
              </span>
            </div>
          </div>
          <CardContent className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-lg line-clamp-1 mb-1">{p.title}</h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3"><MapPin size={14}/> {p.location}</p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
              <span className="font-black text-primary text-lg">₹{p.rent}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
              <div className="flex gap-2">
                <Button size="sm" variant={p.availability === 'available' ? 'outline' : 'secondary'} onClick={() => toggleAvailability(p.id, p.availability)}>
                  {p.availability === 'available' ? 'Mark Rented' : 'Mark Available'}
                </Button>
                {/* NEW EDIT BUTTON */}
                <Button size="sm" variant="outline" onClick={() => onEdit(p)}>
                  <Edit size={16} className="md:mr-1" /> <span className="hidden md:inline">Edit</span>
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}