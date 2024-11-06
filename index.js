const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use async/await for the connection to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongoose connected!");
  } catch (err) {
    console.error("Mongoose connection error:", err);
    process.exit(1); // Exit the process if connection fails
  }
}

// Call the connect function to establish MongoDB connection
connectToMongoDB();

// Define User model
const User = mongoose.model("User", { name: String });

// POST route to create a user
app.post("/user", async (req, res) => {
  try {
    const user = new User({ name: req.body.username });
    await user.save();
    res.status(201).send("Success!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start the Express server and listen on port 3000
const server = app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

// Gracefully shutting down the server
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing HTTP server.');
  server.close(() => {
    console.log('HTTP server closed.');

    // Close MongoDB connection gracefully
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0); // Exit the process with a success code
    });
  });
});

process.on('SIGINT', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing HTTP server.');
  server.close(() => {
    console.log('HTTP server closed.');

    // Close MongoDB connection gracefully
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0); // Exit the process with a success code
    });
  });
});