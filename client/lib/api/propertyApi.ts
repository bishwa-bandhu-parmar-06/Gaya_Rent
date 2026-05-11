import apiClient from "./client";

export const propertyApi = {
  getAllProperties: async (
    filters: Record<string, string | number | undefined | null> = {},
  ) => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );

    const queryString = new URLSearchParams(
      cleanFilters as Record<string, string>,
    ).toString();
    const url = queryString ? `/properties?${queryString}` : "/properties";

    const response = await apiClient.get(url);
    return response.data;
  },

  getPropertyById: async (id: string | number) => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },

  getPropertyReviews: async (propertyId: string | number) => {
    const response = await apiClient.get(`/properties/${propertyId}/reviews`); // Adjust route based on your setup
    return response.data;
  },
};
