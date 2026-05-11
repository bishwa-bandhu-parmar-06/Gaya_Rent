"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { propertyApi } from "@/lib/api/propertyApi";
import { tenantApi } from "@/lib/api/tenantApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Maximize2, Building, ArrowLeft, Loader2, Home, Heart, Share2, Star, AlertTriangle, MessageCircle, User as UserIcon } from "lucide-react";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [property, setProperty] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isSaved, setIsSaved] = useState(false);
  const [isShareCopied, setIsShareCopied] = useState(false);
  
  const [authAlert, setAuthAlert] = useState({ isOpen: false, message: "" });
  const [rateModalOpen, setRateModalOpen] = useState(false);
  
  const [ratingVal, setRatingVal] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin Contact Details (Hardcoded as requested)
  const ADMIN_NAME = "Shivam Kumar";
  const ADMIN_PHONE = "7717742739";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [propData, reviewsData] = await Promise.all([
          propertyApi.getPropertyById(id as string),
          propertyApi.getPropertyReviews(id as string)
        ]);
        
        setProperty(propData);
        setReviews(reviewsData);
        if (propData.photos) setPhotos(JSON.parse(propData.photos));
        
      } catch (error) {
        console.error("Failed to fetch property details");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchAllData();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && id) {
      tenantApi.checkSavedStatus(id as string)
        .then((data) => setIsSaved(data.isSaved))
        .catch(() => console.error("Could not verify save status"));
    }
  }, [isAuthenticated, id]);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : "New";

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsShareCopied(true);
    setTimeout(() => setIsShareCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      return setAuthAlert({ isOpen: true, message: "You must be logged in to save properties." });
    }
    try {
      const res = await tenantApi.toggleSaveProperty(property.id);
      setIsSaved(res.isSaved);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // WHATSAPP TO ADMIN LOGIC
  // ==========================================
  const handleWhatsAppClick = () => {
    if (!isAuthenticated) {
      return setAuthAlert({ isOpen: true, message: "Sign in to contact the admin via WhatsApp." });
    }

    const baseUrl = window.location.origin;
    const propertyUrl = `${baseUrl}/properties/${property.id}`;
    
    // Dynamic message using the logged-in user's name sending to Admin
    const text = `Hello ${ADMIN_NAME},\n\nI am ${user?.name || 'a seeker'} and I am interested in this property: *${property.title}*.\n\n📍 Location: ${property.location}\n💰 Rent: ₹${Number(property.rent || property.price || 0).toLocaleString()}/month\n\nPlease let me know more details.\n\nProperty Link: ${propertyUrl}`;
    
    // Hardcoded Admin Number
    const waUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const openRateModal = () => {
    if (!isAuthenticated) {
      return setAuthAlert({ isOpen: true, message: "You must be logged in to rate properties." });
    }
    if (user?.role !== "tenant") {
      return setAuthAlert({ isOpen: true, message: "Only Seekers (Tenants) can rate properties." });
    }
    setRateModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setReviewImages(files);
    }
  };

  const submitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingVal === 0) return alert("Please select a star rating.");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("rating", ratingVal.toString());
      formData.append("review", reviewText);
      reviewImages.forEach(file => formData.append("photos", file));

      await tenantApi.rateProperty(property.id, formData);
      
      const updatedReviews = await propertyApi.getPropertyReviews(property.id);
      setReviews(updatedReviews);
      
      setRateModalOpen(false);
      setRatingVal(0); setReviewText(""); setReviewImages([]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  if (!property) return <div className="min-h-screen flex flex-col items-center justify-center"><h2 className="text-2xl font-bold">Property Not Found</h2></div>;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" className="gap-2 text-muted-foreground" onClick={() => router.back()}>
            <ArrowLeft size={16} /> Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleShare}>
              <Share2 size={16} /> {isShareCopied ? "Copied!" : "Share"}
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleSave}>
              <Heart size={16} className={isSaved ? "fill-red-500 text-red-500" : ""} /> {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-video bg-muted rounded-xl overflow-hidden relative border shadow-sm">
              {photos.length > 0 ? (
                <img src={photos[0]} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Home size={64} className="opacity-20" /></div>
              )}
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
                <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 px-3 py-1 rounded-full font-bold">
                  <Star size={16} className="fill-amber-500 text-amber-500" /> {avgRating}
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-lg">
                <MapPin size={20} /><span>{property.location}</span>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Reviews ({reviews.length})</h3>
                <Button onClick={openRateModal}>Write a Review</Button>
              </div>

              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to rate!</p>
              ) : (
                <div className="space-y-6 divide-y">
                  {reviews.map(rev => (
                    <div key={rev.id} className="pt-6 first:pt-0">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{rev.reviewer_name}</span>
                        <span className="text-sm text-muted-foreground">{new Date(rev.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < rev.rating ? "fill-amber-500 text-amber-500" : "text-slate-300"} />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{rev.review}</p>
                      
                      {rev.photos && JSON.parse(rev.photos).length > 0 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                          {JSON.parse(rev.photos).map((imgUrl: string, idx: number) => (
                            <img key={idx} src={imgUrl} className="w-20 h-20 object-cover rounded-md border" alt="Review upload" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Pricing & Contact) */}
          <div className="space-y-6">
             <div className="bg-card p-6 rounded-xl border shadow-sm sticky top-24">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Monthly Rent</p>
                <h2 className="text-4xl font-black text-primary">₹{Number(property.rent).toLocaleString()}</h2>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                  
                  {/* Owner Info (Name Only) */}
                  <div className="p-4 bg-muted/40 rounded-lg space-y-3 mb-4 border border-border/50">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Property Owner</p>
                    <div className="flex items-center gap-3">
                       <UserIcon size={18} className="text-primary" />
                       <p className="font-medium text-lg">{property.owner_name}</p>
                    </div>
                  </div>

                  {/* Admin Info (Contact Details) */}
                  <div className="p-4 bg-primary/5 rounded-lg space-y-3 border border-primary/10">
                    <p className="text-xs text-primary uppercase font-semibold">Platform Admin</p>
                    <div className="flex items-center gap-3">
                      <UserIcon size={18} className="text-muted-foreground" />
                      <span className="font-medium">{ADMIN_NAME}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone size={18} /> <span>{ADMIN_PHONE}</span>
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <Button 
                    className="w-full text-lg h-12 mt-6 gap-2 bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleWhatsAppClick}
                  >
                    <MessageCircle size={20} />
                    Contact via WhatsApp
                  </Button>
                </div>
             </div>
          </div>
        </div>
      </div>

      <Dialog open={authAlert.isOpen} onOpenChange={(open) => setAuthAlert({ ...authAlert, isOpen: open })}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="flex flex-col items-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4"><AlertTriangle size={24} /></div>
            <DialogTitle className="text-xl">Authentication Required</DialogTitle>
            <DialogDescription className="pt-2 text-base">{authAlert.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button variant="outline" onClick={() => setAuthAlert({ isOpen: false, message: "" })}>Cancel</Button>
            <Button onClick={() => router.push("/selection")}>Go to Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rateModalOpen} onOpenChange={setRateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate this Property</DialogTitle>
            <DialogDescription>Share your experience to help other seekers.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRating} className="space-y-6 mt-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} size={32} 
                  className={`cursor-pointer transition-colors ${ratingVal >= star ? "fill-amber-500 text-amber-500" : "text-slate-300 hover:text-amber-400"}`}
                  onClick={() => setRatingVal(star)}
                />
              ))}
            </div>
            <Textarea 
              placeholder="Write your review here..." 
              value={reviewText} onChange={(e) => setReviewText(e.target.value)} 
              className="min-h-25"
            />
            <div>
              <p className="text-sm font-medium mb-2">Upload Photos (Optional, Max 5)</p>
              <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
              <p className="text-xs text-muted-foreground mt-1">{reviewImages.length} file(s) selected.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRateModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Post Review"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </main>
  );
}