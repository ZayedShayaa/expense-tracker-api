require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET ;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN ;
const saltRounds = parseInt(process.env.SALT_ROUNDS) ;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

module.exports = {
  jwtSecret,
  jwtExpiresIn,
  saltRounds,

  hashPassword: async (password) => {
    return await bcrypt.hash(password, saltRounds);
  },

  comparePassword: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },

  generateToken: (payload) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
  },

  verifyToken: (token) => {
    return jwt.verify(token, jwtSecret);
  },
};
