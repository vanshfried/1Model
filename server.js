const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const port = 3019;

// Database credentials
const dbConfig = {
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "hitlerin39", // Replace with your MySQL password
};

// Middleware to serve static files and parse form data
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// Connect to MySQL and setup database and table
const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL.");

  // Ensure database exists
  const createDatabase = "CREATE DATABASE IF NOT EXISTS intro_data";
  db.query(createDatabase, (err) => {
    if (err) {
      console.error("Error creating database:", err);
      process.exit(1);
    }
    console.log("Database 'intro_data' ensured.");

    // Switch to the database
    db.changeUser({ database: "intro_data" }, (err) => {
      if (err) {
        console.error("Error switching database:", err);
        process.exit(1);
      }
      console.log("Using 'intro_data' database.");

      // Drop the table if it exists
      const dropTable = "DROP TABLE IF EXISTS users";
      db.query(dropTable, (err) => {
        if (err) {
          console.error("Error dropping table:", err);
          process.exit(1);
        }
        console.log("Existing 'users' table dropped (if it existed).");

        // Create the table
        const createTable = `
          CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            course VARCHAR(255) NOT NULL
          )`;
        db.query(createTable, (err) => {
          if (err) {
            console.error("Error creating table:", err);
            process.exit(1);
          }
          console.log("Table 'users' created successfully.");
        });
      });
    });
  });
});

// Serve the form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "form.html"));
});

// Handle form submissions
app.post("/post", (req, res) => {
  const { name, email, message, course } = req.body;

  const insertQuery = "INSERT INTO users (name, email, message, course) VALUES (?, ?, ?, ?)";
  db.query(insertQuery, [name, email, message, course], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Error saving your data. Please try again.");
      return;
    }
    console.log("Form data saved:", result);
    res.send("<h1>Form submitted successfully!</h1><a href='/'>Go back</a>");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
