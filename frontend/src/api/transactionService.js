import apiClient from "./apiClient";

/**
 * Return financial Transactions belonging
 * to the authenticated Freelancer.
 */
export const getFreelancerTransactions =
  async () => {
    const response =
      await apiClient.get(
        "/transactions/freelancer"
      );

    return response.data;
  };

/**
 * Return Freelancer income and
 * estimated tax information.
 */
export const getFreelancerIncome =
  async () => {
    const response =
      await apiClient.get(
        "/transactions/income"
      );

    return response.data;
  };

/**
 * Retrieve an individual Transaction
 * when the authenticated user is
 * permitted to view it.
 */
export const getTransactionById =
  async (transactionId) => {
    const response =
      await apiClient.get(
        `/transactions/${transactionId}`
      );

    return response.data;
  };