import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useParams
} from "react-router-dom";

import {
  getGigById
} from "../api/gigService";

import {
  useAuth
} from "../context/AuthContext";

import getApiError from "../utils/getApiError";
import formatCurrency from "../utils/formatCurrency";

function GigDetailsPage() {
  const {
    id
  } = useParams();

  const {
    user,
    isAuthenticated
  } = useAuth();

  const [
    gig,
    setGig
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

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
            await getGigById(
              id
            );

          if (active) {
            setGig(
              response.gig
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

  if (loading) {
    return (
      <section className="page-container">

        <div className="marketplace-state">

          <div
            className="loading-spinner"
          />

          <h2>
            Loading Gig
          </h2>

          <p>
            Retrieving service
            information.
          </p>

        </div>

      </section>
    );
  }

  if (
    error ||
    !gig
  ) {
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
            {error ||
              "This Gig could not be found."}
          </p>

          <Link
            to="/marketplace"
            className="button button-primary"
          >
            Back to Marketplace
          </Link>

        </div>

      </section>
    );
  }

  const freelancerName =
    gig.freelancer?.name ||
    "HustleHub+ Freelancer";

  return (
    <section className="page-container">

      <div className="gig-details-breadcrumb">

        <Link
          to="/marketplace"
        >
          Marketplace
        </Link>

        <span>
          /
        </span>

        <span>
          Gig Details
        </span>

      </div>

      <div className="gig-details-layout">

        <article className="gig-details-main">

          <span className="gig-category">
            {gig.category}
          </span>

          <h1>
            {gig.title}
          </h1>

          <div className="gig-details-freelancer">

            <div className="avatar-circle avatar-large">
              {freelancerName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <span>
                Service offered by
              </span>

              <strong>
                {freelancerName}
              </strong>
            </div>

          </div>

          <div className="gig-details-section">

            <h2>
              About this Gig
            </h2>

            <p>
              {gig.description}
            </p>

          </div>

          <div className="gig-details-section">

            <h2>
              Service details
            </h2>

            <div className="detail-list">

              <div>
                <span>
                  Category
                </span>

                <strong>
                  {gig.category}
                </strong>
              </div>

              <div>
                <span>
                  Delivery time
                </span>

                <strong>
                  {
                    gig.deliveryDays
                  }
                  {" "}
                  {gig.deliveryDays ===
                  1
                    ? "day"
                    : "days"}
                </strong>
              </div>

              <div>
                <span>
                  Listing status
                </span>

                <strong>
                  Active
                </strong>
              </div>

            </div>

          </div>

        </article>

        <aside className="gig-purchase-card">

          <span className="gig-purchase-label">
            Service price
          </span>

          <div className="gig-purchase-price">
            {formatCurrency(
              gig.price
            )}
          </div>

          <p>
            Simulated payment will
            only be confirmed after
            a Client creates a
            booking.
          </p>

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                state={{
                  from:
                    `/marketplace/${gig._id}`
                }}
                className="button button-primary gig-purchase-button"
              >
                Sign In to Continue
              </Link>

              <span className="purchase-help">
                A Client account is
                required to create a
                booking.
              </span>
            </>
          )}

          {isAuthenticated &&
            user.role ===
              "CLIENT" && (
            <>
              <div className="booking-coming-soon">
                Client booking is
                available in the
                next frontend step.
              </div>

              <button
                type="button"
                className="button button-primary gig-purchase-button"
                disabled
              >
                Book this Gig
              </button>
            </>
          )}

          {isAuthenticated &&
            user.role ===
              "FREELANCER" && (
            <div className="role-notice">
              Freelancer accounts can
              browse the marketplace,
              but only Clients may book
              services.
            </div>
          )}

        </aside>

      </div>

    </section>
  );
}

export default GigDetailsPage;