const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  sign: (payload) => jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  }),
  verify: (token) => jwt.verify(token, process.env.JWT_SECRET),
};
