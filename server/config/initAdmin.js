const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const initializeAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const admin = new User({
                username: 'admin',
                fullname: { firstName: 'Admin', lastName: 'User' },
                password: 'admin',
                role: 'admin',
                campus: '66f95b4aff19edac19c18ee6'
        });
        await admin.save();
        console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error initializing admin user:', error);
        process.exit(1);
    }
};

initializeAdmin();