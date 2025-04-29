const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");

const { onlineUsers } = require("../utils/socket");

exports.register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return next(new AppError("Username already used", 400));
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return next(new AppError("Email already used", 400));
  }

  const newUser = await User.create({ username, email, password });

  const user = newUser.toObject();
  delete user.password;

  res.status(201).json({ status: true, user });
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if email and password exist
  if (!username || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect username or password", 401));
  }

  // const userData = user.toObject();
  delete user.password;

  // res.status(200).json({ status: true, user: userData });
  // res.status(200).json({ status: true, user });
  return res.json({ status: true, user });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ _id: { $ne: req.params.id } }).select([
    "email",
    "username",
    "avatarImage",
    "_id",
  ]);
  // res.status(200).json({ status: true, users });
  return res.json(users);
});

exports.setAvatar = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  // const avatarImage = req.body.image;
  const avatarImage = req.body.avatarImage;

  const user = await User.findByIdAndUpdate(
    userId,
    { isAvatarImageSet: true, avatarImage },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    isSet: user.isAvatarImageSet,
    image: user.avatarImage,
  });
});

exports.logout = catchAsync((req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("User id is required", 400));
  }

  const userId = req.params.id;

  // Check if the user exists in the onlineUsers map
  if (onlineUsers.has(userId)) {
    const socketId = onlineUsers.get(userId);

    // Disconnect the user's socket if still connected
    const socket = global.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.disconnect(true); // Forcefully disconnect the socket
    }

    onlineUsers.delete(userId); // Remove user from onlineUsers map
    console.log(`✅ User with id ${userId} logged out and disconnected.`);
  } else {
    console.log(`ℹ️ User with id ${userId} was not found in online users.`);
  }

  return res.status(200).send();
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const userId = req.params.id;

  const updateFields = {};

  if (req.body.avatarImage) {
    updateFields.avatarImage = req.body.avatarImage;
  }
  console.log("Avatar Image URL:", req.body.avatarImage);

  if (username) {
    const usernameExists = await User.findOne({ username });
    if (usernameExists && usernameExists._id.toString() !== userId) {
      return next(new AppError("Username already taken", 400));
    }
    updateFields.username = username;
  }

  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== userId) {
      return next(new AppError("Email already taken", 400));
    }
    updateFields.email = email;
  }

  if (password) {
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 12);
    updateFields.password = hashedPassword;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: true,
    user: updatedUser,
  });
});
