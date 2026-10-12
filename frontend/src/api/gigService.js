import apiClient from "./apiClient";

/**
 * Public marketplace Gigs.
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
 * Public active Gig.
 */
export const getGigById =
  async (gigId) => {
    const response =
      await apiClient.get(
        `/gigs/${gigId}`
      );

    return response.data;
  };

/**
 * Authenticated Freelancer's Gigs.
 */
export const getMyGigs =
  async () => {
    const response =
      await apiClient.get(
        "/gigs/mine"
      );

    return response.data;
  };

/**
 * Create a Freelancer Gig.
 */
export const createGig =
  async (gigData) => {
    const response =
      await apiClient.post(
        "/gigs",
        gigData
      );

    return response.data;
  };

/**
 * Update a Gig owned by the
 * authenticated Freelancer.
 */
export const updateGig =
  async (
    gigId,
    gigData
  ) => {
    const response =
      await apiClient.put(
        `/gigs/${gigId}`,
        gigData
      );

    return response.data;
  };

/**
 * Delete a Gig owned by the
 * authenticated Freelancer.
 */
export const deleteGig =
  async (gigId) => {
    const response =
      await apiClient.delete(
        `/gigs/${gigId}`
      );

    return response.data;
  };