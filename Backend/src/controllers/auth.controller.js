import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import EmailVerification from "../models/EmailVerification.model.js";
import { generateCode } from "../utils/generatedCode.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
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

    // 3. create user 
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
export const sendCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }
/*

*/ 
    // 1. Check if user already exists
  

    // 2. Check existing verification record
    let record = await EmailVerification.findOne({ email });

    const now = Date.now();

    // 3. Enforce 60s resend cooldown
    if (record && record.lastSentAt && now - record.lastSentAt < 60000) {
      return res.status(400).json({
        message: "Please wait before requesting another code",
      });
    }

    // 4. Generate code
    const code = generateCode();

    const expiresAt = new Date(now + 5 * 60 * 1000); // 5 minutes

    if (record) {
      // update existing
      record.code = code;
      record.expiresAt = expiresAt;
      record.verified = false;
      record.lastSentAt = now;
      await record.save();
    } else {
      // create new
      await EmailVerification.create({
        email,
        code,
        expiresAt,
        lastSentAt: now,
      });
    }

    // 5. Send email
    await sendVerificationEmail(email, code);

    res.json({
      message: "Verification code sent",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and code are required",
      });
    }

    // 1. Find record
    const record = await EmailVerification.findOne({ email });

    if (!record) {
      return res.status(400).json({
        message: "No verification request found",
      });
    }

    // 2. Check expiry
    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Code expired",
      });
    }

    // 3. Check code
    if (record.code !== code) {
      return res.status(400).json({
        message: "Invalid code",
      });
    }

    // 4. Mark as verified
    record.verified = true;
    await record.save();

    res.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};