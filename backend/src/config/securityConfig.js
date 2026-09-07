const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_ORIGIN
    ].filter(Boolean);

    // Allow requests without an Origin header,
    // such as requests made using Postman.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error("Origin not allowed by CORS policy.")
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],

  credentials: false
};

module.exports = {
  corsOptions
};