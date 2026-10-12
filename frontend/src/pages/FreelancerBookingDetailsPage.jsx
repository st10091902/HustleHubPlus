import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useParams
} from "react-router-dom";

import {
  getBookingById
} from "../api/bookingService";

import getApiError from "../utils/getApiError";
import formatCurrency from "../utils/formatCurrency";

function FreelancerBookingDetailsPage() {
  const {
    id
  } = useParams();

  const [
    booking,
    setBooking
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

    const loadBooking =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getBookingById(
              id
            );

          if (active) {
            setBooking(
              response.booking
            );
          }
        } catch (
          requestError
        ) {
          if (active) {
            setError(
              getApiError(
                requestError,
                "Unable to load this booking."
              )
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    loadBooking();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="page-container">

        <div className="marketplace-state">
          <div className="loading-spinner" />

          <h2>
            Loading booking
          </h2>
        </div>

      </section>
    );
  }

  if (
    error ||
    !booking
  ) {
    return (
      <section className="page-container">

        <div className="marketplace-state marketplace-error">

          <span className="state-icon">
            !
          </span>

          <h1>
            Booking unavailable
          </h1>

          <p>
            {error ||
              "This booking could not be found."}
          </p>

          <Link
            to="/freelancer/bookings"
            className="button button-primary"
          >
            Back to Bookings
          </Link>

        </div>

      </section>
    );
  }

  return (
    <section className="page-container">

      <div className="gig-details-breadcrumb">

        <Link
          to="/freelancer/bookings"
        >
          Received Bookings
        </Link>

        <span>/</span>

        <span>
          Booking Details
        </span>

      </div>

      <div className="booking-details-card">

        <div className="booking-details-header">

          <div>

            <span className="eyebrow">
              CLIENT BOOKING
            </span>

            <h1>
              {booking.gigTitle}
            </h1>

          </div>

          <span className="booking-status booking-status-large">
            {booking.status}
          </span>

        </div>

        <div className="confirmation-grid">

          <div>
            <span>
              Client
            </span>

            <strong>
              {booking.client
                ?.name ||
                "HustleHub+ Client"}
            </strong>
          </div>

          <div>
            <span>
              Client email
            </span>

            <strong>
              {booking.client
                ?.email ||
                "Not available"}
            </strong>
          </div>

          <div>
            <span>
              Earnings
            </span>

            <strong>
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
              {booking.paymentStatus}
            </strong>
          </div>

          <div>
            <span>
              Delivery
            </span>

            <strong>
              {booking.gig
                ?.deliveryDays}
              {" "}
              days
            </strong>
          </div>

          <div>
            <span>
              Received
            </span>

            <strong>
              {new Date(
                booking.createdAt
              ).toLocaleString(
                "en-ZA"
              )}
            </strong>
          </div>

        </div>

        <div className="booking-details-requirements">

          <h2>
            Client requirements
          </h2>

          <p>
            {booking.requirements ||
              "The Client supplied no additional requirements."}
          </p>

        </div>

        <div className="booking-detail-actions">

          <Link
            to="/freelancer/bookings"
            className="button button-primary"
          >
            Back to Received Bookings
          </Link>

        </div>

      </div>

    </section>
  );
}

export default FreelancerBookingDetailsPage;