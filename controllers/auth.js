const userModel = require("./../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerValidator = require("./../validators/register");

exports.register = async (req, res) => {
  const validationResult = registerValidator(req.body);
  if (validationResult != true) {
    return res.status(422).json(validationResult);
  }

  const { username, name, email, password, phone } = req.body;
  const isUserExists = userModel.findOne({ $or: [{ username }, { email }] });
  if (isUserExists) {
    res.status(409).json({ message: "This username or email already existed" });
  }

  const countOfUser = await userModel.count();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userModel.create({
    email,
    username,
    name,
    phone,
    password: hashedPassword,
    role: countOfUser > 0 ? "USER" : "ADMIN",
  });

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1days",
  });

  return res.status(201).json({ user, accessToken });
};

exports.login = async (req, res) => {};

exports.getMe = async (req, res) => {};
