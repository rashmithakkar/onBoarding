const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // prevents duplicate emails
      lowercase: true,
      trim: true,
    },
    onboardingStatus: {
      type: String,
      default: "NEW",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
