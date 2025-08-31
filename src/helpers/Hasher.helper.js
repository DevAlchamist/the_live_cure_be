const bcrypt = require("bcrypt");

class Hasher {
  getSalt = (SALT_WORK_FACTOR) => {
    return bcrypt.genSaltSync(SALT_WORK_FACTOR);
  };
  hash = (password, SALT) => {
    return bcrypt.hashSync(password, SALT);
  };
  compare = (newPass, currentPass) => {
    return bcrypt.compareSync(newPass, currentPass);
  };
}

module.exports = new Hasher();
