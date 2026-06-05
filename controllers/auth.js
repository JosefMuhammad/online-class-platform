const userModel = require("./../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerValidator = require("./../validators/register");
const banUserModel = require("./../models/ban-user");

exports.register = async (req, res) => {
  const validationResult = registerValidator(req.body);
  if (validationResult != true) {
    return res.status(422).json(validationResult);
  }

  const { username, name, email, password, phone } = req.body;
  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserExists) {
    res.status(409).json({ message: "This username or email already existed" });
  }

  const isUserBan = await banUserModel.find({ phone });

  if (isUserBan.length) {
    return res.status(409).json({
      message: "This phone is banned.You are not allowed to use this platform",
    });
  }

  const countOfUsers = await userModel.countDocuments();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userModel.create({
    email,
    username,
    name,
    phone,
    password: hashedPassword,
    role: countOfUsers > 0 ? "USER" : "ADMIN",
  });

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1days",
  });

  return res.status(201).json({ user, accessToken });
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  const user = await userModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid username or email!" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid Password!" });
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30 days",
  });
  return res.json({ accessToken });
};

exports.getMe = async (req, res) => {};
