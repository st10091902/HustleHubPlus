const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "The requested resource was not found."
  });
};

const globalErrorHandler = (err, req, res, next) => {
  /*
   * Malformed JSON.
   */
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body."
    });
  }

  /*
   * Request body exceeded the configured limit.
   */
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body is too large."
    });
  }

  /*
   * CORS rejection.
   */
  if (err.message === "Origin not allowed by CORS policy.") {
    return res.status(403).json({
      success: false,
      message: "Request origin is not permitted."
    });
  }

  /*
   * Log a generic message internally without
   * returning system information to the client.
   */
  console.error("An internal application error occurred.");

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred."
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler
};