import {
  useAuth
} from "../context/useAuth";

import {
  Link
} from "react-router-dom";

function FreelancerDashboardPage() {
  const {
    user
  } = useAuth();

  return (
    <section className="page-container">

      <div className="dashboard-welcome">

        <span className="eyebrow">
          FREELANCER DASHBOARD
        </span>

        <h1>
          Welcome, {user.name}
        </h1>

        <p>
          Manage Gigs, bookings
          and HustleHub+ income.
        </p>

      </div>

      <div className="dashboard-grid">

        <Link
          to="/freelancer/gigs"
          className="dashboard-card dashboard-card-link"
        >

          <span className="dashboard-icon">
            💼
          </span>

          <h2>
            My Gigs
          </h2>

          <p>
            Create and manage your
            marketplace services.
          </p>

        </Link>

        <Link
          to="/freelancer/bookings"
          className="dashboard-card dashboard-card-link"
        >

          <span className="dashboard-icon">
            📦
          </span>

          <h2>
            Bookings
          </h2>

          <p>
            Review Clients who have
            booked your services.
          </p>

        </Link>

        <Link
          to="/freelancer/finance"
          className="dashboard-card dashboard-card-link"
        >

          <span className="dashboard-icon">
            📈
          </span>

          <h2>
            Income
          </h2>

          <p>
            Track marketplace earnings,
            transactions and estimated tax.
          </p>

        </Link>

      </div>

    </section>
  );
}

export default FreelancerDashboardPage;