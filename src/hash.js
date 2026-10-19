const bcrypt = require('bcryptjs');

module.exports = {
  hash: (password) => bcrypt.hash(password, 10),
  verify: (hash, password) => bcrypt.compare(password, hash),
};
