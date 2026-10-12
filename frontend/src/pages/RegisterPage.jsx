import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

import getApiError from "../utils/getApiError";

function RegisterPage() {
  const {
    register
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    formData,
    setFormData
  ] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CLIENT"
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

      if (
        formData.password !==
        formData.confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }

      setSubmitting(true);

      try {
        await register({
          name:
            formData.name,

          email:
            formData.email,

          password:
            formData.password,

          role:
            formData.role
        });

        navigate(
          "/login",
          {
            replace: true,

            state: {
              message:
                "Registration successful. You can now sign in."
            }
          }
        );
      } catch (
        requestError
      ) {
        setError(
          getApiError(
            requestError,
            "Unable to create your account."
          )
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <section className="auth-page">

      <div className="auth-card auth-card-wide">

        <span className="eyebrow">
          CREATE ACCOUNT
        </span>

        <h1>
          Join HustleHub+
        </h1>

        <p className="auth-intro">
          Create a Client or
          Freelancer account.
        </p>

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
              htmlFor="name"
            >
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              autoComplete="name"
              minLength={2}
              maxLength={80}
              required
              placeholder="Your name"
            />

          </div>

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
              htmlFor="role"
            >
              Account type
            </label>

            <select
              id="role"
              name="role"
              value={
                formData.role
              }
              onChange={
                handleChange
              }
            >
              <option
                value="CLIENT"
              >
                Client
              </option>

              <option
                value="FREELANCER"
              >
                Freelancer
              </option>
            </select>

            <small>
              Administrator accounts
              cannot be created through
              public registration.
            </small>

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
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
              placeholder="Create a password"
            />

            <small>
              Minimum 8 characters with
              uppercase, lowercase,
              number and special
              character.
            </small>

          </div>

          <div className="form-group">

            <label
              htmlFor="confirmPassword"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={
                formData
                  .confirmPassword
              }
              onChange={
                handleChange
              }
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
              placeholder="Repeat your password"
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
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>

        <p className="auth-switch">
          Already registered?
          {" "}

          <Link
            to="/login"
          >
            Sign in
          </Link>
        </p>

      </div>

    </section>
  );
}

export default RegisterPage;