import {
  useEffect,
  useMemo,
  useState
} from "react";

import GigCard from "../components/GigCard";

import {
  getAvailableGigs
} from "../api/gigService";

import getApiError from "../utils/getApiError";

function MarketplacePage() {
  const [
    gigs,
    setGigs
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  const [
    search,
    setSearch
  ] = useState("");

  const [
    category,
    setCategory
  ] = useState("ALL");

  useEffect(() => {
    let active = true;

    const loadGigs =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getAvailableGigs();

          if (active) {
            setGigs(
              response.gigs || []
            );
          }
        } catch (
          requestError
        ) {
          if (active) {
            setError(
              getApiError(
                requestError,
                "Unable to load marketplace Gigs."
              )
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    loadGigs();

    return () => {
      active = false;
    };
  }, []);

  /*
   * Generate category options from
   * the returned marketplace data.
   */
  const categories =
    useMemo(
      () => {
        const unique =
          new Set(
            gigs
              .map(
                (gig) =>
                  gig.category
              )
              .filter(Boolean)
          );

        return [
          "ALL",
          ...Array.from(
            unique
          ).sort()
        ];
      },
      [gigs]
    );

  /*
   * Search/filter locally.
   *
   * The API still controls which Gigs
   * may enter the marketplace.
   */
  const filteredGigs =
    useMemo(
      () => {
        const normalisedSearch =
          search
            .trim()
            .toLowerCase();

        return gigs.filter(
          (gig) => {
            const matchesCategory =
              category ===
                "ALL" ||
              gig.category ===
                category;

            const searchableText =
              [
                gig.title,
                gig.description,
                gig.category,
                gig.freelancer
                  ?.name
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
              !normalisedSearch ||
              searchableText.includes(
                normalisedSearch
              );

            return (
              matchesCategory &&
              matchesSearch
            );
          }
        );
      },
      [
        gigs,
        search,
        category
      ]
    );

  return (
    <section className="page-container">

      <div className="marketplace-heading">

        <div className="page-heading">

          <span className="eyebrow">
            MARKETPLACE
          </span>

          <h1>
            Find the right
            Freelancer
          </h1>

          <p>
            Browse active services
            offered by HustleHub+
            Freelancers.
          </p>

        </div>

        {!loading &&
          !error && (
          <div className="marketplace-count">
            <strong>
              {
                filteredGigs.length
              }
            </strong>

            <span>
              {filteredGigs.length ===
              1
                ? "Gig available"
                : "Gigs available"}
            </span>
          </div>
        )}

      </div>

      {!loading &&
        !error &&
        gigs.length > 0 && (
        <div className="marketplace-toolbar">

          <div className="marketplace-search">

            <label
              htmlFor="gig-search"
              className="sr-only"
            >
              Search Gigs
            </label>

            <input
              id="gig-search"
              type="search"
              value={search}
              onChange={
                (event) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
              }
              placeholder="Search services, categories or Freelancers..."
            />

          </div>

          <div className="marketplace-filter">

            <label
              htmlFor="gig-category"
              className="sr-only"
            >
              Filter by category
            </label>

            <select
              id="gig-category"
              value={category}
              onChange={
                (event) =>
                  setCategory(
                    event
                      .target
                      .value
                  )
              }
            >

              {categories.map(
                (
                  categoryName
                ) => (
                  <option
                    key={
                      categoryName
                    }
                    value={
                      categoryName
                    }
                  >
                    {categoryName ===
                    "ALL"
                      ? "All Categories"
                      : categoryName}
                  </option>
                )
              )}

            </select>

          </div>

        </div>
      )}

      {loading && (
        <div className="marketplace-state">

          <div
            className="loading-spinner"
          />

          <h2>
            Loading marketplace
          </h2>

          <p>
            Retrieving active Gigs
            from HustleHub+.
          </p>

        </div>
      )}

      {!loading &&
        error && (
        <div className="marketplace-state marketplace-error">

          <span className="state-icon">
            !
          </span>

          <h2>
            Marketplace unavailable
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="button button-primary"
            onClick={
              () =>
                window.location.reload()
            }
          >
            Try Again
          </button>

        </div>
      )}

      {!loading &&
        !error &&
        gigs.length === 0 && (
        <div className="marketplace-state">

          <span className="state-icon">
            💼
          </span>

          <h2>
            No active Gigs yet
          </h2>

          <p>
            Freelance services will
            appear here once they are
            published.
          </p>

        </div>
      )}

      {!loading &&
        !error &&
        gigs.length > 0 &&
        filteredGigs.length ===
          0 && (
        <div className="marketplace-state">

          <span className="state-icon">
            🔎
          </span>

          <h2>
            No matching Gigs
          </h2>

          <p>
            Try another search term
            or category.
          </p>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setSearch("");
              setCategory("ALL");
            }}
          >
            Clear Filters
          </button>

        </div>
      )}

      {!loading &&
        !error &&
        filteredGigs.length >
          0 && (
        <div className="gig-grid">

          {filteredGigs.map(
            (gig) => (
              <GigCard
                key={gig._id}
                gig={gig}
              />
            )
          )}

        </div>
      )}

    </section>
  );
}

export default MarketplacePage;