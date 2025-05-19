require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

// Init express
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/suny2';

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes - declared only once ✅
const assignNumberRoutes = require('./routes/assignNumberRoutes');
const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const contactRoutes = require('./routes/contactRoutes');
const groupedContactRoutes = require('./routes/groupedContactRoutes');
const subUserRoutes = require('./routes/subUserRoutes');
const dripAutomationRoutes = require('./routes/dripAutomationRoutes');
const batchRoutes = require('./routes/batchRoutes');
const profileRouter = require('./routes/ProfileRoutes');
const loginActivityRouter = require('./routes/LoginActivityRoutes');
const templateRoutes = require('./routes/templateRoutes');
const marketRoutes = require('./routes/marketRoutes');
const blockedRoutes = require('./routes/blockedRoutes');
const tagRoutes = require('./routes/tagRoutes');
const twilioRoutes = require("./routes/twilioRoutes");

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignnumbers', assignNumberRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/groupedContacts', groupedContactRoutes);
app.use('/api/subusers', subUserRoutes);
app.use('/api/drip-automations', dripAutomationRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/customers', profileRouter);
app.use('/api/login-activity', loginActivityRouter);
app.use('/api/templates', templateRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/blocked', blockedRoutes);
app.use("/api/messages", twilioRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to the NovaBlast');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
