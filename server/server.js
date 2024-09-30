require('dotenv').config();
require('./config/db-connection');
const express = require('express');
const bodyParser = require('body-parser');
const cors =require('cors');
const session = require('express-session');
const passport = require('./config/passport-config');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Admin User by default
require('./config/initAdmin');

// Routes
const userRoutes = require('./routes/user');
const campusRoutes = require('./routes/campus');
const buildingRoutes = require('./routes/building');
const roomRoutes = require('./routes/room');
const assetRoutes = require('./routes/asset');

app.use('/api/users', userRoutes);
app.use('/api/campuses', campusRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/assets', assetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;