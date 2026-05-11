"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building, Home as HomeIcon, TrendingUp, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "" });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return; 
    router.push(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleNearMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setAlertConfig({ 
        isOpen: true, 
        title: "Unsupported Browser", 
        message: "Geolocation is not supported by your browser." 
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          const city = data.city || data.locality;
          
          if (city) {
            setSearchQuery(city);
            router.push(`/properties?search=${encodeURIComponent(city)}`);
          } else {
            setAlertConfig({ 
              isOpen: true, 
              title: "Location Not Specific", 
              message: "Could not determine your exact city. Please type it manually." 
            });
          }
        } catch (error) {
          setAlertConfig({ 
            isOpen: true, 
            title: "Connection Error", 
            message: "Failed to find your location. Please type it manually." 
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setAlertConfig({ 
          isOpen: true, 
          title: "Permission Denied", 
          message: "Please allow location access in your browser to use the 'Near me' feature." 
        });
        setIsLocating(false);
      }
    );
  };

  return (
    <section className="w-full bg-linear-to-b from-background to-secondary/30 dark:from-background dark:to-secondary/20 py-16 md:py-24 flex flex-col items-center justify-center text-center px-4">
      <div className="w-full max-w-4xl mx-auto animate-fadeIn">
        {/* Headline - Responsive Sizes */}
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/70 bg-clip-text text-transparent mb-6 leading-tight">
          Find your next
          <span className="text-primary block sm:inline"> rental home</span>
        </h1>
        
        <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 px-4">
          Discover verified properties, connect with owners directly, and get matches on WhatsApp instantly.
        </p>

        {/* Updated Search Form - Decreased mobile width & centered */}
        <form 
          onSubmit={handleSearch}
          className="w-full max-w-lg md:max-w-3xl mx-auto bg-card dark:bg-card rounded-2xl shadow-xl border border-border p-2 flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-ring"
        >
          <div className="flex-1 w-full flex items-center gap-2 px-3 border-b sm:border-b-0 border-border sm:pb-0 pb-1">
            <Search className="text-muted-foreground shrink-0" size={20} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location, flats..."
              required 
              className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-3 text-sm md:text-base"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto p-1 sm:p-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleNearMe}
              disabled={isLocating}
              className="flex-1 sm:flex-none flex items-center gap-2 h-11 px-4 cursor-pointer dark:border-border dark:hover:bg-secondary"
            >
              {isLocating ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
              <span className="text-xs md:text-sm whitespace-nowrap">{isLocating ? "Locating..." : "Near me"}</span>
            </Button>
            
            <Button type="submit" className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 font-bold cursor-pointer text-xs md:text-sm">
              SEARCH
            </Button>
          </div>
        </form>
        
        {/* Responsive Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12 text-sm text-muted-foreground font-medium">
          <div className="flex items-center gap-2">
            <Building size={16} className="text-primary" />
            <span>10,000+ Properties</span>
          </div>
          <div className="flex items-center gap-2">
            <HomeIcon size={16} className="text-primary" />
            <span>Verified Listings</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <span>Zero Brokerage</span>
          </div>
        </div>
      </div>

      {/* Custom Alert Dialog */}
      <Dialog open={alertConfig.isOpen} onOpenChange={(isOpen) => setAlertConfig(prev => ({ ...prev, isOpen }))}>
        <DialogContent className="w-[90%] sm:max-w-md rounded-2xl">
          <DialogHeader className="flex flex-col items-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <DialogTitle className="text-xl text-center">{alertConfig.title}</DialogTitle>
            <DialogDescription className="pt-2 text-base text-center">
              {alertConfig.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-6">
            <Button className="w-full sm:w-auto" onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}>
              Understood
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}