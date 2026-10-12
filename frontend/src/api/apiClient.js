import axios from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL,

  headers: {
    "Content-Type":
      "application/json"
  },

  timeout: 10000
});

/*
 * Attach the authenticated user's JWT
 * when one exists.
 *
 * Authentication will be implemented
 * properly in Step 10.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem(
        "hustlehub_token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

export default apiClient;