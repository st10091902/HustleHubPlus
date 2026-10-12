import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  getFreelancerBookings
} from "../api/bookingService";

import getApiError from "../utils/getApiError";
import formatCurrency from "../utils/formatCurrency";

function FreelancerBookingsPage() {
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
            await getFreelancerBookings();

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
                "Unable to load your received bookings."
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
            FREELANCER
          </span>

          <h1>
            Received Bookings
          </h1>

          <p>
            Review Clients who have
            booked your HustleHub+
            services.
          </p>

        </div>

        <Link
          to="/freelancer/gigs"
          className="button button-secondary"
        >
          My Gigs
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
            Loading received bookings
          </h2>

        </div>
      )}

      {!loading &&
        !error &&
        bookings.length === 0 && (
        <div className="marketplace-state">

          <span className="state-icon">
            📦
          </span>

          <h2>
            No bookings yet
          </h2>

          <p>
            Client bookings for your
            active Gigs will appear here.
          </p>

        </div>
      )}

      {!loading &&
        bookings.length > 0 && (
        <div className="booking-list">

          {bookings.map(
            (booking) => (
              <article
                key={booking._id}
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
                      {booking.status}
                    </span>

                  </div>

                  <h2>
                    {booking.gigTitle}
                  </h2>

                  <p className="booking-freelancer-name">
                    Client:
                    {" "}
                    <strong>
                      {booking.client
                        ?.name ||
                        "HustleHub+ Client"}
                    </strong>
                  </p>

                  {booking.client?.email && (
                    <p className="booking-client-email">
                      {
                        booking.client
                          .email
                      }
                    </p>
                  )}

                  {booking.requirements && (
                    <div className="booking-requirements">

                      <span>
                        Client requirements
                      </span>

                      <p>
                        {booking.requirements}
                      </p>

                    </div>
                  )}

                </div>

                <div className="booking-card-side">

                  <div>
                    <span>
                      Earnings
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
                      Received
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
                    to={`/freelancer/bookings/${booking._id}`}
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

export default FreelancerBookingsPage;