require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const path = require("path"); // ✅ Import the path module


// Routes
const assignNumberRoutes = require('./routes/assignNumberRoutes');
const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const contactRoutes = require("./routes/contactRoutes");
const groupedContactRoutes = require("./routes/groupedContactRoutes");
const subUserRoutes = require("./routes/subUserRoutes");

// Init express
const app = express();
app.use(express.json());
app.use(fileUpload()); // ✅ Enables file uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ Serve static files

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/suny2';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignnumbers', assignNumberRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use("/api/contacts", contactRoutes); // Example endpoint: /contacts/import
app.use("/api/groupedContacts", groupedContactRoutes);
app.use("/api/subusers", subUserRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to the NovaBlast');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
