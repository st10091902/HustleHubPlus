import apiClient from "./apiClient";

export const checkApiHealth =
  async () => {
    const response =
      await apiClient.get(
        "/health"
      );

    return response.data;
  };