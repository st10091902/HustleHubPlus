const sanitizeHtml = require("sanitize-html");

/**
 * Convert user-controlled display text into plain text.
 *
 * HTML tags and attributes are removed because
 * HustleHub+ Part 2 does not require users to submit HTML.
 */
const sanitizePlainText = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return sanitizeHtml(
    value,
    {
      allowedTags: [],
      allowedAttributes: {}
    }
  )
    .replace(/\u0000/g, "")
    .trim();
};

module.exports = sanitizePlainText;