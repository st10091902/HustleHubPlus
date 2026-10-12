import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useLocation
} from "react-router-dom";

import {
  deleteGig,
  getMyGigs,
  updateGig
} from "../api/gigService";

import getApiError from "../utils/getApiError";
import formatCurrency from "../utils/formatCurrency";

function FreelancerGigsPage() {
  const location =
    useLocation();

  const [
    gigs,
    setGigs
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  const [
    actionId,
    setActionId
  ] = useState(null);

  const loadGigs =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getMyGigs();

        setGigs(
          response.gigs || []
        );
      } catch (
        requestError
      ) {
        setError(
          getApiError(
            requestError,
            "Unable to load your Gigs."
          )
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadGigs();
  }, []);

  const handleToggleActive =
    async (gig) => {
      setActionId(
        gig._id
      );

      setError("");

      try {
        const response =
          await updateGig(
            gig._id,
            {
              isActive:
                !gig.isActive
            }
          );

        setGigs(
          (current) =>
            current.map(
              (item) =>
                item._id ===
                gig._id
                  ? response.gig
                  : item
            )
        );
      } catch (
        requestError
      ) {
        setError(
          getApiError(
            requestError,
            "Unable to update the Gig."
          )
        );
      } finally {
        setActionId(null);
      }
    };

  const handleDelete =
    async (gig) => {
      const confirmed =
        window.confirm(
          `Delete "${gig.title}"? This action cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      setActionId(
        gig._id
      );

      setError("");

      try {
        await deleteGig(
          gig._id
        );

        setGigs(
          (current) =>
            current.filter(
              (item) =>
                item._id !==
                gig._id
            )
        );
      } catch (
        requestError
      ) {
        setError(
          getApiError(
            requestError,
            "Unable to delete the Gig."
          )
        );
      } finally {
        setActionId(null);
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
            My Gigs
          </h1>

          <p>
            Manage the services you
            offer through HustleHub+.
          </p>

        </div>

        <Link
          to="/freelancer/gigs/create"
          className="button button-primary"
        >
          + Create Gig
        </Link>

      </div>

      {location.state
        ?.message && (
        <div className="alert alert-success management-alert">
          {
            location.state
              .message
          }
        </div>
      )}

      {error && (
        <div
          className="alert alert-error management-alert"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading && (
        <div className="marketplace-state">

          <div className="loading-spinner" />

          <h2>
            Loading your Gigs
          </h2>

        </div>
      )}

      {!loading &&
        gigs.length === 0 && (
        <div className="marketplace-state">

          <span className="state-icon">
            💼
          </span>

          <h2>
            You haven't created
            any Gigs yet
          </h2>

          <p>
            Create your first service
            and publish it to the
            HustleHub+ Marketplace.
          </p>

          <Link
            to="/freelancer/gigs/create"
            className="button button-primary"
          >
            Create Your First Gig
          </Link>

        </div>
      )}

      {!loading &&
        gigs.length > 0 && (
        <div className="management-grid">

          {gigs.map(
            (gig) => {
              const busy =
                actionId ===
                gig._id;

              return (
                <article
                  key={gig._id}
                  className="management-card"
                >

                  <div className="management-card-header">

                    <span className="gig-category">
                      {
                        gig.category
                      }
                    </span>

                    <span
                      className={
                        gig.isActive
                          ? "management-status status-active"
                          : "management-status status-inactive"
                      }
                    >
                      {gig.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  <h2>
                    {gig.title}
                  </h2>

                  <p className="management-description">
                    {
                      gig.description
                    }
                  </p>

                  <div className="management-meta">

                    <div>
                      <span>
                        Price
                      </span>

                      <strong>
                        {formatCurrency(
                          gig.price
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Delivery
                      </span>

                      <strong>
                        {
                          gig.deliveryDays
                        }
                        {" "}
                        days
                      </strong>
                    </div>

                  </div>

                  <div className="management-actions">

                    <Link
                      to={`/freelancer/gigs/${gig._id}/edit`}
                      className="button button-secondary management-button"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="button button-secondary management-button"
                      disabled={
                        busy
                      }
                      onClick={
                        () =>
                          handleToggleActive(
                            gig
                          )
                      }
                    >
                      {busy
                        ? "Working..."
                        : gig.isActive
                          ? "Deactivate"
                          : "Activate"}
                    </button>

                    <button
                      type="button"
                      className="button management-button button-danger"
                      disabled={
                        busy
                      }
                      onClick={
                        () =>
                          handleDelete(
                            gig
                          )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>
              );
            }
          )}

        </div>
      )}

    </section>
  );
}

export default FreelancerGigsPage;