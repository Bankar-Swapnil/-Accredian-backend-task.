const db = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require('uuid');
const salt = 10;

// Register controller
exports.registerController = (req, res) => {
    try {
        const { username, email, password, firstname, lastname } = req.body;

        // Check if the user with the given username or email already exists
        db.query("SELECT * FROM users where username = ? or email = ?", [username, email], (err, results) => {
            if (err) {
                return res.status(300).json({ message: "Error finding the user!" });
            } else if (results.length > 0) {
                return res.status(300).json({ message: "User already exists!" });
            } else {
                // Hash the password before storing it
                const hashedPassword = bcrypt.hashSync(password, salt);

                // Insert the new user into the database
                db.query("INSERT into users (username, email, password, firstname, lastname) VALUES (?,?,?,?,?)",
                    [username, email, hashedPassword, firstname, lastname], (err, result) => {
                        if (err) return res.status(500).json({ message: "Error while registering the user!" });
                        return res.status(200).json({ result, message: "User created!" });
                    });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login controller
exports.loginController = (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        // Find the user with the given username or email
        db.query("SELECT * FROM users WHERE username = ? or email = ?", [usernameOrEmail, usernameOrEmail], (err, results) => {
            if (err) {
                return res.status(300).json({ message: "Error finding the user!" });
            } else if (results.length > 0) {
                const user = results[0];

                // Check if the entered password matches the stored hashed password
                const isPasswordCorrect = bcrypt.compareSync(password, user.password);

                if (!isPasswordCorrect) {
                    return res.status(300).json({ message: "Passwords do not match!" });
                }

                // Generate a JWT token for the user
                const token = jwt.sign({ id: user.username }, "your-secret-key");

                // Set the JWT token as a cookie
                res.cookie("jwt", token, {
                    withCredentials: true,
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                });

                return res.status(200).json({ token, username: user.username, message: "User logged in!" });
            } else {
                return res.status(300).json({ message: "Invalid credentials!" });
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Logout controller
exports.logoutContoller = (req, res) => {
    try {
        // Clear the JWT cookie to log the user out
        res.cookie("jwt", "", {
            expires: new Date(0),
            httpOnly: true,
        });
        res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
