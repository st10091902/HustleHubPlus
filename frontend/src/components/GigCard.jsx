import {
  Link
} from "react-router-dom";

import formatCurrency from "../utils/formatCurrency";

function GigCard({
  gig
}) {
  const freelancerName =
    gig.freelancer?.name ||
    "HustleHub+ Freelancer";

  return (
    <article className="gig-card">

      <div className="gig-card-top">

        <span className="gig-category">
          {gig.category}
        </span>

        <span className="gig-status">
          Active
        </span>

      </div>

      <div className="gig-card-body">

        <h2>
          {gig.title}
        </h2>

        <p className="gig-description">
          {gig.description}
        </p>

        <div className="gig-freelancer">
          <div className="avatar-circle">
            {freelancerName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <span>
              Offered by
            </span>

            <strong>
              {freelancerName}
            </strong>
          </div>
        </div>

      </div>

      <div className="gig-card-footer">

        <div>
          <span className="gig-meta-label">
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

        <div className="gig-price">
          <span>
            From
          </span>

          <strong>
            {formatCurrency(
              gig.price
            )}
          </strong>
        </div>

      </div>

      <Link
        to={`/marketplace/${gig._id}`}
        className="button button-primary gig-card-button"
      >
        View Gig
      </Link>

    </article>
  );
}

export default GigCard;