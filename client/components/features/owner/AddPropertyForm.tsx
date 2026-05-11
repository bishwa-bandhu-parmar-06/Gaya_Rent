"use client";
import { useState } from "react";
import { ownerApi } from "@/lib/api/ownerApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";

export function AddPropertyForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(""); setSuccessMsg("");

    const form = e.currentTarget;
    const formData = new FormData();
    formData.append("title", (form.elements.namedItem("title") as HTMLInputElement).value);
    formData.append("location", (form.elements.namedItem("location") as HTMLInputElement).value);
    formData.append("type", (form.elements.namedItem("type") as HTMLSelectElement).value);
    formData.append("rent", (form.elements.namedItem("rent") as HTMLInputElement).value);
    formData.append("size", (form.elements.namedItem("size") as HTMLInputElement).value);
    formData.append("furnishing", (form.elements.namedItem("furnishing") as HTMLSelectElement).value);

    if (files) {
      Array.from(files).forEach((file) => formData.append("photos", file));
    }

    try {
      await ownerApi.addProperty(formData);
      setSuccessMsg("Property submitted! It will be visible to tenants once approved by an Admin.");
      form.reset();
      setFiles(null);
      setTimeout(() => onSuccess(), 3000); // Switch tab back to list after 3s
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Failed to add property.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Post a New Property</CardTitle>
        <CardDescription>Fill out the details below. Note: All new properties require Admin approval before going live.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMsg && <div className="p-3 bg-green-50 text-green-700 flex items-center gap-2 rounded-md"><CheckCircle2 size={16}/> {successMsg}</div>}
          {errorMsg && <div className="p-3 bg-red-50 text-red-700 rounded-md">{errorMsg}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Property Title</Label><Input name="title" required placeholder="e.g. Luxury 2BHK in City Center" /></div>
            <div className="space-y-2"><Label>Location</Label><Input name="location" required placeholder="Full Address or Area" /></div>
            
            <div className="space-y-2">
              <Label>Property Type</Label>
              <select name="type" required className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="Apartment">Apartment</option>
                <option value="House">Independent House</option>
                <option value="PG">PG / Hostel</option>
                <option value="Commercial">Commercial Space</option>
              </select>
            </div>
            
            <div className="space-y-2"><Label>Monthly Rent (₹)</Label><Input name="rent" type="number" required placeholder="15000" /></div>
            <div className="space-y-2"><Label>Size (Sq.Ft / BHK)</Label><Input name="size" required placeholder="e.g. 1200 Sq.Ft or 2 BHK" /></div>
            
            <div className="space-y-2">
              <Label>Furnishing Status</Label>
              <select name="furnishing" required className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully-Furnished">Fully-Furnished</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label>Property Photos (Max 5)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center bg-muted/10">
              <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
              <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="max-w-xs" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit for Approval"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}