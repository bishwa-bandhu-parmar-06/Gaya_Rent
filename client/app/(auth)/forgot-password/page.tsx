"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  // States
  const [step, setStep] = useState<1 | 2>(1); // 1: Verify ID, 2: Reset Password
  const [formData, setFormData] = useState({ loginId: "", newPassword: "", confirmPassword: "" });
  
  // UI States
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // STEP 1: Verify if the account exists
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 
    setIsLoading(true);

    try {
      // We will create this API call next
      await authApi.verifyUser({ loginId: formData.loginId });
      
      // If successful, move to step 2
      setSuccess("Account found. Please enter your new password.");
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Account does not exist.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Actual Password Reset
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword({
        loginId: formData.loginId,
        newPassword: formData.newPassword
      });
      setSuccess("Password updated successfully! You can now sign in.");
      setStep(1);
      setFormData({ loginId: "", newPassword: "", confirmPassword: "" });
      
      // Auto-redirect back after 2 seconds
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic Back Button Logic
  const handleGoBack = () => {
    // router.back() safely returns the user to /admin/auth, /tenant/auth, or /owner/auth
    // depending on exactly where they clicked the "Forgot Password" link!
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/selection"); // Fallback if they opened the link directly
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 dark:bg-background">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {step === 1 
              ? "Enter your registered email or mobile number to locate your account." 
              : "Secure your account with a new password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          {error && <div className="mb-4 p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">{error}</div>}
          {success && <div className="mb-4 p-3 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md flex items-center gap-2"><CheckCircle2 size={16}/>{success}</div>}

          {/* Render Step 1 Form */}
          {step === 1 && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label>Email or Mobile Number</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input required type="text" placeholder="name@example.com or 9876543210" className="pl-10 h-11"
                    value={formData.loginId} onChange={(e) => setFormData({...formData, loginId: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Account"}
              </Button>
            </form>
          )}

          {/* Render Step 2 Form */}
          {step === 2 && (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label>Account</Label>
                <Input disabled value={formData.loginId} className="bg-muted text-muted-foreground h-11" />
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input required type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 h-11"
                    value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input required type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 h-11"
                    value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button onClick={handleGoBack} type="button" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center justify-center gap-2 mx-auto transition-colors">
              <ArrowLeft size={16} /> Back to Sign In
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}