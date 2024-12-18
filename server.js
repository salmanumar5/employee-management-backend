const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb" }));

// Routes
app.use("/api", require("./routes/api"));

// HTTP server setup
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
});
