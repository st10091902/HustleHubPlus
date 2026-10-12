import {
  Link
} from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="not-found">

      <div>

        <span className="error-code">
          404
        </span>

        <h1>
          Page not found
        </h1>

        <p>
          The page you requested
          does not exist.
        </p>

        <Link
          to="/"
          className="button button-primary"
        >
          Return Home
        </Link>

      </div>

    </section>
  );
}

export default NotFoundPage;