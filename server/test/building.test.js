const request = require('supertest');
const app = require('../server');
const Building = require('../models/Building');
const Campus = require('../models/Campus');

let createdBuilding;
let createdCampus;

beforeAll(async () => {
    // Clean up the database
    await Building.deleteMany({});
    await Campus.deleteMany({});
    
    // Create a campus to associate with buildings
    createdCampus = await Campus.create({ name: 'Test Campus' });
});

describe('Building API', () => {
    it('should create a new building', async () => {
        const reqPayload = {
            name: 'Test Building',
            campus: createdCampus._id,
            numberOfFloors: 5,
            yearBuilt: 2000,
            facilities: ['Library', 'Laboratory']
        };
        const res = await request(app)
            .post('/api/buildings')
            .send(reqPayload);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Test Building');
        expect(res.body.numberOfFloors).toBe(5);
        expect(res.body.yearBuilt).toBe(2000);
        expect(res.body.facilities).toEqual(expect.arrayContaining(['Library', 'Laboratory']));
        createdBuilding = res.body;
    });

    it('should get a building by ID', async () => {
        if (!createdBuilding) {
            createdBuilding = await Building.create({
                name: 'Test Building',
                campus: createdCampus._id,
                numberOfFloors: 5,
                yearBuilt: 2000,
                facilities: ['Library', 'Laboratory']
            });
        }
        const res = await request(app).get(`/api/buildings/${createdBuilding._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe(createdBuilding.name);
        expect(res.body.numberOfFloors).toBe(createdBuilding.numberOfFloors);
        expect(res.body.yearBuilt).toBe(createdBuilding.yearBuilt);
        expect(res.body.facilities).toEqual(expect.arrayContaining(['Library', 'Laboratory']));
    });

    it('should update a building by ID', async () => {
        if (!createdBuilding) {
            createdBuilding = await Building.create({
                name: 'Test Building',
                campus: createdCampus._id,
                numberOfFloors: 5,
                yearBuilt: 2000,
                facilities: ['Library', 'Laboratory']
            });
        }
        const reqPayload = {
            name: 'Updated Building',
            numberOfFloors: 6,
            yearBuilt: 2005,
            facilities: ['Library', 'Gym']
        };
        const res = await request(app)
            .put(`/api/buildings/${createdBuilding._id}`)
            .send(reqPayload);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('Updated Building');
        expect(res.body.numberOfFloors).toBe(6);
        expect(res.body.yearBuilt).toBe(2005);
        expect(res.body.facilities).toEqual(expect.arrayContaining(['Library', 'Gym']));
        createdBuilding = res.body;
    });

    it('should delete a building by ID', async () => {
        if (!createdBuilding) {
            createdBuilding = await Building.create({
                name: 'Test Building',
                campus: createdCampus._id,
                numberOfFloors: 5,
                yearBuilt: 2000,
                facilities: ['Library', 'Laboratory']
            });
        }
        const res = await request(app).delete(`/api/buildings/${createdBuilding._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Building deleted successfully');
        createdBuilding = null;

        // Delete the created campus
        const campusRes = await request(app).delete(`/api/campuses/${createdCampus._id}`);
        expect(campusRes.statusCode).toEqual(200);
        expect(campusRes.body.message).toBe('Campus deleted successfully');
        createdCampus = null;
    });
});