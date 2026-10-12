import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "../context/useAuth";

function DashboardRedirect() {
  const {
    user
  } = useAuth();

  if (
    user?.role ===
    "FREELANCER"
  ) {
    return (
      <Navigate
        to="/freelancer/dashboard"
        replace
      />
    );
  }

  if (
    user?.role ===
    "CLIENT"
  ) {
    return (
      <Navigate
        to="/client/dashboard"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/"
      replace
    />
  );
}

export default DashboardRedirect;