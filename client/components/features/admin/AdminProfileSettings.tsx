"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/adminApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";

// NEW IMPORTS FOR REDUX
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setCredentials } from "@/lib/store/authSlice";

export function AdminProfileSettings() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", role: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await adminApi.getProfile();
        setFormData({ name: data.name, email: data.email, mobile: data.mobile, role: data.role });
      } catch (error) {
        console.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      // 1. Update the backend database
      await adminApi.updateProfile({ name: formData.name, mobile: formData.mobile });
      
      // 2. Update the Redux store so the Navbar and Welcome Banner change instantly!
      if (user && token) {
        dispatch(setCredentials({
          user: { ...user, name: formData.name },
          token: token
        }));
      }

      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update profile.");
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;

  return (
    <Card className="max-w-2xl border-border shadow-sm">
      <CardHeader>
        <CardTitle>Administrator Profile</CardTitle>
        <CardDescription>Update your command center contact details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          {message && (
            <div className="p-3 bg-green-50 text-green-700 flex items-center gap-2 rounded-md text-sm">
              <CheckCircle2 size={16} /> {message}
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Email Address (Read-Only)</Label>
            <Input disabled value={formData.email} className="bg-muted" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input 
                value={formData.mobile || ""} 
                onChange={(e) => setFormData({...formData, mobile: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>System Role</Label>
            <Input disabled value={formData.role.toUpperCase()} className="bg-muted font-bold text-primary" />
          </div>

          <Button type="submit" disabled={isSaving} className="mt-4">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}