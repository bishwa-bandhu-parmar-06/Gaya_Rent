import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Home, Clock, Building2, Loader2 } from "lucide-react";

interface AdminStatsGridProps {
  stats: any;
  isLoading: boolean;
}

export function AdminStatsGrid({ stats, isLoading }: AdminStatsGridProps) {
  const statCards = [
    {
      label: "Total Seekers",
      value: stats?.totalTenants,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-l-blue-500",
    },
    {
      label: "Total Partners",
      value: stats?.totalPartners,
      icon: UserCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      border: "border-l-indigo-500",
    },
    {
      label: "Total Properties",
      value: stats?.totalProperties,
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-l-emerald-500",
    },
    {
      label: "Active Listings",
      value: stats?.activeProperties,
      icon: Home,
      color: "text-cyan-600",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      border: "border-l-cyan-500",
    },
    {
      label: "Pending Approvals",
      value: (stats?.pendingProperties || 0) + (stats?.pendingPartners || 0),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-l-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((card, index) => (
        <Card key={index} className={`border-l-4 ${card.border} shadow-sm overflow-hidden`}>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {card.label}
              </p>
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <h3 className="text-2xl font-black">{card.value || 0}</h3>
              )}
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