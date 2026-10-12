import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  render,
  screen
} from "@testing-library/react";

import {
  MemoryRouter,
  Route,
  Routes
} from "react-router-dom";

import RoleRoute from "../components/RoleRoute";

import {
  useAuth
} from "../context/useAuth";

vi.mock(
  "../context/useAuth",
  () => ({
    useAuth:
      vi.fn()
  })
);

describe(
  "RoleRoute",
  () => {
    beforeEach(
      () => {
        vi.clearAllMocks();
      }
    );

    it(
      "redirects a Client away from a Freelancer-only route",
      () => {
        useAuth
          .mockReturnValue({
            user: {
              role:
                "CLIENT"
            },

            loading:
              false
          });

        render(
          <MemoryRouter
            initialEntries={[
              "/freelancer/dashboard"
            ]}
          >

            <Routes>

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
                    <div>
                      Freelancer Private Area
                    </div>
                  }
                />

              </Route>

              <Route
                path="/forbidden"
                element={
                  <div>
                    Forbidden Page
                  </div>
                }
              />

            </Routes>

          </MemoryRouter>
        );

        expect(
          screen.getByText(
            "Forbidden Page"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Freelancer Private Area"
          )
        ).not
          .toBeInTheDocument();
      }
    );
  }
);