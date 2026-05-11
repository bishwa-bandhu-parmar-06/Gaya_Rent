// components/features/properties/PropertyFilters.tsx
'use client';

import { useState } from "react";
import { Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FilterValues {
  priceRange: [number, number];
  bhkTypes: number[];
  furnishingTypes: string[];
  amenities: string[];
  minRating: number;
  sortBy: string;
  propertyAge: string;
  availableFrom: string;
}

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  totalResults: number;
  onClose?: () => void;
  isMobile?: boolean;
}

export function PropertyFilters({ onFilterChange, totalResults, onClose, isMobile }: PropertyFiltersProps) {
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({
    budget: true,
    bhk: true,
    furnishing: true,
    amenities: true,
    rating: true,
    advanced: false,
  });

  const [filters, setFilters] = useState<FilterValues>({
    priceRange: [10000, 100000],
    bhkTypes: [],
    furnishingTypes: [],
    amenities: [],
    minRating: 0,
    sortBy: "latest",
    propertyAge: "any",
    availableFrom: "any",
  });

  const toggleSection = (section: string) => {
    setIsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBHKChange = (bhk: number) => {
    const newBHKs = filters.bhkTypes.includes(bhk)
      ? filters.bhkTypes.filter(b => b !== bhk)
      : [...filters.bhkTypes, bhk];
    updateFilter("bhkTypes", newBHKs);
  };

  const handleAmenityChange = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilter("amenities", newAmenities);
  };

  const handleFurnishingChange = (type: string) => {
    const newTypes = filters.furnishingTypes.includes(type)
      ? filters.furnishingTypes.filter(t => t !== type)
      : [...filters.furnishingTypes, type];
    updateFilter("furnishingTypes", newTypes);
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [10000, 100000],
      bhkTypes: [],
      furnishingTypes: [],
      amenities: [],
      minRating: 0,
      sortBy: "latest",
      propertyAge: "any",
      availableFrom: "any",
    });
    onFilterChange({
      priceRange: [10000, 100000],
      bhkTypes: [],
      furnishingTypes: [],
      amenities: [],
      minRating: 0,
      sortBy: "latest",
      propertyAge: "any",
      availableFrom: "any",
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.bhkTypes.length > 0) count += filters.bhkTypes.length;
    if (filters.furnishingTypes.length > 0) count += filters.furnishingTypes.length;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.minRating > 0) count++;
    if (filters.priceRange[0] > 10000 || filters.priceRange[1] < 100000) count++;
    if (filters.sortBy !== "latest") count++;
    if (filters.propertyAge !== "any") count++;
    if (filters.availableFrom !== "any") count++;
    return count;
  };

  const FilterSection = ({ title, section, children }: { title: string; section: string; children: React.ReactNode }) => (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full py-2 font-semibold text-sm hover:text-primary transition-colors"
      >
        <span>{title}</span>
        {isExpanded[section] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isExpanded[section] && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`bg-card rounded-xl border border-border ${isMobile ? 'h-full overflow-y-auto' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          <h2 className="font-bold text-lg">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
            Clear All
          </Button>
          {isMobile && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              <X size={16} />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Sort By Section */}
        <FilterSection title="Sort By" section="sort">
          <RadioGroup
            value={filters.sortBy}
            onValueChange={(value) => updateFilter("sortBy", value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="latest" id="latest" />
              <Label htmlFor="latest" className="cursor-pointer">Latest First</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price_low" id="price_low" />
              <Label htmlFor="price_low" className="cursor-pointer">Price: Low to High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price_high" id="price_high" />
              <Label htmlFor="price_high" className="cursor-pointer">Price: High to Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rating" id="rating" />
              <Label htmlFor="rating" className="cursor-pointer">Highest Rated</Label>
            </div>
          </RadioGroup>
        </FilterSection>

        {/* Budget Filter */}
        <FilterSection title="Budget (Monthly Rent)" section="budget">
          <div className="space-y-4">
            <Slider
              min={5000}
              max={200000}
              step={5000}
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
              className="mt-2"
            />
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="text"
                  value={`₹${filters.priceRange[0].toLocaleString()}`}
                  readOnly
                  className="text-sm mt-1"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="text"
                  value={`₹${filters.priceRange[1].toLocaleString()}`}
                  readOnly
                  className="text-sm mt-1"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* BHK Type Filter */}
        <FilterSection title="BHK Type" section="bhk">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5].map((bhk) => (
              <div key={bhk} className="flex items-center space-x-2">
                <Checkbox
                  id={`bhk-${bhk}`}
                  checked={filters.bhkTypes.includes(bhk)}
                  onCheckedChange={() => handleBHKChange(bhk)}
                />
                <Label htmlFor={`bhk-${bhk}`} className="cursor-pointer text-sm">
                  {bhk} BHK {(bhk === 5 && " +")}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Furnishing Type Filter */}
        <FilterSection title="Furnishing" section="furnishing">
          <div className="space-y-2">
            {["Fully Furnished", "Semi-Furnished", "Unfurnished"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.furnishingTypes.includes(type)}
                  onCheckedChange={() => handleFurnishingChange(type)}
                />
                <Label htmlFor={type} className="cursor-pointer text-sm">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Rating Filter */}
        <FilterSection title="Customer Ratings" section="rating">
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.minRating === rating}
                  onCheckedChange={() => updateFilter("minRating", filters.minRating === rating ? 0 : rating)}
                />
                <Label htmlFor={`rating-${rating}`} className="cursor-pointer text-sm flex items-center gap-1">
                  {rating}+ Stars
                  <span className="text-yellow-500">★</span>
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Amenities Filter */}
        <FilterSection title="Amenities" section="amenities">
          <div className="space-y-2">
            {[
              "Parking", "Gym", "Swimming Pool", "Lift", "Security", 
              "Power Backup", "Washing Machine", "AC", "Geyser", "Balcony"
            ].map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityChange(amenity)}
                />
                <Label htmlFor={amenity} className="cursor-pointer text-sm">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Advanced Filters */}
        <FilterSection title="Advanced Filters" section="advanced">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Property Age</Label>
              <RadioGroup
                value={filters.propertyAge}
                onValueChange={(value) => updateFilter("propertyAge", value)}
                className="mt-2 space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="any" id="age-any" />
                  <Label htmlFor="age-any" className="cursor-pointer text-sm">Any</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="age-new" />
                  <Label htmlFor="age-new" className="cursor-pointer text-sm">New Construction</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-5" id="age-1-5" />
                  <Label htmlFor="age-1-5" className="cursor-pointer text-sm">1-5 Years Old</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5+" id="age-5+" />
                  <Label htmlFor="age-5+" className="cursor-pointer text-sm">5+ Years Old</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium">Available From</Label>
              <RadioGroup
                value={filters.availableFrom}
                onValueChange={(value) => updateFilter("availableFrom", value)}
                className="mt-2 space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="any" id="available-any" />
                  <Label htmlFor="available-any" className="cursor-pointer text-sm">Anytime</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="immediate" id="available-immediate" />
                  <Label htmlFor="available-immediate" className="cursor-pointer text-sm">Immediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15-days" id="available-15" />
                  <Label htmlFor="available-15" className="cursor-pointer text-sm">Within 15 Days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30-days" id="available-30" />
                  <Label htmlFor="available-30" className="cursor-pointer text-sm">Within 30 Days</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </FilterSection>

        {/* Results Count */}
        <div className="pt-4 border-t border-border">
          <Button className="w-full" onClick={() => onFilterChange(filters)}>
            Show {totalResults} Results
          </Button>
        </div>
      </div>
    </div>
  );
}