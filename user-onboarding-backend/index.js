const User = require("./models/user");

require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

console.log("🔥🔥🔥 THIS FILE IS RUNNING 🔥🔥🔥");
console.log("FILE PATH:", __filename);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Health route
app.get("/health", (req, res) => {
  res.send("Backend is running");
});

// Signup route
app.post("/api/signup", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }
  console.log("Signup API hit:", name, email);

  try {
    // 🔹 Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔹 Save user to MongoDB
    const newUser = await User.create({ name, email });

    console.log("User saved in DB:", newUser.email);

    const n8nResponse = await fetch(
      "https://rashmithakkar.app.n8n.cloud/webhook/user-signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      },
    );
    console.log("n8n response status:", n8nResponse.status);

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error calling n8n:", error);

    res.status(500).json({ message: "Signup failed" });
  }
});

app.post("/api/update-status", async (req, res) => {
  const { email, status } = req.body;

  try {
    await User.updateOne({ email }, { onboardingStatus: status });

    console.log("Status updated:", email, status);

    res.json({ message: "Status updated" });
  } catch (error) {
    console.error("Status update failed:", error);
    res.status(500).json({ message: "Update failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
