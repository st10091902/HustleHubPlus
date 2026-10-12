import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  render,
  screen,
  waitFor
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  MemoryRouter,
  Route,
  Routes
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";

import {
  AuthProvider
} from "../context/AuthContext.jsx";

import {
  loginUser
} from "../api/authService";

vi.mock(
  "../api/authService",
  () => ({
    getCurrentUser:
      vi.fn(),

    loginUser:
      vi.fn(),

    registerUser:
      vi.fn()
  })
);

const renderLoginPage =
  () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/login"
        ]}
      >
        <AuthProvider>

          <Routes>

            <Route
              path="/login"
              element={
                <LoginPage />
              }
            />

            <Route
              path="/client/dashboard"
              element={
                <div>
                  Client Dashboard Destination
                </div>
              }
            />

            <Route
              path="/freelancer/dashboard"
              element={
                <div>
                  Freelancer Dashboard Destination
                </div>
              }
            />

          </Routes>

        </AuthProvider>
      </MemoryRouter>
    );
  };

describe(
  "LoginPage",
  () => {
    beforeEach(
      () => {
        sessionStorage.clear();
      }
    );

    it(
      "logs in a valid Client and stores the JWT",
      async () => {
        const user =
          userEvent.setup();

        loginUser
          .mockResolvedValue({
            success: true,

            token:
              "test-client-jwt",

            user: {
              id:
                "507f1f77bcf86cd799439011",

              name:
                "Test Client",

              email:
                "client@example.com",

              role:
                "CLIENT"
            }
          });

        renderLoginPage();

        await user.type(
          screen.getByLabelText(
            "Email address"
          ),
          "client@example.com"
        );

        await user.type(
          screen.getByLabelText(
            "Password"
          ),
          "Client#2026"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Sign In"
            }
          )
        );

        await waitFor(
          () => {
            expect(
              loginUser
            ).toHaveBeenCalledWith(
              {
                email:
                  "client@example.com",

                password:
                  "Client#2026"
              }
            );
          }
        );

        expect(
          sessionStorage.getItem(
            "hustlehub_token"
          )
        ).toBe(
          "test-client-jwt"
        );

        expect(
          await screen.findByText(
            "Client Dashboard Destination"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "displays a controlled login error",
      async () => {
        const user =
          userEvent.setup();

        loginUser
          .mockRejectedValue({
            response: {
              data: {
                message:
                  "Invalid email or password."
              }
            }
          });

        renderLoginPage();

        await user.type(
          screen.getByLabelText(
            "Email address"
          ),
          "client@example.com"
        );

        await user.type(
          screen.getByLabelText(
            "Password"
          ),
          "WrongPassword#2026"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Sign In"
            }
          )
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "Invalid email or password."
        );

        expect(
          sessionStorage.getItem(
            "hustlehub_token"
          )
        ).toBeNull();
      }
    );
  }
);