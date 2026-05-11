import apiClient from "./client";

export const adminApi = {
  // --- STATS ---
  getDashboardStats: async () => {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  },

  // --- PROFILE ---
  getProfile: async () => {
    const response = await apiClient.get("/admin/profile");
    return response.data;
  },

  updateProfile: async (data: { name: string; mobile: string }) => {
    const response = await apiClient.put("/admin/profile", data);
    return response.data;
  },

  // --- PARTNERS (OWNERS) ---
  // status can be 'pending', 'approved', or 'rejected'
  getPartners: async (status: "pending" | "approved" | "rejected") => {
    const response = await apiClient.get(`/admin/partners?status=${status}`);
    return response.data;
  },

  // action must be 'approve' or 'reject'
  updatePartnerStatus: async (
    partnerId: string | number,
    action: "approve" | "reject",
  ) => {
    const response = await apiClient.put(
      `/admin/partners/${partnerId}/status`,
      { action },
    );
    return response.data;
  },

  getProperties: async (
    status: string,
    page: number = 1,
    limit: number = 10,
  ) => {
    // Pass status, page, and limit as query parameters
    const response = await apiClient.get(
      `/admin/properties?status=${status}&page=${page}&limit=${limit}`,
    );
    return response.data; // Now returns { properties: [], pagination: {} }
  },

  updatePropertyStatus: async (
    propertyId: string | number,
    status: "approved" | "rejected",
  ) => {
    const response = await apiClient.put(
      `/admin/properties/${propertyId}/status`,
      { status },
    );
    return response.data;
  },

  bulkUpdatePropertyStatus: async (
    ids: number[],
    status: "approved" | "rejected",
  ) => {
    const response = await apiClient.put(`/admin/properties/bulk-status`, {
      ids,
      status,
    });
    return response.data;
  },
};
