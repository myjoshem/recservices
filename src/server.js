/*
==============================================
  ✅ EXPRESS SERVER CONFIGURATION (server.js)
  - Initializes Express and API routes
  - Integrates middleware for security & logging
==============================================
*/

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
  credentials: true,
}));

// ✅ Enable JSON request parsing
app.use(express.json());

// ✅ Secure API with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://unpkg.com", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://unpkg.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        connectSrc: ["'self'", "https://unpkg.com", "http://localhost:8080"],
        frameAncestors: ["'self'"],
        workerSrc: ["'self'", "blob:"],
        objectSrc: ["'none'"],
      },
    },
  })
);

// ✅ Enable Compression & Logging
app.use(compression());
app.use(morgan("dev"));

// ✅ Mount API Routes
app.use("/api", routes);

// ✅ Default Root Route to Confirm Service is Running
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Rec Services API. Use /api for endpoints." });
});

// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Start the server
const PORT = process.env.PORT || 8080;
const IS_RENDER = process.env.RENDER === "true"; // ✅ Render sets this automatically
const BASE_URL = IS_RENDER ? process.env.RENDER_EXTERNAL_URL : `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`🚀 Server running at ${BASE_URL}`);
  console.log(`📖 API is live at ${BASE_URL}/api`);
});