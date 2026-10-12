const getApiError = (
  error,
  fallbackMessage =
    "Something went wrong. Please try again."
) => {
  const responseData =
    error?.response?.data;

  if (
    Array.isArray(
      responseData?.errors
    ) &&
    responseData.errors.length > 0
  ) {
    return responseData.errors
      .map(
        (item) =>
          item.message
      )
      .join(" ");
  }

  if (
    responseData?.message
  ) {
    return responseData.message;
  }

  if (
    error?.code ===
    "ECONNABORTED"
  ) {
    return (
      "The request timed out. " +
      "Please try again."
    );
  }

  return fallbackMessage;
};

export default getApiError;