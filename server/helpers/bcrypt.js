const { hashSync, compareSync } = require("bcryptjs");

module.exports = {
  hashPassword: (pwd) => hashSync(pwd, 10),
  comparePassword: (pwd, hash) => compareSync(pwd, hash),
};
