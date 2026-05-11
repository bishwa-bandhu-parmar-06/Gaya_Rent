"use client";
import { useState } from "react";
import { authApi } from "@/lib/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, User, Mail, Lock, Phone, FileText, IdCard, Upload, Building2, Briefcase } from "lucide-react";
import Link from "next/link";

export function OwnerRegisterForm({ onSwitchToLogin }: { onSwitchToLogin?: () => void }) {
  const [formData, setFormData] = useState({ 
    name: "", email: "", mobile: "", password: "", confirmPassword: "", docType: "PAN", docId: "", companyName: "", gstNumber: ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be strictly under 5MB.");
        setFile(null);
        e.target.value = "";
      } else if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are allowed for documents.");
        setFile(null);
        e.target.value = "";
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      setError("Please agree to the Terms and Conditions");
      return;
    }
    
    if (!file) {
      setError("Please upload a government document.");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setError("");
    setSuccess("");
    setIsLoading(true);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("mobile", formData.mobile);
    submitData.append("password", formData.password);
    submitData.append("role", "owner");
    submitData.append("docType", formData.docType);
    submitData.append("docId", formData.docId);
    submitData.append("companyName", formData.companyName);
    submitData.append("gstNumber", formData.gstNumber);
    submitData.append("document", file);

    try {
      await authApi.registerOwner(submitData);
      
      setSuccess("Partner account created! Your documents are pending admin review.");
      setTimeout(() => {
        setFormData({ name: "", email: "", mobile: "", password: "", confirmPassword: "", docType: "PAN", docId: "", companyName: "", gstNumber: "" });
        setFile(null);
        setAgreeTerms(false);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <CardHeader className="px-0 text-center pt-0">
        <CardTitle className="text-2xl font-bold">Become a Partner</CardTitle>
        <CardDescription>Register to list and manage your properties</CardDescription>
      </CardHeader>
      
      <CardContent className="px-0 space-y-5">
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md">
              {success}
            </div>
          )}
          
          {/* Name and Mobile Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User size={16} />
                </div>
                <Input
                  id="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-9 h-10 text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="mobile" className="text-sm font-medium">Mobile Number</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Phone size={16} />
                </div>
                <Input
                  id="mobile"
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="pl-9 h-10 text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail size={16} />
              </div>
              <Input
                id="email"
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>

          {/* Business Information Section */}
          <div className="bg-muted/30 dark:bg-secondary/20 rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/5 border-b border-border">
              <Briefcase size={16} className="text-primary" />
              <Label className="font-semibold text-sm text-foreground">Business Information</Label>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-xs font-medium">Company Name</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Building2 size={14} />
                    </div>
                    <Input
                      id="companyName"
                      required
                      placeholder="Your Business Name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gstNumber" className="text-xs font-medium">GST Number (Optional)</Label>
                  <Input
                    id="gstNumber"
                    placeholder="22AAAAA0000A1Z"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Identity Verification Section */}
          <div className="bg-muted/30 dark:bg-secondary/20 rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/5 border-b border-border">
              <FileText size={16} className="text-primary" />
              <Label className="font-semibold text-sm text-foreground">Identity Verification</Label>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="docType" className="text-xs font-medium">Document Type</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <IdCard size={14} />
                    </div>
                    <select 
                      id="docType"
                      className="w-full h-9 pl-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.docType}
                      onChange={(e) => setFormData({...formData, docType: e.target.value})}
                    >
                      <option value="PAN">PAN Card</option>
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="VoterID">Voter ID</option>
                      <option value="Passport">Passport</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="docId" className="text-xs font-medium">Document ID Number</Label>
                  <Input 
                    id="docId"
                    required 
                    placeholder="Enter ID number..." 
                    value={formData.docId} 
                    onChange={(e) => setFormData({...formData, docId: e.target.value})}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="document" className="text-xs font-medium">Upload Document (PDF, Max 5MB)</Label>
                <Input 
                  id="document"
                  type="file" 
                  accept="application/pdf" 
                  onChange={handleFileChange} 
                  required
                  className="h-9 text-sm cursor-pointer file:cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <p className="text-xs text-muted-foreground">
                  Upload clear scanned copy of your document (PDF only, max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock size={16} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-9 pr-9 h-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock size={16} />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="pl-9 pr-9 h-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2 pt-1">
            <Checkbox 
              id="terms" 
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              className="mt-0.5"
            />
            <label
              htmlFor="terms"
              className="text-xs leading-relaxed text-muted-foreground cursor-pointer"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          
          {/* Register Button */}
          <Button type="submit" className="w-full h-10 text-sm" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Register as Partner"}
          </Button>
          
          {/* Login Link */}
          {/* Login Link - UPDATED */}
          <div className="text-center text-sm text-muted-foreground">
            Already have a partner account?{" "}
            {onSwitchToLogin ? (
               <button 
                 type="button" 
                 onClick={onSwitchToLogin} 
                 className="text-primary hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
               >
                 Sign in
               </button>
            ) : (
              <Link href="/login?role=owner" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            )}
          </div>
        </form>
      </CardContent>
    </div>
  );
}