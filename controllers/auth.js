const userModel = require("./../models/user");
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
};

exports.login = async (req, res) => {};

exports.getMe = async (req, res) => {};
