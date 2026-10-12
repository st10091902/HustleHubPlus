import {
  Navigate,
  Outlet
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

import PageLoader from "./PageLoader";

function RoleRoute({
  allowedRoles
}) {
  const {
    user,
    loading
  } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (
    !user ||
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <Navigate
        to="/forbidden"
        replace
      />
    );
  }

  return <Outlet />;
}

export default RoleRoute;