// app/(auth)/auth-selection/page.tsx
import Link from "next/link";
import { Key, Home, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthSelection() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-linear-to-b from-background to-secondary/20">
      <div className="max-w-5xl w-full mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block mb-4">
            <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            Welcome to GayaRent
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your path to find or list your perfect rental home
          </p>
        </div>

        {/* Cards Grid - Exactly 2 cards as requested */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Tenant / Seeker Card */}
          <Link href="/tenant/auth" className="group block">
            <Card className="relative h-full border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl cursor-pointer overflow-hidden group-hover:-translate-y-2">
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-500" />
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-primary/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="text-center relative z-10 pt-8">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:shadow-lg transition-all duration-300 mx-auto group-hover:scale-110">
                  <Key size={36} className="text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-3">I am a Seeker</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Find and book your perfect rental home
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center pb-8 relative z-10">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Browse thousands of verified properties</p>
                  <p>✓ Connect directly with owners</p>
                  <p>✓ Get instant WhatsApp matches</p>
                  <p>✓ Zero brokerage fees</p>
                </div>
                
                <div className="mt-6 inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  <span>Get Started</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Owner / Partner Card */}
          <Link href="/owner/auth" className="group block">
            <Card className="relative h-full border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl cursor-pointer overflow-hidden group-hover:-translate-y-2">
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-500" />
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-primary/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="text-center relative z-10 pt-8">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:shadow-lg transition-all duration-300 mx-auto group-hover:scale-110">
                  <Home size={36} className="text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-3">Become a Partner</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  List your property and earn more
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center pb-8 relative z-10">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ List your properties for free</p>
                  <p>✓ Reach thousands of potential tenants</p>
                  <p>✓ Manage bookings easily</p>
                  <p>✓ Secure payment processing</p>
                </div>
                
                <div className="mt-6 inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  <span>Start Earning</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer Note - Optional but adds professionalism */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Join 10,000+ happy tenants and 500+ trusted partners
          </p>
        </div>
      </div>
    </div>
  );
}