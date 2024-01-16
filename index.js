const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./database/db");
const cors = require("cors");
const cloudinary = require("cloudinary");
const acceptMultiparty = require("connect-multiparty");

// Making express app
const app = express();

// dotenv config
dotenv.config();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(acceptMultiparty());

// CORS config to accept request from frontend
const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// MongoDB connection
connectDB();

// Accepting json
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  res.status(200).send("Hello from server");
});

// User routes
app.use("/api/user", require("./routes/userRoutes"));

// Pet routes for pet adoption app
app.use("/api/product", require("./routes/productRoutes")); // Updated to use petRoutes

// Define port and start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Exporting app
module.exports = app;