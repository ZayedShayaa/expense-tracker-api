const { verifyToken } = require("../config/auth");

module.exports = {
  // Middleware to authenticate requests using JWT token
  authenticate: (req, res, next) => {
    // Get the Authorization header from the request
    const authHeader = req.header("Authorization");

    // If no token or token doesn't start with "Bearer ", respond with 401 Unauthorized
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required. Please provide a token.",
      });
    }

    // Extract the token from the header (after "Bearer ")
    const token = authHeader.split(" ")[1];

    try {
      // Verify the JWT token and decode its payload
      const decoded = verifyToken(token);
      // Attach the decoded user info to the request object for downstream use
      req.user = decoded;
      // Proceed to next middleware or route handler
      next();
    } catch (err) {
      // If token verification fails, respond with 401 Unauthorized
      res.status(401).json({
        error: "Invalid or expired token.",
      });
    }
  },

  // Middleware to authorize user roles for protected routes
  authorize: (roles = []) => {
    return (req, res, next) => {
      // Check if the user's role (from req.user) is included in the allowed roles
      if (!roles.includes(req.user.role)) {
        // If role is not authorized, respond with 403 Forbidden
        return res.status(403).json({
          error: "You are not authorized to access this resource.",
        });
      }
      // Role is authorized, proceed
      next();
    };
  },
};
