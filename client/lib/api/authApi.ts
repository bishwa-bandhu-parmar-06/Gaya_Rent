import apiClient from "./client";

export const authApi = {
  login: async (credentials: { loginId: string; password: string }) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  registerTenant: async (formData: FormData) => {
    const response = await apiClient.post("/auth/register/tenant", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  registerOwner: async (formData: FormData) => {
    const response = await apiClient.post("/auth/register/owner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  
  registerAdmin: async (data: any) => {
    const response = await apiClient.post("/auth/register/admin", data);
    return response.data;
  },
  // Update your admin login function to hit the specific admin login endpoint
  loginAdmin: async (credentials: { loginId: string; password: string }) => {
    const response = await apiClient.post("/auth/login/admin", credentials);
    return response.data;
  },


  googleAuth: async (token: string) => {
    const response = await apiClient.post("/auth/google", { token });
    return response.data;
  },

  // Public Forgot Password
  forgotPassword: async (data: { loginId: string; newPassword: string }) => {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data;
  },

  // New endpoint to check if an account exists
  verifyUser: async (data: { loginId: string }) => {
    const response = await apiClient.post("/auth/verify-user", data);
    return response.data;
  },

  // Secure Reset Password (Requires the JWT token)
  resetPassword: async (newPassword: string, token: string) => {
    const response = await apiClient.post(
      "/auth/reset-password", 
      { newPassword },
      { headers: { Authorization: `Bearer ${token}` } } // Pass the token in the headers
    );
    return response.data;
  },
};
