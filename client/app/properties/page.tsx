// app/properties/page.tsx
'use client';

import { useState, useEffect } from "react";
import { propertyApi } from "@/lib/api/propertyApi"; // Import your API
import { PropertyCard } from "@/components/features/properties/PropertyCard";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyFilters } from "@/components/features/properties/PropertyFilters";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
const ITEMS_PER_PAGE = 50;

export default function PropertiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [10000, 100000] as [number, number],
    bhkTypes: [] as number[],
    furnishingTypes: [] as string[],
    amenities: [] as string[],
    minRating: 0,
    sortBy: "latest",
    propertyAge: "any",
    availableFrom: "any",
  });

  // Fetch properties from backend
  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        minRent: filters.priceRange[0],
        maxRent: filters.priceRange[1] === 100000 ? undefined : filters.priceRange[1], // Ignore max if it's the absolute max
        furnishing: filters.furnishingTypes.join(',') || undefined,
        bhk: filters.bhkTypes.join(',') || undefined,
        minRating: filters.minRating || undefined,
        sort: filters.sortBy !== "latest" ? filters.sortBy : undefined
      };

      const data = await propertyApi.getAllProperties(params);
      setProperties(data.properties);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger API call with a 500ms debounce when filters or search change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filters, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    if (window.innerWidth < 1024) setIsMobileFilterOpen(false);
  };

  const clearSingleFilter = (filterType: string) => {
    const newFilters = { ...filters };
    switch (filterType) {
      case "price": newFilters.priceRange = [10000, 100000]; break;
      case "bhk": newFilters.bhkTypes = []; break;
      case "furnishing": newFilters.furnishingTypes = []; break;
      case "rating": newFilters.minRating = 0; break;
      case "sort": newFilters.sortBy = "latest"; break;
    }
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Sticky Search Header */}
      <div className="bg-card border-b sticky top-16 z-30 py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search by locality, project or owner..." 
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="hidden md:block text-sm font-medium text-muted-foreground">
            {isLoading ? "Updating results..." : `Showing ${properties.length} of ${totalItems} Properties`}
          </div>
          
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden relative">
                <SlidersHorizontal size={18} /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm p-0">
              <PropertyFilters onFilterChange={handleFilterChange} totalResults={totalItems} onClose={() => setIsMobileFilterOpen(false)} isMobile={true} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-80 shrink-0">
          <PropertyFilters onFilterChange={handleFilterChange} totalResults={totalItems} />
        </aside>

        {/* Property Grid */}
        <main className="flex-1 space-y-8">
          {isLoading ? (
            <div className="h-[50vh] flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
              <p className="mt-4 text-muted-foreground font-medium">Fetching best properties for you...</p>
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Server-Side Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-10 border-t">
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft size={20} />
                  </Button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button key={i + 1} variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => setCurrentPage(i + 1)} className="w-10 h-10">
                      {i + 1}
                    </Button>
                  ))}

                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    <ChevronRight size={20} />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              <div className="bg-muted p-6 rounded-full mb-4"><Search size={40} className="text-muted-foreground" /></div>
              <h3 className="text-xl font-bold">No Properties Found</h3>
              <p className="text-muted-foreground mt-2">Try clearing your filters or adjusting your budget.</p>
              <Button variant="outline" className="mt-4" onClick={() => clearSingleFilter("all")}>Clear All Filters</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}