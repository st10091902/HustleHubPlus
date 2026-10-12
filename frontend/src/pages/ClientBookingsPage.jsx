import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  getClientBookings
} from "../api/bookingService";

import getApiError from "../utils/getApiError";
import formatCurrency from "../utils/formatCurrency";

function ClientBookingsPage() {
  const [
    bookings,
    setBookings
  ] = useState([]);

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

    const loadBookings =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getClientBookings();

          if (active) {
            setBookings(
              response.bookings ||
              []
            );
          }
        } catch (
          requestError
        ) {
          if (active) {
            setError(
              getApiError(
                requestError,
                "Unable to load your bookings."
              )
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    loadBookings();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="page-container">

      <div className="form-page-header">

        <div>

          <span className="eyebrow">
            CLIENT
          </span>

          <h1>
            My Bookings
          </h1>

          <p>
            Review services you have
            booked through HustleHub+.
          </p>

        </div>

        <Link
          to="/marketplace"
          className="button button-primary"
        >
          Browse Marketplace
        </Link>

      </div>

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
            Loading your bookings
          </h2>

        </div>
      )}

      {!loading &&
        !error &&
        bookings.length ===
          0 && (
        <div className="marketplace-state">

          <span className="state-icon">
            📦
          </span>

          <h2>
            No bookings yet
          </h2>

          <p>
            Browse the Marketplace
            and book a service to
            get started.
          </p>

          <Link
            to="/marketplace"
            className="button button-primary"
          >
            Find a Service
          </Link>

        </div>
      )}

      {!loading &&
        bookings.length >
          0 && (
        <div className="booking-list">

          {bookings.map(
            (booking) => (
              <article
                key={
                  booking._id
                }
                className="booking-card"
              >

                <div className="booking-card-main">

                  <div className="booking-card-header">

                    <span className="gig-category">
                      {booking.gig
                        ?.category ||
                        "Service"}
                    </span>

                    <span className="booking-status">
                      {
                        booking.status
                      }
                    </span>

                  </div>

                  <h2>
                    {
                      booking.gigTitle
                    }
                  </h2>

                  <p className="booking-freelancer-name">
                    Freelancer:
                    {" "}
                    <strong>
                      {booking
                        .freelancer
                        ?.name ||
                        "HustleHub+ Freelancer"}
                    </strong>
                  </p>

                  {booking.requirements && (
                    <div className="booking-requirements">

                      <span>
                        Requirements
                      </span>

                      <p>
                        {
                          booking.requirements
                        }
                      </p>

                    </div>
                  )}

                </div>

                <div className="booking-card-side">

                  <div>
                    <span>
                      Amount
                    </span>

                    <strong className="booking-card-price">
                      {formatCurrency(
                        booking.amount
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Payment
                    </span>

                    <strong>
                      {
                        booking
                          .paymentStatus
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Booked
                    </span>

                    <strong>
                      {new Date(
                        booking.createdAt
                      ).toLocaleDateString(
                        "en-ZA"
                      )}
                    </strong>
                  </div>

                  <Link
                    to={`/client/bookings/${booking._id}`}
                    className="button button-secondary booking-view-button"
                  >
                    View Details
                  </Link>

                </div>

              </article>
            )
          )}

        </div>
      )}

    </section>
  );
}

export default ClientBookingsPage;