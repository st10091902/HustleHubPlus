import apiClient from "./apiClient";

/**
 * Create a new Client booking.
 *
 * Only the Gig ID and optional requirements
 * are supplied by the frontend.
 */
export const createBooking =
  async (bookingData) => {
    const response =
      await apiClient.post(
        "/bookings",
        bookingData
      );

    return response.data;
  };

/**
 * Return bookings belonging to the
 * authenticated Client.
 */
export const getClientBookings =
  async () => {
    const response =
      await apiClient.get(
        "/bookings/client"
      );

    return response.data;
  };

/**
 * Return one Booking when the authenticated
 * user participates in it.
 */
export const getBookingById =
  async (bookingId) => {
    const response =
      await apiClient.get(
        `/bookings/${bookingId}`
      );

    return response.data;
  };