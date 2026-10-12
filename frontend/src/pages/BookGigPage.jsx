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
  createBooking
} from "../api/bookingService";

import getApiError from "../utils/getApiError";
import formatCurrency from "../utils/formatCurrency";

function BookGigPage() {
  const {
    id
  } = useParams();

  const [
    gig,
    setGig
  ] = useState(null);

  const [
    requirements,
    setRequirements
  ] = useState("");

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

  const [
    bookingResult,
    setBookingResult
  ] = useState(null);

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

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setSubmitting(true);

      try {
        /*
         * SECURITY:
         * Do not send price, Freelancer,
         * Client, status or payment information.
         */
        const response =
          await createBooking({
            gigId: id,
            requirements:
              requirements.trim()
          });

        setBookingResult(
          response
        );
      } catch (
        requestError
      ) {
        setError(
          getApiError(
            requestError,
            "Unable to create this booking."
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
            Preparing booking
          </h2>

          <p>
            Retrieving the selected
            Gig securely.
          </p>

        </div>

      </section>
    );
  }

  if (
    error &&
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
            {error}
          </p>

          <Link
            to="/marketplace"
            className="button button-primary"
          >
            Return to Marketplace
          </Link>

        </div>

      </section>
    );
  }

  if (bookingResult) {
    const {
      booking,
      transaction
    } = bookingResult;

    return (
      <section className="page-container">

        <div className="booking-success">

          <div className="booking-success-icon">
            ✓
          </div>

          <span className="eyebrow">
            BOOKING CONFIRMED
          </span>

          <h1>
            Your booking is confirmed
          </h1>

          <p className="booking-success-intro">
            HustleHub+ recorded your booking
            and created the corresponding
            simulated financial transaction.
          </p>

          <div className="confirmation-grid">

            <div>
              <span>
                Service
              </span>

              <strong>
                {booking.gigTitle}
              </strong>
            </div>

            <div>
              <span>
                Amount
              </span>

              <strong>
                {formatCurrency(
                  booking.amount
                )}
              </strong>
            </div>

            <div>
              <span>
                Booking status
              </span>

              <strong>
                {booking.status}
              </strong>
            </div>

            <div>
              <span>
                Payment
              </span>

              <strong>
                {
                  booking.paymentStatus
                }
              </strong>
            </div>

            <div>
              <span>
                Transaction status
              </span>

              <strong>
                {
                  transaction.status
                }
              </strong>
            </div>

            <div>
              <span>
                Currency
              </span>

              <strong>
                {
                  transaction.currency
                }
              </strong>
            </div>

          </div>

          <div className="transaction-reference">

            <span>
              Transaction reference
            </span>

            <code>
              {
                transaction
                  .transactionReference
              }
            </code>

          </div>

          <div className="booking-success-actions">

            <Link
              to="/client/bookings"
              className="button button-primary"
            >
              View My Bookings
            </Link>

            <Link
              to="/marketplace"
              className="button button-secondary"
            >
              Continue Browsing
            </Link>

          </div>

          <p className="simulated-payment-note">
            No real card or banking information
            was collected. Payment confirmation
            is simulated for this project.
          </p>

        </div>

      </section>
    );
  }

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

        <Link
          to={`/marketplace/${gig._id}`}
        >
          Gig Details
        </Link>

        <span>
          /
        </span>

        <span>
          Book
        </span>

      </div>

      <div className="booking-layout">

        <div className="booking-form-card">

          <span className="eyebrow">
            SECURE BOOKING
          </span>

          <h1>
            Book this Gig
          </h1>

          <p className="booking-form-intro">
            Add any information the
            Freelancer needs to complete
            your request.
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
            className="booking-form"
            onSubmit={
              handleSubmit
            }
          >

            <div className="form-group">

              <label
                htmlFor="requirements"
              >
                Project requirements
              </label>

              <textarea
                id="requirements"
                name="requirements"
                value={
                  requirements
                }
                onChange={
                  (event) =>
                    setRequirements(
                      event.target.value
                    )
                }
                maxLength={1000}
                rows={8}
                placeholder="Describe what you need, preferred style, important details or other requirements..."
              />

              <small>
                Optional · Maximum
                1,000 characters
              </small>

            </div>

            <div className="secure-booking-notice">

              <span>
                🔒
              </span>

              <div>
                <strong>
                  Secure booking
                </strong>

                <p>
                  Price and Freelancer
                  information are verified
                  by the HustleHub+ server.
                  They cannot be changed
                  through this form.
                </p>
              </div>

            </div>

            <button
              type="submit"
              className="button button-primary booking-submit"
              disabled={
                submitting
              }
            >
              {submitting
                ? "Confirming Booking..."
                : "Confirm Booking"}
            </button>

          </form>

        </div>

        <aside className="booking-summary-card">

          <span className="gig-category">
            {gig.category}
          </span>

          <h2>
            {gig.title}
          </h2>

          <div className="booking-summary-row">

            <span>
              Freelancer
            </span>

            <strong>
              {gig.freelancer
                ?.name ||
                "HustleHub+ Freelancer"}
            </strong>

          </div>

          <div className="booking-summary-row">

            <span>
              Delivery
            </span>

            <strong>
              {gig.deliveryDays}
              {" "}
              {gig.deliveryDays === 1
                ? "day"
                : "days"}
            </strong>

          </div>

          <div className="booking-summary-row booking-summary-price">

            <span>
              Confirmed price
            </span>

            <strong>
              {formatCurrency(
                gig.price
              )}
            </strong>

          </div>

          <p className="booking-summary-help">
            The final booking amount is
            retrieved again by the backend
            from MongoDB when you confirm.
          </p>

        </aside>

      </div>

    </section>
  );
}

export default BookGigPage;