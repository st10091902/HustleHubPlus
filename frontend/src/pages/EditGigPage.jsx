import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import GigForm from "../components/GigForm";

import {
  getMyGigs,
  updateGig
} from "../api/gigService";

import getApiError from "../utils/getApiError";

function EditGigPage() {
  const {
    id
  } = useParams();

  const navigate =
    useNavigate();

  const [
    gig,
    setGig
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    submitting,
    setSubmitting
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  useEffect(() => {
    let active = true;

    const loadGig =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getMyGigs();

          const matchingGig =
            response.gigs?.find(
              (item) =>
                item._id === id
            );

          if (!matchingGig) {
            if (active) {
              setError(
                "Gig not found or you do not own this Gig."
              );
            }

            return;
          }

          if (active) {
            setGig(
              matchingGig
            );
          }
        } catch (
          requestError
        ) {
          if (active) {
            setError(
              getApiError(
                requestError,
                "Unable to load this Gig."
              )
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    loadGig();

    return () => {
      active = false;
    };
  }, [id]);

  const handleUpdate =
    async (gigData) => {
      setSubmitting(true);
      setError("");

      try {
        await updateGig(
          id,
          gigData
        );

        navigate(
          "/freelancer/gigs",
          {
            replace: true,

            state: {
              message:
                "Gig updated successfully."
            }
          }
        );
      } catch (
        requestError
      ) {
        setError(
          getApiError(
            requestError,
            "Unable to update this Gig."
          )
        );
      } finally {
        setSubmitting(false);
      }
    };

  if (loading) {
    return (
      <section className="page-container">

        <div className="marketplace-state">

          <div className="loading-spinner" />

          <h2>
            Loading Gig
          </h2>

        </div>

      </section>
    );
  }

  if (!gig) {
    return (
      <section className="page-container">

        <div className="marketplace-state marketplace-error">

          <span className="state-icon">
            !
          </span>

          <h1>
            Gig unavailable
          </h1>

          <p>
            {error}
          </p>

          <Link
            to="/freelancer/gigs"
            className="button button-primary"
          >
            Back to My Gigs
          </Link>

        </div>

      </section>
    );
  }

  return (
    <section className="page-container">

      <div className="form-page-header">

        <div>

          <span className="eyebrow">
            FREELANCER
          </span>

          <h1>
            Edit Gig
          </h1>

          <p>
            Update your service,
            pricing or marketplace
            availability.
          </p>

        </div>

        <Link
          to="/freelancer/gigs"
          className="button button-secondary"
        >
          Cancel
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
          initialValues={
            gig
          }
          onSubmit={
            handleUpdate
          }
          submitting={
            submitting
          }
          submitLabel="Save Changes"
        />

      </div>

    </section>
  );
}

export default EditGigPage;