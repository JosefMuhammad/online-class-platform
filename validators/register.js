const validator = require("fastest-validator");
const v = new validator();

const schema = {
  username: { type: "string", min: 3, max: 150 },
  name: { type: "string", min: 3, max: 150 },
  email: { type: "email", min: 10, max: 150 },
  phone: { type: "string" },
  password: { type: "string", min: 10, max: 30 },
  confirmPassword: { type: "equal", field: "password" },
  $$strinct: true,
};

const check = v.compile(schema);

module.exports = check;
