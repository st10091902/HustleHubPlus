require("dotenv").config();

const https = require("https");
const fs = require("fs");
const path = require("path");

const app = require("./app");

const {
  connectDatabase
} = require("./config/database");

const PORT = process.env.PORT || 3000;

/**
 * Starts the HustleHub+ backend after all
 * required infrastructure is available.
 */
const startServer = async () => {
  try {
    /*
     * Connect to MongoDB before accepting requests.
     */
    await connectDatabase();

    if (
      !process.env.SSL_KEY_PATH ||
      !process.env.SSL_CERT_PATH
    ) {
      throw new Error(
        "SSL configuration is missing."
      );
    }

    const keyPath = path.resolve(
      process.env.SSL_KEY_PATH
    );

    const certPath = path.resolve(
      process.env.SSL_CERT_PATH
    );

    const sslOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };

    const server = https.createServer(
      sslOptions,
      app
    );

    server.listen(PORT, () => {
      console.log("====================================");
      console.log("        HustleHub+ Backend");
      console.log("====================================");
      console.log(`HTTPS server running on port ${PORT}`);
      console.log(
        `Environment: ${
          process.env.NODE_ENV || "development"
        }`
      );
      console.log(
        `Health check: https://localhost:${PORT}/api/health`
      );
      console.log("MongoDB: Connected");
      console.log("====================================");
    });

    return server;
  } catch (error) {
    console.error(
      "Unable to start HustleHub+ backend."
    );

    process.exit(1);
  }
};

startServer();