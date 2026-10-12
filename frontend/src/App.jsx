import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import DashboardRedirect from "./components/DashboardRedirect";

import HomePage from "./pages/HomePage";
import MarketplacePage from "./pages/MarketplacePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ClientDashboardPage from "./pages/ClientDashboardPage";
import FreelancerDashboardPage from "./pages/FreelancerDashboardPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          element={<MainLayout />}
        >

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/marketplace"
            element={
              <MarketplacePage />
            }
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={
              <RegisterPage />
            }
          />

          <Route
            path="/forbidden"
            element={
              <ForbiddenPage />
            }
          />

          <Route
            element={
              <ProtectedRoute />
            }
          >

            <Route
              path="/dashboard"
              element={
                <DashboardRedirect />
              }
            />

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    "CLIENT"
                  ]}
                />
              }
            >

              <Route
                path="/client/dashboard"
                element={
                  <ClientDashboardPage />
                }
              />

            </Route>

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    "FREELANCER"
                  ]}
                />
              }
            >

              <Route
                path="/freelancer/dashboard"
                element={
                  <FreelancerDashboardPage />
                }
              />

            </Route>

          </Route>

          <Route
            path="*"
            element={
              <NotFoundPage />
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;