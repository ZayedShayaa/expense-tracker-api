const User = require("../models/user");
// Import authentication helper functions from config/auth
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../config/auth");

class AuthService {
  // Register a new user
  async register(userData) {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      // Throw error if email is already used
      throw new Error('Email is already in use');
    }

    // Hash the user's password before saving
    const hashedPassword = await hashPassword(userData.password);
    // Create the new user record in the database
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password_hash: hashedPassword,
    });
      // Return user data along with a generated JWT token
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken({ id: user.id, role: "user" }),
    };
  }

  // Log in an existing user
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Throw error if user not found
      throw new Error('Invalid credentials');
    }
     // Compare provided password with stored hashed password
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch)     throw new Error("Invalid credentials");
    
    // Return user data along with a generated JWT token
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken({ id: user.id, role: "user" }),
    };
  }
}

// Export an instance of AuthService class
module.exports = new AuthService();
