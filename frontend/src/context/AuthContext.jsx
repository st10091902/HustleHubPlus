import {
  useEffect,
  useMemo,
  useState
} from "react";

import AuthContext from "./authContextObject";

import {
  getCurrentUser,
  loginUser,
  registerUser
} from "../api/authService";

const TOKEN_KEY =
  "hustlehub_token";

export function AuthProvider({
  children
}) {
  const [
    user,
    setUser
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  /*
   * Restore an authenticated browser session.
   *
   * Only the JWT is kept in sessionStorage.
   * Current user details are retrieved from
   * the backend rather than trusted locally.
   */
  useEffect(() => {
    const restoreSession =
      async () => {
        const token =
          sessionStorage.getItem(
            TOKEN_KEY
          );

        if (!token) {
          setLoading(false);
          return;
        }

        try {
          const response =
            await getCurrentUser();

          setUser(
            response.user
          );
        } catch {
          sessionStorage.removeItem(
            TOKEN_KEY
          );

          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    restoreSession();
  }, []);

  const register =
    async (
      registrationData
    ) => {
      return registerUser(
        registrationData
      );
    };

  const login =
    async (
      credentials
    ) => {
      const response =
        await loginUser(
          credentials
        );

      sessionStorage.setItem(
        TOKEN_KEY,
        response.token
      );

      setUser(
        response.user
      );

      return response;
    };

  const logout = () => {
    sessionStorage.removeItem(
      TOKEN_KEY
    );

    setUser(null);
  };

  const refreshUser =
    async () => {
      const response =
        await getCurrentUser();

      setUser(
        response.user
      );

      return response.user;
    };

  const value =
    useMemo(
      () => ({
        user,

        loading,

        isAuthenticated:
          Boolean(user),

        register,
        login,
        logout,
        refreshUser
      }),
      [
        user,
        loading
      ]
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}
