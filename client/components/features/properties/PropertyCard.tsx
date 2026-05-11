"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { tenantApi } from "@/lib/api/tenantApi";
import { 
  MapPin, Star, Maximize2, Heart, AlertTriangle, 
  MessageCircle, Bed, Bath, Shield, Eye, Home 
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface PropertyData {
  id: string | number;
  title: string;
  location: string;
  rent?: number;
  price?: number;
  bhk?: string | number;
  size?: string;
  area?: string | number;
  bathrooms?: number;
  amenities?: string[];
  securityDeposit?: number;
  ownerPhone?: string;
  average_rating?: string | number;
  rating?: string | number;
  photos?: string;
  image?: string;
  isVerified?: boolean;
  verified?: boolean;
  isFeatured?: boolean;
  type?: string;
  owner_name?: string;
}

export function PropertyCard({ property }: { property: PropertyData }) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [isSaved, setIsSaved] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (isAuthenticated && property?.id) {
      tenantApi.checkSavedStatus(property.id)
        .then((data) => setIsSaved(data.isSaved))
        .catch(() => console.error("Could not verify save status"));
    }
  }, [isAuthenticated, property?.id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setAlertMessage("Sign in to save properties to your wishlist.");
      setIsAlertOpen(true);
      return;
    }
    
    try {
      const res = await tenantApi.toggleSaveProperty(property.id);
      setIsSaved(res.isSaved);
    } catch (err) {
      console.error("Failed to save property");
    }
  };

  // ==========================================
  // UPDATED WHATSAPP LOGIC
  // ==========================================
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setAlertMessage("Sign in to contact the admin via WhatsApp.");
      setIsAlertOpen(true);
      return;
    }

    const baseUrl = window.location.origin;
    const propertyUrl = `${baseUrl}/properties/${property.id}`;
    
    // Dynamic message using the logged-in user's name
    const text = `Hello Shivam Kumar,\n\nI am ${user?.name || 'a seeker'} and I am interested in this property: *${property.title}*.\n\n📍 Location: ${property.location}\n💰 Rent: ₹${Number(property.rent || property.price || 0).toLocaleString()}/month\n\nPlease let me know more details.\n\nProperty Link: ${propertyUrl}`;
    
    // Hardcoded Admin Number
    const waUrl = `https://wa.me/7717742739?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  let mainImage: string | null = null;
  try {
    if (property.photos) {
      const photoArray = JSON.parse(property.photos);
      if (photoArray.length > 0) mainImage = photoArray[0];
    } else if (property.image) {
      mainImage = property.image;
    }
  } catch (error) {
    console.warn("Could not parse property photos");
  }

  const rating = property.average_rating ? Number(property.average_rating).toFixed(1) : (property.rating || "New");
  const priceValue = property.rent || property.price || 0;
  const isVerified = property.isVerified || property.verified;
  const isFeatured = property.isFeatured || false;

  return (
    <>
      <Card className="group relative overflow-hidden border-border bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full cursor-pointer">
        
        <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-2 pointer-events-none">
          {isFeatured && (
            <Badge className="bg-linear-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg pointer-events-auto">
              <Star size={12} className="mr-1 fill-white" />
              Featured
            </Badge>
          )}
          <Badge variant="secondary" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm pointer-events-auto">
            {property.type || "Residential"}
          </Badge>
        </div>

        <button 
          onClick={handleSave}
          className="absolute top-3 right-3 z-20 p-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer group/save"
          title={isSaved ? "Remove from saved" : "Save to wishlist"}
        >
          <Heart 
            size={18} 
            className={`transition-all duration-300 ${isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground group-hover/save:text-red-500"}`} 
          />
        </button>

        <Link href={`/properties/${property.id}`} className="block relative overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 shrink-0">
          <div className="aspect-4/3 sm:aspect-16/10 relative">
            {!isImageLoaded && mainImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {mainImage ? (
              <img 
                src={mainImage} 
                alt={property.title} 
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted">
                <Home size={48} className="mb-2 opacity-30" />
                <span className="text-sm italic">No Image</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <Button variant="secondary" size="sm" className="gap-2 shadow-lg">
                <Eye size={16} />
                Quick View
              </Button>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 z-10 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-sm font-bold shadow-lg">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-white">{rating}</span>
          </div>
        </Link>

        <CardContent className="p-4 sm:p-5 space-y-3 grow flex flex-col">
          <Link href={`/properties/${property.id}`} className="block">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-base sm:text-lg line-clamp-1 group-hover:text-primary transition-colors cursor-pointer flex-1">
                {property.title}
              </h3>
              {isVerified && (
                <span title="Verified Property" className="shrink-0 mt-1 flex">
                  <Shield size={16} className="text-green-500" />
                </span>
              )}
            </div>
          </Link>

          <div className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm">
            <MapPin size={14} className="shrink-0 text-primary" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 mt-auto border-y border-border/60">
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <Bed size={16} className="text-primary" />
              <span className="text-xs font-medium">{property.bhk} BHK</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 text-center border-x border-border/60">
              <Maximize2 size={16} className="text-primary" />
              <span className="text-xs font-medium">{property.size || `${property.area || 800} sq.ft`}</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <Bath size={16} className="text-primary" />
              <span className="text-xs font-medium">{property.bathrooms || 2} Bath</span>
            </div>
          </div>
        </CardContent>

        {/* UPDATED FOOTER LAYOUT 
          Prevents buttons from getting cut off on smaller screens
        */}
        <CardFooter className="p-4 sm:p-5 pt-0 flex flex-col gap-4 mt-auto border-t border-transparent shrink-0">
          
          {/* Price Row */}
          <div className="flex w-full justify-between items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-primary truncate">₹{Number(priceValue).toLocaleString()}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">/mo</span>
            </div>
          </div>
          
          {/* Buttons Row - Split 50/50 */}
          <div className="flex gap-2 w-full">
            <Button
              size="sm"
              variant="outline"
              onClick={handleWhatsAppClick}
              className="flex-1 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 gap-1.5"
            >
              <MessageCircle size={16} />
              WhatsApp
            </Button>
            
            <Link href={`/properties/${property.id}`} className="flex-1">
              <Button size="sm" className="w-full font-semibold gap-1.5 group/btn">
                Details
                <Eye size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

        </CardFooter>
      </Card>

      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent className="w-[90vw] max-w-md rounded-xl p-6 text-center">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={28} className="text-amber-600" />
            </div>
            <DialogTitle className="text-lg sm:text-xl">Authentication Required</DialogTitle>
            <DialogDescription className="pt-2 text-sm sm:text-base">
              {alertMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-4">
            <Button variant="outline" onClick={() => setIsAlertOpen(false)} className="w-full sm:w-auto order-2 sm:order-1">
              Cancel
            </Button>
            <Button onClick={() => router.push("/tenant/auth")} className="w-full sm:w-auto order-1 sm:order-2">
              Sign In to Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}