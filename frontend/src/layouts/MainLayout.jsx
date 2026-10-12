import {
  NavLink,
  Outlet,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

function MainLayout() {
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();

  const navigate =
    useNavigate();

  const handleLogout = () => {
    logout();

    navigate(
      "/",
      {
        replace: true
      }
    );
  };

  const dashboardPath =
    user?.role ===
    "FREELANCER"
      ? "/freelancer/dashboard"
      : "/client/dashboard";

  return (
    <div className="app-shell">

      <header className="navbar">

        <div className="navbar-inner">

          <NavLink
            to="/"
            className="brand"
          >
            <span className="brand-mark">
              H+
            </span>

            <span>
              HustleHub+
            </span>
          </NavLink>

          <nav className="nav-links">

            <NavLink
              to="/marketplace"
            >
              Marketplace
            </NavLink>

            {isAuthenticated ? (
              <>
                {user.role ===
                  "FREELANCER" && (
                  <NavLink
                    to="/freelancer/gigs"
                  >
                    My Gigs
                  </NavLink>
                )}

                {user.role ===
                  "FREELANCER" && (
                  <NavLink
                    to="/freelancer/bookings"
                  >
                    Bookings
                  </NavLink>
                )}

                {user.role ===
                  "FREELANCER" && (
                  <NavLink
                    to="/freelancer/finance"
                  >
                    Finance
                  </NavLink>
                )}

                {user.role ===
                  "CLIENT" && (
                  <NavLink
                    to="/client/bookings"
                  >
                    My Bookings
                  </NavLink>
                )}

                <NavLink
                  to={
                    dashboardPath
                  }
                >
                  Dashboard
                </NavLink>

                <span
                  className="nav-user"
                >
                  {user.name}
                </span>

                <button
                  type="button"
                  className="nav-logout"
                  onClick={
                    handleLogout
                  }
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="nav-button"
                >
                  Get Started
                </NavLink>
              </>
            )}

          </nav>

        </div>

      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          HustleHub+ © 2026
          {" · "}
          Secure Freelance Marketplace
        </p>
      </footer>

    </div>
  );
}

export default MainLayout;