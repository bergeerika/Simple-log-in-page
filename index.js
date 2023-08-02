// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000; // You can change this to any available port

var cors = require("cors");
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Dummy user data (you can use a database in a real-world application)
const users = [];

// Routes
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "Username is already taken" });
  }

  // Hash the password using bcrypt
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    // Create a new user object
    const newUser = {
      username,
      password: hash,
    };

    // Add the new user to the dummy user data
    users.push(newUser);

    // Respond with a success message
    res.status(201).json({ message: "Registration successful" });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Find the user by username
  const user = users.find((user) => user.username === username);

  // If the user doesn't exist or the password is incorrect
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate a JWT token
  const token = jwt.sign({ username: user.username }, "secret_key");

  // Send the token as a response
  res.json({ token });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
