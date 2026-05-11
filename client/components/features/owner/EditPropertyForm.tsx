"use client";
import { useState, useEffect } from "react";
import { ownerApi } from "@/lib/api/ownerApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UploadCloud, CheckCircle2, ArrowLeft } from "lucide-react";

export function EditPropertyForm({ property, onCancel, onSuccess }: { property: any, onCancel: () => void, onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData();
    formData.append("title", (form.elements.namedItem("title") as HTMLInputElement).value);
    formData.append("location", (form.elements.namedItem("location") as HTMLInputElement).value);
    formData.append("type", (form.elements.namedItem("type") as HTMLSelectElement).value);
    formData.append("rent", (form.elements.namedItem("rent") as HTMLInputElement).value);
    formData.append("size", (form.elements.namedItem("size") as HTMLInputElement).value);
    formData.append("furnishing", (form.elements.namedItem("furnishing") as HTMLSelectElement).value);

    // If new files are selected, append them. Otherwise, send back the existing JSON string.
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => formData.append("photos", file));
    } else {
      formData.append("photos", property.photos);
    }

    try {
      await ownerApi.editProperty(property.id, formData);
      alert("Property updated successfully! It is now pending admin review.");
      onSuccess();
    } catch (err: any) {
      alert("Failed to update property.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm relative">
      <Button variant="ghost" size="sm" onClick={onCancel} className="absolute top-4 right-4 gap-2">
        <ArrowLeft size={16} /> Back to List
      </Button>
      <CardHeader>
        <CardTitle>Edit Property</CardTitle>
        <CardDescription>Updating this listing will revert its status to Pending Review.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Property Title</Label><Input name="title" defaultValue={property.title} required /></div>
            <div className="space-y-2"><Label>Location</Label><Input name="location" defaultValue={property.location} required /></div>
            
            <div className="space-y-2">
              <Label>Property Type</Label>
              <select name="type" defaultValue={property.type} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="Apartment">Apartment</option>
                <option value="House">Independent House</option>
                <option value="PG">PG / Hostel</option>
                <option value="Commercial">Commercial Space</option>
              </select>
            </div>
            
            <div className="space-y-2"><Label>Monthly Rent (₹)</Label><Input name="rent" type="number" defaultValue={property.rent} required /></div>
            <div className="space-y-2"><Label>Size</Label><Input name="size" defaultValue={property.size} required /></div>
            
            <div className="space-y-2">
              <Label>Furnishing Status</Label>
              <select name="furnishing" defaultValue={property.furnishing} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully-Furnished">Fully-Furnished</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label>Replace Photos (Leave empty to keep existing images)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center bg-muted/10">
              <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
              <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="max-w-xs" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Property"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}