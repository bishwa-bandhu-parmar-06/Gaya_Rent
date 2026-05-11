import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle, Clock, Key, Loader2 } from "lucide-react";

interface OwnerStats {
  totalListings: number;
  approvedListings: number;
  pendingListings: number;
  rejectedListings: number;
  rentedListings: number;
}

export function OwnerStatsGrid({ stats, isLoading }: { stats: OwnerStats | null, isLoading: boolean }) {
  const cards = [
    { label: "Total Properties", value: stats?.totalListings, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Approved (Live)", value: stats?.approvedListings, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Review", value: stats?.pendingListings, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Currently Rented", value: stats?.rentedListings, icon: Key, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="shadow-sm border-border">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{card.label}</p>
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : <h3 className="text-2xl font-black">{card.value || 0}</h3>}
            </div>
            <div className={`p-3 ${card.bg} ${card.color} rounded-xl`}>
              <card.icon size={24} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}