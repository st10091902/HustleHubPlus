import {
  Link
} from "react-router-dom";

function ForbiddenPage() {
  return (
    <section className="not-found">

      <div>

        <span className="error-code">
          403
        </span>

        <h1>
          Access denied
        </h1>

        <p>
          Your account does not
          have permission to access
          this page.
        </p>

        <Link
          to="/dashboard"
          className="button button-primary"
        >
          Return to Dashboard
        </Link>

      </div>

    </section>
  );
}

export default ForbiddenPage;