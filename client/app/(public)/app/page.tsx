"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smartphone, Apple, Play, BellRing, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AppComingSoonPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to save email
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail("");
    }, 1500);
  };

  return (
    <main className="min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden bg-linear-to-b from-background to-secondary/30 px-4 py-20">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-3xl mx-auto w-full flex flex-col items-center text-center z-10">
        
        {/* Back Link */}
        <Link href="/" className="self-start md:self-center mb-12">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Button>
        </Link>

        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-8 border border-primary/20 shadow-sm animate-fade-in-up">
          <Smartphone size={16} />
          <span>Mobile Experience</span>
        </div>

        {/* Main Typography */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          The GayaRent App is <br className="hidden md:block" />
          <span className="text-primary">Coming Soon.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          We're building the ultimate property management and rental experience right for your pocket. Get notified the minute it drops.
        </p>

        {/* Waitlist Form */}
        <div className="w-full max-w-md mx-auto bg-card p-2 rounded-2xl shadow-xl border border-border mb-12">
          {isSuccess ? (
            <div className="p-4 flex items-center justify-center gap-2 text-green-600 font-medium">
              <CheckCircle2 size={20} />
              <span>You're on the list! We'll be in touch.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <BellRing className="absolute left-3 text-muted-foreground" size={18} />
                <Input 
                  type="email" 
                  placeholder="Enter your email address..." 
                  className="pl-10 border-none bg-transparent shadow-none focus-visible:ring-0 text-base h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 px-8 rounded-xl font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Joining..." : "Get Notified"}
              </Button>
            </form>
          )}
        </div>

        {/* App Store Badges (Disabled state) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-50 grayscale cursor-not-allowed">
          <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-xl">
            <Apple size={28} />
            <div className="text-left">
              <p className="text-[10px] leading-none uppercase tracking-wider mb-1">Coming soon on the</p>
              <p className="text-lg leading-none font-semibold">App Store</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-xl">
            <Play size={24} className="fill-white" />
            <div className="text-left">
              <p className="text-[10px] leading-none uppercase tracking-wider mb-1">Coming soon on</p>
              <p className="text-lg leading-none font-semibold">Google Play</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}