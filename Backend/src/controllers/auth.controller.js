import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

/**
 * REGISTER USER
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. check missing fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 3. create user (password will be hashed by schema middleware)
    const user = await User.create({
      name,
      email,
      password,
    });

    // 4. send response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/*LOGIN USER*/
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 3. check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 4. success response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};
