const express = require("express");

// Importing controller functions from the auth module
const { loginController, registerController, logoutContoller } = require("../controllers/auth");

// Creating an instance of the Express Router
const router = express.Router();

// Endpoint for user registration
router.post("/register", registerController);

// Endpoint for user login
router.post("/login", loginController);

// Endpoint for user logout
router.get("/logout", logoutContoller);

// Exporting the router for use in other files
module.exports = router;
