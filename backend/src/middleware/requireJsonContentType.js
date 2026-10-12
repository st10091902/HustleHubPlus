const methodsRequiringJson =
  new Set([
    "POST",
    "PUT",
    "PATCH"
  ]);

const requireJsonContentType = (
  req,
  res,
  next
) => {
  if (
    methodsRequiringJson.has(
      req.method
    ) &&
    !req.is(
      "application/json"
    )
  ) {
    return res.status(415).json({
      success: false,
      message:
        "Content-Type must be application/json."
    });
  }

  next();
};

module.exports =
  requireJsonContentType;