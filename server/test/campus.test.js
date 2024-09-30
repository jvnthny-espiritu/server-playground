const request = require('supertest');
const app = require('../server');
const Campus = require('../models/Campus');

let createdCampus;

describe('Campus API', () => {
	it('should create a new campus', async () => {
		const reqPayload = { name: 'Test Campus' };
		const res = await request(app)
			.post('/api/campuses')
			.send(reqPayload);
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('_id');
		expect(res.body.name).toBe('Test Campus');
		createdCampus = res.body;
	});

	it('should get all campuses', async () => {
		if (!createdCampus) {
			createdCampus = await Campus.create({ name: 'Test Campus' });
		}
		const res = await request(app).get('/api/campuses');
		expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty(createdCampus._id);
        expect(res.body[createdCampus._id]).toBe(createdCampus.name);
	});

	it('should get a campus by ID', async () => {
		if (!createdCampus) {
			createdCampus = await Campus.create({ name: 'Test Campus' });
		}
		const res = await request(app).get(`/api/campuses/${createdCampus._id}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.name).toBe(createdCampus.name);
	});

	it('should update a campus by ID', async () => {
		if (!createdCampus) {
			createdCampus = await Campus.create({ name: 'Test Campus' });
		}
		const reqPayload = { name: 'Updated Campus' };
		const res = await request(app)
			.put(`/api/campuses/${createdCampus._id}`)
			.send(reqPayload);
		expect(res.statusCode).toEqual(200);
		expect(res.body.name).toBe('Updated Campus');
		createdCampus = res.body;
	});

	it('should delete a campus by ID', async () => {
		if (!createdCampus) {
			createdCampus = await Campus.create({ name: 'Test Campus' });
		}
		const res = await request(app).delete(`/api/campuses/${createdCampus._id}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toBe('Campus deleted successfully');
		createdCampus = null;
	});
});