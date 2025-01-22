import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username.length === 0 ||
    email.length === 0 ||
    password.length === 0
  ) {
    return res.status(400).json("All fields are requird");
  }

  const hashPassword = bcryptjs.hashSync(password);

  try {
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json("SignUp succussfull");
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return res.status(500).json("All fields are required");
  }

  const validUser = await User.findOne({ email });
  if (!validUser) {
    return res.status(400).json("User not found");
  }

  // console.log(password);
  // console.log(validUser.password);
  const validPass = bcryptjs.compareSync(password, validUser.password);
  // console.log(validPass);

  if (!validPass) {
    return res.status(404).json("Incorrect password");
  }

  const { password: _pass, ...rest } = validUser._doc;
  // console.log(validUser);
  // console.log(rest);

  const token = jwt.sign(
    {
      id: validUser._id,
      isAdmin: validUser.isAdmin,
    },
    process.env.SECRET_KEY
  );

  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .json(rest);
};

export const google = async (req, res) => {
  const { name, email, profilePicture } = req.body;
  // console.log(profilePicture);
  try {
    const user = await User.findOne({ email });
    if (user) {
      const { password: _pass, ...rest } = user._doc;

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY
      );
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const password = Math.random().toString(36).slice(-8);
      const userName =
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4);
      const hashPassword = bcryptjs.hashSync(password, 10);
      try {
        const newUser = new User({
          username: userName,
          email: email,
          password: hashPassword,
          profilePicture: profilePicture,
        });

        await newUser.save();

        const token = jwt.sign(
          { id: newUser._id, isAdmin: newUser.isAdmin },
          process.env.SECRET_KEY
        );
        const { password: _pass, ...rest } = newUser._doc;
        res
          .status(200)
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .json(rest);
      } catch (error) {
        return res.status(500).json(error.message);
      }
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
