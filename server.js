const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb" }));

// Debugging Middleware
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, URL: ${req.url}, Origin: ${req.headers.origin}`);
  next();
});

// Configure CORS
const corsOptions = {
  origin: ["https://employee-tracker-isomorphic.vercel.app"], // Allow only specific origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions));

// Routes
app.use("/api", require("./routes/api"));

// Handle Preflight Requests
app.options("*", cors(corsOptions)); // Handle preflight requests explicitly

// HTTP server setup
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
});
