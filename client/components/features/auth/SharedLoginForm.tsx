"use client";
import { useState, useEffect } from "react"; // ADDED useEffect
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authApi } from "@/lib/api/authApi";
import { setCredentials } from "@/lib/store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Mail, Phone, Lock } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";

export function SharedLoginForm({ role }: { role: "tenant" | "owner" }) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [loginId, setLoginId] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.login({ loginId, password });
      
      if (response.role !== role) {
        setError(`This portal is for ${role}s only.`);
        setIsLoading(false);
        return;
      }

      if (rememberMe && typeof window !== 'undefined') {
        localStorage.setItem('rememberedEmail', loginId);
      } else if (typeof window !== 'undefined') {
        localStorage.removeItem('rememberedEmail');
      }

      dispatch(setCredentials({
        user: { name: response.name, email: response.email, role: response.role },
        token: response.token
      }));

      router.push(response.role === "owner" ? "/owner/dashboard" : "/tenant/dashboard");
    } catch (err: any) {
      if (err.response?.status === 403 && role === "owner") {
        dispatch(setCredentials({
          user: { name: loginId, email: "", role: "owner" },
          token: "" 
        }));
        router.push("/pending");
      } else {
        setError(err.response?.data?.message || "Invalid credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await authApi.googleAuth(credentialResponse.credential);
      dispatch(setCredentials({
        user: { name: response.name, email: "", role: response.role },
        token: response.token
      }));
      router.push("/tenant/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Google Login failed");
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const remembered = localStorage.getItem('rememberedEmail');
      if (remembered) {
        setLoginId(remembered);
        setRememberMe(true);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <CardHeader className="px-0 text-center pt-0">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your {role} account</CardDescription>
      </CardHeader>
      
      <CardContent className="px-0 space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="loginId" className="text-sm font-medium">Email or Mobile Number</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {loginId.includes('@') ? <Mail size={18} /> : <Phone size={18} />}
              </div>
              <Input 
                id="loginId" type="text" placeholder="name@example.com or 9876543210" 
                value={loginId} onChange={(e) => setLoginId(e.target.value)} 
                className="pl-10 h-11" required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock size={18} />
              </div>
              <Input 
                id="password" type={showPassword ? "text" : "password"} 
                value={password} onChange={(e) => setPassword(e.target.value)} 
                placeholder="enter your password"
                className="pl-10 pr-10 h-11" required 
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
              <label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer">
                Remember me
              </label>
            </div>
          </div>
          
          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        {role === "tenant" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess} 
                  onError={() => setError("Google Login was unsuccessful")} 
                  logo_alignment="center"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </div>
  );
}