import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import EmailVerification from "../models/EmailVerification.model.js";
import { generateCode } from "../utils/generateCode.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

/* 
   LOGIN USER
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/* 
   SEND VERIFICATION CODE
 */
export const sendCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // 1. Prevent existing users from re-registering
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered. Please login instead.",
      });
    }

    let record = await EmailVerification.findOne({ email });
    const now = Date.now();

    // 2. Resend cooldown (60s)
    if (record && record.lastSentAt && now - record.lastSentAt < 60000) {
      return res.status(400).json({
        message: "Please wait before requesting another code",
      });
    }

    // 3. Generate & hash code
    const code = generateCode();
    const hashedCode = await bcrypt.hash(code, 10);

    const expiresAt = new Date(now + 5 * 60 * 1000); // 5 min

    if (record) {
      record.code = hashedCode;
      record.expiresAt = expiresAt;
      record.verified = false;
      record.lastSentAt = now;
      await record.save();
    } else {
      await EmailVerification.create({
        email,
        code: hashedCode,
        expiresAt,
        lastSentAt: now,
      });
    }

    // 4. Send email (plain code)
    await sendVerificationEmail(email, code);

    res.json({
      message: "Verification code sent",
    });
  } catch (error) {
    next(error);
  }
};

/* 
   VERIFY CODE
 */
export const verifyCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and code are required",
      });
    }

    const record = await EmailVerification.findOne({ email });

    if (!record) {
      return res.status(400).json({
        message: "No verification request found",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Code expired",
      });
    }

    // compare hashed code
    const isMatch = await bcrypt.compare(code, record.code);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid code",
      });
    }

    record.verified = true;
    await record.save();

    res.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* 
   COMPLETE REGISTRATION
 */
export const completeRegister = async (req, res, next) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const record = await EmailVerification.findOne({ email });

    if (!record || !record.verified) {
      return res.status(400).json({
        message: "Email not verified",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Check username uniqueness
    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(400).json({
        message: "Username is already taken",
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Cleanup verification record
    await EmailVerification.deleteOne({ email });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};