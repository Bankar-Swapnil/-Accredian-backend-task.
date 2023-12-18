const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const db = require("./models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Middlewares
app.use(express.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow specified HTTP methods
    credentials: true, // Include credentials in the CORS response (e.g., cookies)
    optionSuccessStatus: 200, // Explicitly set the success status for options requests
  })
);
app.use("/auth", authRoutes); // Use the authRoutes for handling authentication-related routes

// Connect to MySQL database
db.connect((err) => {
  if (err) console.log("Error occurred connecting to the database: " + err.stack);
  console.log("Connected to the database!");
  
  // Initialize users table if it doesn't exist
  const initialQuery =
    "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE, username VARCHAR(255) UNIQUE, password VARCHAR(500), firstname VARCHAR(255) DEFAULT NULL, lastname VARCHAR(255) DEFAULT NULL)";
  db.query(initialQuery, (err, result) => {
    if (err) console.log(err);
    console.log("Table created or already exists");
  });
});

// Server running
const PORT = 4001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));