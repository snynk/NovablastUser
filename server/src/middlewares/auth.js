const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Find user with that id and token
    const user = await User.findOne({ 
      _id: decoded.id,
      remember_token: token,
      status: 'active'
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid or user is inactive' 
      });
    }

    // Add user to request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

module.exports = auth;