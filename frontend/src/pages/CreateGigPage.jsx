import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import GigForm from "../components/GigForm";

import {
  createGig
} from "../api/gigService";

import getApiError from "../utils/getApiError";

function CreateGigPage() {
  const navigate =
    useNavigate();

  const [
    submitting,
    setSubmitting
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  const handleCreate =
    async (gigData) => {
      setError("");
      setSubmitting(true);

      try {
        await createGig(
          gigData
        );

        navigate(
          "/freelancer/gigs",
          {
            replace: true,

            state: {
              message:
                "Gig created successfully."
            }
          }
        );
      } catch (
        requestError
      ) {
        setError(
          getApiError(
            requestError,
            "Unable to create this Gig."
          )
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <section className="page-container">

      <div className="form-page-header">

        <div>

          <span className="eyebrow">
            FREELANCER
          </span>

          <h1>
            Create a new Gig
          </h1>

          <p>
            Publish a professional
            service to the HustleHub+
            Marketplace.
          </p>

        </div>

        <Link
          to="/freelancer/gigs"
          className="button button-secondary"
        >
          Back to My Gigs
        </Link>

      </div>

      <div className="gig-form-card">

        {error && (
          <div
            className="alert alert-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <GigForm
          onSubmit={
            handleCreate
          }
          submitting={
            submitting
          }
          submitLabel="Create Gig"
        />

      </div>

    </section>
  );
}

export default CreateGigPage;