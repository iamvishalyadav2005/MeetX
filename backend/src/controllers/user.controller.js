import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Meeting } from "../models/meeting.model.js";

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide username and password" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid username or password" });
    }

    // ✅ Use JWT instead of crypto
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.token = token;
    await user.save();

    return res.status(httpStatus.OK).json({
      token,
      username: user.username,
      name: user.name
    });

  } catch (e) {
    return res.status(500).json({ message: `Something went wrong: ${e}` });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(httpStatus.FOUND).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, password: hashedPassword });
    await newUser.save();

    return res.status(httpStatus.CREATED).json({ message: "User registered successfully" });

  } catch (e) {
    return res.status(500).json({ message: `Something went wrong: ${e}` });
  }
};

const getUserHistory = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const meetings = await Meeting.find({ user_id: user.username });
    return res.json(meetings);

  } catch (e) {
    return res.status(500).json({ message: `Something went wrong: ${e}` });
  }
};

const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code
    });
    await newMeeting.save();

    return res.status(httpStatus.CREATED).json({ message: "Added to history" });

  } catch (e) {
    return res.status(500).json({ message: `Something went wrong: ${e}` });
  }
};

export { login, register, getUserHistory, addToHistory };