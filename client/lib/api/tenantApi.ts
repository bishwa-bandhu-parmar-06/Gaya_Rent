import apiClient from "./client";

export const tenantApi = {
  getProfile: async () => {
    const response = await apiClient.get("/tenant/profile");
    return response.data;
  },

  updateProfile: async (data: {
    name: string;
    mobile: string;
    address?: string;
    occupation?: string;
  }) => {
    const response = await apiClient.put("/tenant/profile", data);
    return response.data;
  },

  rateProperty: async (propertyId: string | number, formData: FormData) => {
    const response = await apiClient.post(
      `/tenant/properties/${propertyId}/rate`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  toggleSaveProperty: async (propertyId: number | string) => {
    const response = await apiClient.post("/tenant/saved", { propertyId });
    return response.data;
  },
  getSavedProperties: async () => {
    const response = await apiClient.get("/tenant/saved");
    return response.data;
  },

  getRatedProperties: async () => {
    const response = await apiClient.get("/tenant/rated");
    return response.data;
  },

  checkSavedStatus: async (propertyId: string | number) => {
    const response = await apiClient.get(`/tenant/saved/${propertyId}/check`);
    return response.data;
  },
};
