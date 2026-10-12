import {
  useState
} from "react";

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

import getApiError from "../utils/getApiError";

function LoginPage() {
  const {
    login
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    formData,
    setFormData
  ] = useState({
    email: "",
    password: ""
  });

  const [
    error,
    setError
  ] = useState("");

  const [
    submitting,
    setSubmitting
  ] = useState(false);

  const handleChange =
    (event) => {
      const {
        name,
        value
      } = event.target;

      setFormData(
        (current) => ({
          ...current,
          [name]: value
        })
      );
    };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setSubmitting(true);

      try {
        const response =
          await login({
            email:
              formData.email,

            password:
              formData.password
          });

        /*
         * If ProtectedRoute previously sent
         * the user here, return to that page.
         */
        const previousPath =
          location.state?.from;

        if (previousPath) {
          navigate(
            previousPath,
            {
              replace: true
            }
          );

          return;
        }

        if (
          response.user.role ===
          "FREELANCER"
        ) {
          navigate(
            "/freelancer/dashboard",
            {
              replace: true
            }
          );
        } else {
          navigate(
            "/client/dashboard",
            {
              replace: true
            }
          );
        }
      } catch (
        requestError
      ) {
        setError(
          getApiError(
            requestError,
            "Unable to sign in."
          )
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <section className="auth-page">

      <div className="auth-card">

        <span className="eyebrow">
          WELCOME BACK
        </span>

        <h1>
          Sign in to HustleHub+
        </h1>

        <p className="auth-intro">
          Access your secure
          HustleHub+ account.
        </p>

        {location.state
          ?.message && (
          <div
            className="alert alert-success"
          >
            {
              location.state
                .message
            }
          </div>
        )}

        {error && (
          <div
            className="alert alert-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={
            handleSubmit
          }
        >

          <div className="form-group">

            <label
              htmlFor="email"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              autoComplete="email"
              maxLength={254}
              required
              placeholder="you@example.com"
            />

          </div>

          <div className="form-group">

            <label
              htmlFor="password"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              autoComplete="current-password"
              maxLength={72}
              required
              placeholder="Enter your password"
            />

          </div>

          <button
            type="submit"
            className="button button-primary auth-submit"
            disabled={
              submitting
            }
          >
            {submitting
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account?
          {" "}

          <Link
            to="/register"
          >
            Create one
          </Link>
        </p>

      </div>

    </section>
  );
}

export default LoginPage;