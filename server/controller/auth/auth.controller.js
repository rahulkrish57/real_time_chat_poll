const authService = require("../../service/auth/auth.service");

const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const user = await authService.registerUser(fullName, email, password);
    return res
      .status(201)
      .json({ message: "User registered successfully", info: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    return res
      .status(200)
      .json({ message: "User logged in successfully", info: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
