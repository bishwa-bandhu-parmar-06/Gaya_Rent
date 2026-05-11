"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Home, Headset } from "lucide-react";
import Link from "next/link";

export default function PendingPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50 dark:bg-background">
      <Card className="w-full max-w-lg text-center shadow-xl border-t-4 border-t-amber-500">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <Clock size={32} />
          </div>
          <CardTitle className="text-3xl font-bold">Account Pending</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Hi <span className="font-semibold text-foreground">{user?.name || "Partner"}</span>, your account is currently in a pending state.
          </p>
          <p className="text-sm text-muted-foreground bg-slate-100 dark:bg-slate-900 p-4 rounded-md">
            Our admin team is reviewing your submitted government documents. Once your profile is verified and approved, you will be able to access your Partner Dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
                <Home size={18} /> Return Home
              </Button>
            </Link>
            <Button className="w-full sm:w-auto gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-primary dark:text-primary-foreground">
              <Headset size={18} /> Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}