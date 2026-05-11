"use client";
import { useState } from "react";
import { ownerApi } from "@/lib/api/ownerApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, FileSpreadsheet, CheckCircle2, Download } from "lucide-react";

export function BulkUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleDownloadTemplate = () => {
    const headers = "title,location,type,rent,size,furnishing,photos\n";
    const example = "Luxury Villa,Gaya,House,25000,2000 SqFt,Fully-Furnished,https://image.url/1.jpg|https://image.url/2.jpg";
    const blob = new Blob([headers + example], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "gayarent_bulk_template.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

 const handleUpload = async () => {
    if (!file) return setError("Please select a CSV file first.");
    setIsLoading(true);
    setError(""); setMsg("");

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter(line => line.trim() !== "");
        
        // NEW: Smart CSV splitter that ignores commas inside quotes and removes the quotes
        const splitCSV = (str: string) => {
          return str.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, ''));
        };

        const headers = splitCSV(lines[0]).map(h => h.toLowerCase());
        
        const properties = lines.slice(1).map(line => {
          const values = splitCSV(line);
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index];
          });
          return obj;
        });

        await ownerApi.bulkUploadProperties(properties);
        setMsg(`Successfully uploaded ${properties.length} properties!`);
        setTimeout(() => onSuccess(), 3000);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to process CSV file. Check format.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Bulk Upload Properties</CardTitle>
        <CardDescription>Upload a CSV file to add multiple properties at once.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {msg && <div className="p-3 bg-green-50 text-green-700 flex items-center gap-2 rounded-md"><CheckCircle2 size={16}/> {msg}</div>}
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-dashed">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="text-primary" size={24} />
            <div>
              <p className="font-medium text-sm">Need the correct format?</p>
              <p className="text-xs text-muted-foreground">Download our template to ensure your columns match perfectly.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2">
            <Download size={14} /> Template
          </Button>
        </div>

        <div className="space-y-2 pt-4">
          <Input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        <Button onClick={handleUpload} className="w-full" disabled={isLoading || !file}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Process & Upload"}
        </Button>
      </CardContent>
    </Card>
  );
}