// app/page.tsx
'use client';

import { useState, useEffect } from "react";
import { Hero } from "@/components/features/home/Hero";
import { PropertyCard } from "@/components/features/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { propertyApi } from "@/lib/api/propertyApi"; // Import your API
export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        // Fetch only the top 6 approved properties for the home page
        const data = await propertyApi.getAllProperties({ limit: 30 });
        setFeaturedProperties(data.properties);
      } catch (error) {
        console.error("Failed to fetch featured properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Hero />

      <section className="w-full bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Listings</h2>
              <p className="text-muted-foreground">Handpicked properties just for you</p>
            </div>
            <Link href="/properties">
              <Button variant="ghost" className="gap-2 group">
                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-xl border border-dashed text-muted-foreground">
              No properties available right now. Check back soon!
            </div>
          )}
        </div>
      </section>
    </main>
  );
}