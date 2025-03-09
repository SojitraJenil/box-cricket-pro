// Core dependencies
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
const http = require("http");
const socketIo = require("socket.io");
// Custom modules
const chatSocket = require("./sockets/chatSocket");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express(); // Initialize the Express app
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allow GET and POST methods
  },
});

// Initialize WebSocket for real-time communication
chatSocket(io);

// Set view engine and views directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(logger("dev")); // Log HTTP requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both origins
}));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Routes
app.use("/", indexRouter); // Index route
app.use("/images", express.static(path.join(__dirname, "public/images"))); // Serve images
app.use("/users", usersRouter); // Users route

// Catch 404 errors and forward to the error handler
app.use((req, res, next) => {
  next(createError(404, "Resource not found")); // Pass a custom 404 error to the handler
});

// Error handler
app.use((err, req, res, next) => {
  // Customize the error response based on the request type
  if (req.accepts("json")) {
    res.status(err.status || 500).json({
      message: err.message,
      error: req.app.get("env") === "development" ? err : {}, // Show stack trace in development
    });
  } else {
    // Render an error page for non-JSON requests
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
  }
});

// Export both the app and the server for use in other files
module.exports = { app, server };
