const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const port = 3019;

const app = express();

// Middleware to serve static files
app.use(express.static(__dirname));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/students");
const db = mongoose.connection;
db.once("open", () => {
  console.log("Mongodb connection done");
});

// Schema for user data
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

// Model for user data
const Users = mongoose.model("data", userSchema);

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "form.html"));
});

// Handle the form submission
app.post("/post", async (req, res) => {
    const { name, email, message } = req.body;  // Extract values from req.body
    const user = new Users({
        name,
        email,
        message
    });
    await user.save();  // Save the data to the database
    console.log(user);  // Log the saved user data
    res.send("Form submitted successfully");  // Response after saving
});

// Start the server
app.listen(port, () => {
  console.log("Server started on port " + port);
});
