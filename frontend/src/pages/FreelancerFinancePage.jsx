import {
  useEffect,
  useState
} from "react";

import {
  getFreelancerIncome,
  getFreelancerTransactions
} from "../api/transactionService";

import getApiError from "../utils/getApiError";
import formatCurrency from "../utils/formatCurrency";

function FreelancerFinancePage() {
  const [
    income,
    setIncome
  ] = useState(null);

  const [
    transactions,
    setTransactions
  ] = useState([]);

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

    const loadFinance =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            incomeResponse,
            transactionResponse
          ] = await Promise.all([
            getFreelancerIncome(),
            getFreelancerTransactions()
          ]);

          if (active) {
            setIncome(
              incomeResponse.income
            );

            setTransactions(
              transactionResponse
                .transactions ||
                []
            );
          }
        } catch (
          requestError
        ) {
          if (active) {
            setError(
              getApiError(
                requestError,
                "Unable to load your financial dashboard."
              )
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    loadFinance();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="page-container">

        <div className="marketplace-state">

          <div className="loading-spinner" />

          <h2>
            Loading financial dashboard
          </h2>

          <p>
            Calculating marketplace
            income and transactions.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="page-container">

      <div className="form-page-header">

        <div>

          <span className="eyebrow">
            FREELANCER FINANCE
          </span>

          <h1>
            Financial Dashboard
          </h1>

          <p>
            Track HustleHub+ income,
            transactions and estimated
            tax obligations.
          </p>

        </div>

      </div>

      {error && (
        <div
          className="alert alert-error management-alert"
          role="alert"
        >
          {error}
        </div>
      )}

      {!error &&
        income && (
        <>
          <div className="finance-summary-grid">

            <article className="finance-summary-card">

              <span>
                Total Income
              </span>

              <strong>
                {formatCurrency(
                  income.totalIncome
                )}
              </strong>

              <small>
                Completed marketplace
                payments
              </small>

            </article>

            <article className="finance-summary-card">

              <span>
                Estimated Tax
              </span>

              <strong>
                {formatCurrency(
                  income.estimatedTax
                )}
              </strong>

              <small>
                Simplified estimate at
                {" "}
                {(
                  income
                    .estimatedTaxRate *
                  100
                ).toFixed(0)}
                %
              </small>

            </article>

            <article className="finance-summary-card">

              <span>
                Estimated After Tax
              </span>

              <strong>
                {formatCurrency(
                  income
                    .estimatedAfterTaxIncome
                )}
              </strong>

              <small>
                Income less estimated tax
              </small>

            </article>

            <article className="finance-summary-card">

              <span>
                Transactions
              </span>

              <strong>
                {
                  income
                    .completedTransactions
                }
              </strong>

              <small>
                Completed bookings
              </small>

            </article>

          </div>

          <div className="tax-disclaimer">

            <strong>
              Estimated tax only
            </strong>

            <p>
              This figure is a simplified
              academic estimate configured
              for HustleHub+. It is not an
              official SARS tax calculation
              or financial advice.
            </p>

          </div>
        </>
      )}

      <div className="finance-section-header">

        <div>
          <span className="eyebrow">
            TRANSACTIONS
          </span>

          <h2>
            Income History
          </h2>
        </div>

        <span>
          {transactions.length}
          {" "}
          {transactions.length === 1
            ? "transaction"
            : "transactions"}
        </span>

      </div>

      {!error &&
        transactions.length ===
          0 && (
        <div className="marketplace-state">

          <span className="state-icon">
            📈
          </span>

          <h2>
            No income yet
          </h2>

          <p>
            Completed Client bookings
            will automatically create
            income Transactions here.
          </p>

        </div>
      )}

      {transactions.length > 0 && (
        <div className="transaction-table-wrapper">

          <table className="transaction-table">

            <thead>
              <tr>
                <th>
                  Service
                </th>

                <th>
                  Client
                </th>

                <th>
                  Date
                </th>

                <th>
                  Status
                </th>

                <th>
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>

              {transactions.map(
                (transaction) => (
                  <tr
                    key={
                      transaction._id
                    }
                  >

                    <td>

                      <strong>
                        {
                          transaction
                            .gigTitle
                        }
                      </strong>

                      <small>
                        {
                          transaction
                            .transactionReference
                        }
                      </small>

                    </td>

                    <td>
                      {transaction.client
                        ?.name ||
                        "HustleHub+ Client"}
                    </td>

                    <td>
                      {new Date(
                        transaction
                          .createdAt
                      ).toLocaleDateString(
                        "en-ZA"
                      )}
                    </td>

                    <td>

                      <span className="transaction-status">
                        {
                          transaction
                            .status
                        }
                      </span>

                    </td>

                    <td className="transaction-amount">

                      {formatCurrency(
                        transaction
                          .amount
                      )}

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </section>
  );
}

export default FreelancerFinancePage;