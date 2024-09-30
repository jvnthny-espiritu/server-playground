const request = require('supertest');
const app = require('../server');
const Room = require('../models/Room');
const Building = require('../models/Building');
const Campus = require('../models/Campus');

let createdRoom;
let createdBuilding;
let createdCampus;

beforeAll(async () => {
    // Create a campus and building to associate with rooms
    createdCampus = await Campus.create({ name: 'Test Campus' });
    createdBuilding = await Building.create({
        name: 'Test Building',
        campus: createdCampus._id,
        numberOfFloors: 5,
        yearBuilt: 2000,
        facilities: ['Library', 'Laboratory']
    });
});

afterAll(async () => {
    // Clean up the database
    await Room.deleteMany({});
    await Building.deleteMany({});
    await Campus.deleteMany({});
});

describe('Room API', () => {
    it('should create a new room', async () => {
        const reqPayload = {
            building: createdBuilding._id,
            name: 'Test Room',
            floor: 1,
            purpose: 'Lecture Hall',
            status: 'Available'
        };
        const res = await request(app)
            .post('/api/rooms')
            .send(reqPayload);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Test Room');
        expect(res.body.floor).toBe(1);
        expect(res.body.purpose).toBe('Lecture Hall');
        expect(res.body.status).toBe('Available');
        createdRoom = res.body;
    });

    it('should get all rooms', async () => {
        if (!createdRoom) {
            createdRoom = await Room.create({
                building: createdBuilding._id,
                name: 'Test Room',
                floor: 1,
                purpose: 'Lecture Hall',
                status: 'Available'
            });
        }
        const res = await request(app).get('/api/rooms?building=' + createdBuilding._id);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: 1,
                rooms: expect.arrayContaining([
                    expect.objectContaining({
                        name: createdRoom.name,
                        purpose: createdRoom.purpose,
                        status: createdRoom.status
                    })
                ])
            })
        ]));
    });

    it('should get a room by ID', async () => {
        if (!createdRoom) {
            createdRoom = await Room.create({
                building: createdBuilding._id,
                name: 'Test Room',
                floor: 1,
                purpose: 'Lecture Hall',
                status: 'Available'
            });
        }
        const res = await request(app).get(`/api/rooms/${createdRoom._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe(createdRoom.name);
        expect(res.body.floor).toBe(createdRoom.floor);
        expect(res.body.purpose).toBe(createdRoom.purpose);
        expect(res.body.status).toBe(createdRoom.status);
    });

    it('should update a room by ID', async () => {
        if (!createdRoom) {
            createdRoom = await Room.create({
                building: createdBuilding._id,
                name: 'Test Room',
                floor: 1,
                purpose: 'Lecture Hall',
                status: 'Available'
            });
        }
        const reqPayload = {
            name: 'Updated Room',
            floor: 2,
            purpose: 'Laboratory',
            status: 'Occupied'
        };
        const res = await request(app)
            .put(`/api/rooms/${createdRoom._id}`)
            .send(reqPayload);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('Updated Room');
        expect(res.body.floor).toBe(2);
        expect(res.body.purpose).toBe('Laboratory');
        expect(res.body.status).toBe('Occupied');
        createdRoom = res.body;
    });

    it('should delete a room by ID', async () => {
        if (!createdRoom) {
            createdRoom = await Room.create({
                building: createdBuilding._id,
                name: 'Test Room',
                floor: 1,
                purpose: 'Lecture Hall',
                status: 'Available'
            });
        }
        const res = await request(app).delete(`/api/rooms/${createdRoom._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Room deleted successfully');
        createdRoom = null;
    });

    it('should filter rooms by building and purpose', async () => {
        if (!createdRoom) {
            createdRoom = await Room.create({
                building: createdBuilding._id,
                name: 'Test Room',
                floor: 1,
                purpose: 'Lecture Hall',
                status: 'Available'
            });
        }
        const res = await request(app).get(`/api/rooms?building=${createdBuilding._id}&purpose=Lecture Hall`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: 1,
                rooms: expect.arrayContaining([
                    expect.objectContaining({
                        name: createdRoom.name,
                        purpose: createdRoom.purpose,
                        status: createdRoom.status
                    })
                ])
            })
        ]));
    });
});