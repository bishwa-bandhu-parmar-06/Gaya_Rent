"use client";
import { useState } from "react";
import { authApi } from "@/lib/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";

export function AdminRegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    adminSecret: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showAdminSecret, setShowAdminSecret] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await authApi.registerAdmin(formData);

      setSuccess(
        "System Admin initialized successfully! You can now log in."
      );

      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        adminSecret: "",
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Invalid Secret Key?"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 pt-4">
      {error && (
        <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md">
          {success}
        </div>
      )}

      {/* Admin Secret */}
      <div className="space-y-2">
        <Label>System Master Key</Label>

        <div className="relative">
          <ShieldAlert
            className="absolute left-3 top-1/2 -translate-y-1/2 text-destructive"
            size={16}
          />

          <Input
            type={showAdminSecret ? "text" : "password"}
            placeholder="Admin Secret Key"
            value={formData.adminSecret}
            onChange={(e) =>
              setFormData({
                ...formData,
                adminSecret: e.target.value,
              })
            }
            required
            className="pl-10 pr-10 border-red-200 focus-visible:ring-red-500"
          />

          <button
            type="button"
            onClick={() => setShowAdminSecret(!showAdminSecret)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showAdminSecret ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Name + Mobile */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Full Name</Label>

          <Input
            required
            placeholder="Admin Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Mobile Number</Label>

          <Input
            required
            type="tel"
            placeholder="9876543210"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({
                ...formData,
                mobile: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label>Admin Email</Label>

        <Input
          type="email"
          required
          placeholder="admin@gayarent.com"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label>Password</Label>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
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

      <Button
        type="submit"
        variant="destructive"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Initialize Admin"
        )}
      </Button>
    </form>
  );
}