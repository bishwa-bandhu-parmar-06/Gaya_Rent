"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authApi } from "@/lib/api/authApi"; // Using your clean API wrapper
import { setCredentials } from "@/lib/store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Make sure to import Checkbox
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function AdminLoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Load remembered credentials on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const remembered = localStorage.getItem('rememberedAdminId');
      if (remembered) {
        setLoginId(remembered);
        setRememberMe(true);
      }
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.loginAdmin({ loginId, password });
      
      if (response.role !== "admin") {
        setError("Access Denied: You do not have administrator privileges.");
        setIsLoading(false);
        return;
      }

      // Handle Remember Me storage
      if (rememberMe && typeof window !== 'undefined') {
        localStorage.setItem('rememberedAdminId', loginId);
      } else if (typeof window !== 'undefined') {
        localStorage.removeItem('rememberedAdminId');
      }

      dispatch(setCredentials({
        user: { name: response.name, email: response.email, role: "admin" },
        token: response.token
      }));

      router.push("/admin/dashboard");
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdminLogin} className="space-y-4 pt-4">
      {error && (
        <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {error}
        </div>
      )}
      
      {/* Login ID Input */}
      <div className="space-y-2">
        <Label>Email or Mobile</Label>
        <Input 
          type="text" 
          placeholder="admin@gayarent.com or Phone" 
          value={loginId} 
          onChange={(e) => setLoginId(e.target.value)} 
          required 
        />
      </div>
      
      {/* Password Input with Forgot Password Link */}
<div className="space-y-2">
  <div className="flex justify-between items-center">
    <Label>Secure Password</Label>

    <Link
      href="/forgot-password"
      className="text-xs text-primary hover:underline font-medium transition-colors"
    >
      Forgot password?
    </Link>
  </div>

  <div className="relative">
    <Input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      placeholder="••••••••"
      className="pr-10"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  </div>
</div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center space-x-2 pt-1 pb-2">
        <Checkbox 
          id="admin-remember" 
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <label
          htmlFor="admin-remember"
          className="text-sm font-medium leading-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        >
          Remember my credentials
        </label>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90" 
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Access Dashboard"}
      </Button>
    </form>
  );
}