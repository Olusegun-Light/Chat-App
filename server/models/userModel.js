const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    minlength: [3, "Username must be at least 3 characters."],
    maxlength: [20, "Username must not exceed 20 characters."],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email."],
    unique: true,
    maxlength: [50, "Email must not exceed 50 characters."],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password."],
    minlength: [8, "Password must be at least 8 characters."],
    select: false, // Do not return password field by default
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

// This code automatically hashes a user's password before saving it to the database,
userSchema.pre("save", async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified("password")) return next();

  // hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// Instance method to compare passwords
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
