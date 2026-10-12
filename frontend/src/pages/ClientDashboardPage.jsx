import {
  useAuth
} from "../context/AuthContext";

import {
  Link
} from "react-router-dom";

function ClientDashboardPage() {
  const {
    user
  } = useAuth();

  return (
    <section className="page-container">

      <div className="dashboard-welcome">

        <span className="eyebrow">
          CLIENT DASHBOARD
        </span>

        <h1>
          Welcome, {user.name}
        </h1>

        <p>
          Browse services and
          manage your HustleHub+
          bookings.
        </p>

      </div>

      <div className="dashboard-grid">

        <Link
          to="/marketplace"
          className="dashboard-card dashboard-card-link"
        >

          <span className="dashboard-icon">
            🔎
          </span>

          <h2>
            Marketplace
          </h2>

          <p>
            Discover active services
            from HustleHub+
            Freelancers.
          </p>

        </Link>

        <article className="dashboard-card">

          <span className="dashboard-icon">
            📦
          </span>

          <h2>
            My Bookings
          </h2>

          <p>
            Your confirmed bookings
            will be managed here.
          </p>

        </article>

        <article className="dashboard-card">

          <span className="dashboard-icon">
            💳
          </span>

          <h2>
            Transactions
          </h2>

          <p>
            Review your simulated
            marketplace transactions.
          </p>

        </article>

      </div>

    </section>
  );
}

export default ClientDashboardPage;