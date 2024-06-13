const User = require("../../models/user");
const jwt = require("jsonwebtoken");

// helper
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const registerUser = async (fullName, email, password) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError("User Exists", 401);
    }
    const user = new User({ fullName, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, "jwtSecret", {
      expiresIn: "1m",
    });
    const updated = await User.findOneAndUpdate(
      { email },
      { $set: { token: token } }
    );
    if (!updated) {
      throw new CustomError("Registration Failed", 500);
    }

    return {
      name: user.fullName,
      email: user.email,
      id: user._id.toString(),
      token: token,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      throw new CustomError("Invalid Email or Password", 401);
    }
    const token = jwt.sign({ id: user._id, email: user.email }, "jwtSecret", {
      expiresIn: "1m",
    });
    const updated = await User.findOneAndUpdate(
      { email },
      { $set: { token: token } }
    );
    if (!updated) {
      throw new CustomError("Login Failed", 500);
    }

    return {
      name: user.fullName,
      email: user.email,
      id: user._id.toString(),
      token: token,
    };
  } catch (error) {
    throw new CustomError("Invalid Email or Password", 400);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
