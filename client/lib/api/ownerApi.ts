// lib/api/ownerApi.ts
import apiClient from "./client";

export const ownerApi = {
  // --- DASHBOARD & PROFILE ---
  getDashboardStats: async () => {
    const response = await apiClient.get("/owner/stats");
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/owner/profile");
    return response.data;
  },

  updateProfile: async (data: {
    name: string;
    mobile: string;
    address?: string;
    occupation?: string;
  }) => {
    const response = await apiClient.put("/owner/profile", data);
    return response.data;
  },

  // --- PROPERTY MANAGEMENT ---
  getMyProperties: async () => {
    const response = await apiClient.get("/owner/properties");
    return response.data;
  },

  
  addProperty: async (formData: FormData) => {
    const response = await apiClient.post("/owner/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  editProperty: async (propertyId: string | number, formData: FormData) => {
    const response = await apiClient.put(
      `/owner/properties/${propertyId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  deleteProperty: async (propertyId: string | number) => {
    const response = await apiClient.delete(`/owner/properties/${propertyId}`);
    return response.data;
  },

  toggleAvailability: async (
    propertyId: string | number,
    availability: "available" | "rented",
  ) => {
    const response = await apiClient.patch(
      `/owner/properties/${propertyId}/availability`,
      { availability },
    );
    return response.data;
  },

  // Add this inside the ownerApi object
  bulkUploadProperties: async (properties: any[]) => {
    const response = await apiClient.post("/owner/properties/bulk", { properties });
    return response.data;
  },
  
};


