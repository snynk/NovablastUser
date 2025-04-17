const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, passcode } = req.body;

    // Validate request
    if (!email || !passcode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and passcode'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if passcode matches
    const isMatch = await user.comparePassword(passcode);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (user.status !== 'Active') {
      return res.status(401).json({
        success: false,
        message: 'Your account is inactive. Please contact administrator.'
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    // Update remember token
    user.remember_token = token;
    await user.save();

    // Return user and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        // profile_image: user.profile_image,
        // assign_number: user.assign_number,
        // upload_permission: user.upload_permission
      },
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
