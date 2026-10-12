import apiClient from "./apiClient";

/**
 * Retrieve all active marketplace Gigs.
 */
export const getAvailableGigs =
  async () => {
    const response =
      await apiClient.get(
        "/gigs"
      );

    return response.data;
  };

/**
 * Retrieve one active marketplace Gig.
 */
export const getGigById =
  async (gigId) => {
    const response =
      await apiClient.get(
        `/gigs/${gigId}`
      );

    return response.data;
  };