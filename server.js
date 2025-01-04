const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const port = 3019;

const app = express();

// Middleware to serve static files
app.use(express.static(__dirname));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Connect to MySQL (Without selecting the database initially)
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "hitlerin39", // Replace with your MySQL password
});

// Establish connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("MySQL connection established.");

  // Create the database if it doesn't exist
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS Ecommerecce`;
  db.query(createDatabaseQuery, (err) => {
    if (err) {
      console.error("Error creating database:", err);
      return;
    }
    console.log("Database 'Ecommerecce' ensured.");

    // Use the 'Ecommerecce' database after ensuring it exists
    db.changeUser({ database: "Ecommerecce" }, (err) => {
      if (err) {
        console.error("Error selecting database:", err);
        return;
      }
      console.log("Connected to 'Ecommerecce' database.");

      // Create the table for user data (if it doesn't exist)
      const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL
      )`;

      db.query(createTableQuery, (err) => {
        if (err) {
          console.error("Error creating table:", err);
          return;
        }
        console.log("Table 'users' ensured.");
      });
    });
  });
});

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "form.html"));
});

// Handle the form submission
app.post("/post", (req, res) => {
  const { name, email, message } = req.body; // Extract values from req.body

  const insertQuery = "INSERT INTO users (name, email, message) VALUES (?, ?, ?)";
  db.query(insertQuery, [name, email, message], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Error submitting form");
      return;
    }
    console.log("Form data saved:", result);
    res.send("Form submitted successfully");
  });
});

// Start the server
app.listen(port, () => {
  console.log("Server started on port " + port);
});
