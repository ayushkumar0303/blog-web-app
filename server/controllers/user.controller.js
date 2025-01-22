// import bcryptojs from ''

import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

const userTest = (req, res) => {
  res.json({ message: "This is api text" });
};

export const updateUser = async (req, res) => {
  // console.log("User updating");

  if (req.user.id !== req.params.userId) {
    return res.status(403).json("You are not allowed to update this user");
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res.status(400).json("Password must be at least 6 characters");
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return res
        .status(400)
        .json("Username must be between 7 to 20 characters");
    }

    if (req.body.username != req.body.username.toLowerCase()) {
      return res.status(400).json("Username must be in lower case");
    }
    if (req.body.username.includes(" ")) {
      return res.status(400).json("Username must be include any spaces");
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return res
        .status(400)
        .json("Username must contain only numbers and letters");
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    const { password: __pass, ...rest } = updatedUser._doc;
    return res.status(200).json(rest);
  } catch (error) {
    return res.status(500).json(err.message);
  }
};

export const deleteUser = async (req, res) => {
  // console.log(req.user);
  // console.log(req.user.id);
  // console.log(req.params.userId);
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return res.status(403).json("You are not allowed to delete this user");
  }

  try {
    // console.log(req.params.id);
    await User.findByIdAndDelete(req.params.userId);
    return res.status(200).json("successfully deleted");
  } catch (error) {
    return res.status(500).json(err.message);
  }
};

export const userSignOut = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
  });
  return res.status(200).json("Successfully signed out");
};

export const getUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(400).json("You are not allowed to see all users");
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;

      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const oneMonthAgoUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    return res
      .status(200)
      .json({ users: usersWithoutPassword, totalUsers, oneMonthAgoUsers });
    return;
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  const { password, ...rest } = user._doc;

  return res.status(200).json(rest);
};

export default userTest;
