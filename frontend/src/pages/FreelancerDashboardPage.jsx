import {
  useAuth
} from "../context/AuthContext";

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

        <article className="dashboard-card">

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

        </article>

        <article className="dashboard-card">

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

        </article>

        <article className="dashboard-card">

          <span className="dashboard-icon">
            📈
          </span>

          <h2>
            Income
          </h2>

          <p>
            Track completed
            marketplace earnings.
          </p>

        </article>

      </div>

    </section>
  );
}

export default FreelancerDashboardPage;