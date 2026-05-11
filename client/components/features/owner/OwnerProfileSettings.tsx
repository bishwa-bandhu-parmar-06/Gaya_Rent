"use client";
import { useEffect, useState } from "react";
import { ownerApi } from "@/lib/api/ownerApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";

// NEW IMPORTS FOR REDUX
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setCredentials } from "@/lib/store/authSlice";

export function OwnerProfileSettings() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", address: "", occupation: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    ownerApi.getProfile().then(data => {
      setFormData({ name: data.name, email: data.email, mobile: data.mobile, address: data.address || "", occupation: data.occupation || "" });
      setIsLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Update the backend database
      await ownerApi.updateProfile({ name: formData.name, mobile: formData.mobile, address: formData.address, occupation: formData.occupation });
      
      // 2. Update Redux so the Dashboard Header changes instantly
      if (user && token) {
        dispatch(setCredentials({
          user: { ...user, name: formData.name },
          token: token
        }));
      }

      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setMsg("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>;

  return (
    <Card className="max-w-2xl shadow-sm border-border">
      <CardHeader><CardTitle>Profile Details</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          {msg && <div className="p-3 bg-green-50 text-green-700 flex items-center gap-2 rounded-md"><CheckCircle2 size={16} /> {msg}</div>}
          <div className="space-y-2"><Label>Email</Label><Input disabled value={formData.email} className="bg-muted" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Mobile</Label><Input value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} required /></div>
          </div>
          <div className="space-y-2"><Label>Address</Label><Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Your full residential address" /></div>
          <div className="space-y-2"><Label>Occupation</Label><Input value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})} placeholder="e.g. Business Owner" /></div>
          <Button type="submit" disabled={isSaving}>{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Profile"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}