const dangerousKeys = new Set([
  "__proto__",
  "prototype",
  "constructor"
]);

/**
 * Recursively inspect request data for keys
 * commonly associated with NoSQL operator injection
 * or prototype pollution.
 */
const containsUnsafeKey = (value) => {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(
      containsUnsafeKey
    );
  }

  return Object.entries(
    value
  ).some(
    ([key, nestedValue]) => {
      if (
        key.startsWith("$") ||
        key.includes(".") ||
        dangerousKeys.has(key)
      ) {
        return true;
      }

      return containsUnsafeKey(
        nestedValue
      );
    }
  );
};

const rejectUnsafeMongoKeys = (
  req,
  res,
  next
) => {
  if (
    containsUnsafeKey(req.body) ||
    containsUnsafeKey(req.query)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Unsafe request structure detected."
    });
  }

  next();
};

module.exports =
  rejectUnsafeMongoKeys;