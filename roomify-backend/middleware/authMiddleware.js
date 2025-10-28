import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware to check if user is logged in
const protect = async (req, res, next) => {
  let token;
  
  // Check for the "Bearer" token in the request headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token's ID and attach to request
      // We exclude the password
      req.user = await User.findById(decoded.id).select('-password');
      
      next(); // Move on to the next function (e.g., the controller)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is an Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next(); // User is an Admin, proceed
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' }); // 403 Forbidden
  }
};

export { protect, admin };