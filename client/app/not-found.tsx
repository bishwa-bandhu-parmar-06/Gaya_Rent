import { Button } from "@/components/ui/button";
import { Home, MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-background">
      {/* Icon Container */}
      <div className="bg-primary/10 p-6 rounded-full mb-6 text-primary animate-bounce">
        <MapPinOff size={64} strokeWidth={1.5} />
      </div>
      
      {/* Text Content */}
      <h1 className="text-7xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
        Looks like you're lost
      </h2>
      <p className="text-muted-foreground max-w-md mb-8 text-base md:text-lg">
        We couldn't find the page or property you're looking for. It might have been rented out, moved, or never existed!
      </p>
      
      {/* FIX: Use standard <a> tag instead of Next.js <Link> to force a clean reload */}
      <a href="/">
        <Button size="lg" className="gap-2 font-semibold shadow-lg hover:shadow-xl transition-all">
          <Home size={18} />
          Back to Home
        </Button>
      </a>
    </div>
  );
}