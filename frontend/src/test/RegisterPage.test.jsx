import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  render,
  screen
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  MemoryRouter
} from "react-router-dom";

import RegisterPage from "../pages/RegisterPage";

import {
  AuthProvider
} from "../context/AuthContext.jsx";

import {
  registerUser
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

describe(
  "RegisterPage",
  () => {
    it(
      "rejects mismatching passwords before API submission",
      async () => {
        const user =
          userEvent.setup();

        render(
          <MemoryRouter>
            <AuthProvider>
              <RegisterPage />
            </AuthProvider>
          </MemoryRouter>
        );

        await user.type(
          screen.getByLabelText(
            "Full name"
          ),
          "Test User"
        );

        await user.type(
          screen.getByLabelText(
            "Email address"
          ),
          "test@example.com"
        );

        await user.type(
          screen.getByLabelText(
            "Password"
          ),
          "Secure#2026"
        );

        await user.type(
          screen.getByLabelText(
            "Confirm password"
          ),
          "Different#2026"
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Create Account"
            }
          )
        );

        expect(
          await screen.findByRole(
            "alert"
          )
        ).toHaveTextContent(
          "Passwords do not match."
        );

        expect(
          registerUser
        ).not
          .toHaveBeenCalled();
      }
    );
  }
);