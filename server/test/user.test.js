const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

let createdUser;
let adminToken;

beforeAll(async () => {
    // Initialize admin user
    require('../config/initAdmin');
});

describe('User API', () => {
    it('should login the admin user', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                username: 'admin',
                password: 'admin'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        adminToken = res.body.token;
    });

    it('should register a new user', async () => {
        const reqPayload = {
            username: 'testuser',
            fullname: { firstName: 'Test', lastName: 'User' },
            password: 'testuser',
            role: 'staff',
            campus: '66f95b4aff19edac19c18ee6'
        };
        const res = await request(app)
            .post('/api/users/register')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(reqPayload);
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe('User registered successfully');
        createdUser = await User.findOne({ username: 'testuser' }); // Store the created user
    });

    it('should login the user', async () => {
        if (!createdUser) {
            createdUser = await User.create({
                username: 'testuser',
                fullname: { firstName: 'Test', lastName: 'User' },
                password: 'testuser',
                role: 'staff',
                campus: '66f95b4aff19edac19c18ee6'
            });
        }
        const res = await request(app)
            .post('/api/users/login')
            .send({
                username: 'testuser',
                password: 'testuser'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should get the user by ID', async () => {
        if (!createdUser) {
            createdUser = await User.create({
                username: 'testuser',
                fullname: { firstName: 'Test', lastName: 'User' },
                password: 'testuser',
                role: 'staff',
                campus: '66f95b4aff19edac19c18ee6'
            });
        }
        const res = await request(app)
            .get(`/api/users/${createdUser._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.username).toBe(createdUser.username);
    });

    it('should update the user by ID', async () => {
        if (!createdUser) {
            createdUser = await User.create({
                username: 'testuser',
                fullname: { firstName: 'Test', lastName: 'User' },
                password: 'testuser',
                role: 'staff',
                campus: '66f95b4aff19edac19c18ee6'
            });
        }
        const reqPayload = { fullname: { firstName: 'Updated', lastName: 'User' } };
        const res = await request(app)
            .put(`/api/users/${createdUser._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(reqPayload);
        expect(res.statusCode).toEqual(200);
        expect(res.body.fullname.firstName).toBe('Updated');
        expect(res.body.fullname.lastName).toBe('User');
        createdUser = res.body; // Update the stored user
    });

    it('should delete the user by ID', async () => {
        if (!createdUser) {
            createdUser = await User.create({
                username: 'testuser',
                fullname: { firstName: 'Test', lastName: 'User' },
                password: 'testuser',
                role: 'staff',
                campus: '66f95b4aff19edac19c18ee6'
            });
        }
        const res = await request(app)
            .delete(`/api/users/${createdUser._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('User deleted successfully');
        createdUser = null; // Clear the stored user
    });
});