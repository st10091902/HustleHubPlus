import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  checkApiHealth
} from "../api/healthService";

function HomePage() {
    const [
    apiStatus,
    setApiStatus
  ] = useState("checking");

  useEffect(() => {
    const verifyApi =
      async () => {
        try {
          await checkApiHealth();

          setApiStatus(
            "connected"
          );
        } catch {
          setApiStatus(
            "offline"
          );
        }
      };

    verifyApi();
  }, []);
  return (
    <>
      <section className="hero">

        <div className="hero-content">

          <span className="eyebrow">
            SECURE FREELANCE MARKETPLACE
          </span>

          <h1>
            Find the right talent.
            <br />
            Build something great.
          </h1>

          <p>
            HustleHub+ connects Clients
            with skilled Freelancers through
            a secure and simple marketplace.
          </p>

          <div className="hero-actions">

            <Link
              to="/marketplace"
              className="button button-primary"
            >
              Browse Gigs
            </Link>

            <Link
              to="/register"
              className="button button-secondary"
            >
              Join HustleHub+
            </Link>

          </div>

        </div>

        <div className="hero-card">

          <div className="hero-card-header">
            <span 
              className={
                apiStatus === "connected"
                ? "status-dot"
                : "status-dot status-dot-offline"
              }
          />
          {apiStatus === "connected"
          ? "Secure API Connected"
          : apiStatus === "offline"
            ? "API Connection Unavailable"
            : "Checking Secure API..."}
          </div>

          <div className="feature-row">
            <span>🔐</span>

            <div>
              <strong>
                Secure Authentication
              </strong>

              <p>
                HTTPS, bcrypt and JWT
                protection.
              </p>
            </div>
          </div>

          <div className="feature-row">
            <span>💼</span>

            <div>
              <strong>
                Freelance Services
              </strong>

              <p>
                Browse and manage
                professional Gigs.
              </p>
            </div>
          </div>

          <div className="feature-row">
            <span>📈</span>

            <div>
              <strong>
                Income Tracking
              </strong>

              <p>
                Freelancers can monitor
                marketplace earnings.
              </p>
            </div>
          </div>

        </div>

      </section>

      <section className="section">

        <div className="section-heading">
          <span className="eyebrow">
            HOW IT WORKS
          </span>

          <h2>
            Built for Clients and Freelancers
          </h2>
        </div>

        <div className="info-grid">

          <article className="info-card">
            <div className="info-number">
              01
            </div>

            <h3>
              Discover
            </h3>

            <p>
              Browse active services
              offered by HustleHub+
              Freelancers.
            </p>
          </article>

          <article className="info-card">
            <div className="info-number">
              02
            </div>

            <h3>
              Book
            </h3>

            <p>
              Select a Gig and create
              a secure booking through
              the marketplace.
            </p>
          </article>

          <article className="info-card">
            <div className="info-number">
              03
            </div>

            <h3>
              Grow
            </h3>

            <p>
              Freelancers manage Gigs,
              bookings and marketplace
              income.
            </p>
          </article>

        </div>

      </section>
    </>
  );
}

export default HomePage;