const request = require('supertest');
const app = require('../server');
const Asset = require('../models/Asset');
const Room = require('../models/Room');
const Building = require('../models/Building');
const Campus = require('../models/Campus');

let createdAsset;
let createdRoom;
let createdBuilding;
let createdCampus;

beforeAll(async () => {
	// Create a campus, building, and room to associate with assets
	createdCampus = await Campus.create({ name: 'Test Campus' });
	createdBuilding = await Building.create({
		name: 'Test Building',
		campus: createdCampus._id,
		numberOfFloors: 5,
		yearBuilt: 2000,
		facilities: ['Library', 'Laboratory']
	});
	createdRoom = await Room.create({
		building: createdBuilding._id,
		name: 'Test Room',
		floor: 1,
		purpose: 'Lecture Hall',
		status: 'Available'
	});
});

afterAll(async () => {
	// Clean up the database
	await Asset.deleteMany({});
	await Room.deleteMany({});
	await Building.deleteMany({});
	await Campus.deleteMany({});
});

describe('Asset API', () => {
	it('should create a new asset', async () => {
		const reqPayload = {
			name: 'Test Asset',
			category: 'electric',
			condition: 'new',
			status: 'good condition',
			location: createdRoom._id,
			purchaseDate: '2023-01-01',
			value: 1000,
			numberOfUnits: 10,
			electricDetails: {
				voltage: 220,
				power: 100,
				manufacturer: 'Test Manufacturer',
				warranty: '2 years'
			}
		};
		const res = await request(app)
			.post('/api/assets')
			.send(reqPayload);
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('_id');
		expect(res.body.name).toBe('Test Asset');
		expect(res.body.category).toBe('electric');
		expect(res.body.condition).toBe('new');
		expect(res.body.status).toBe('good condition');
		expect(res.body.location).toBe(String(createdRoom._id));
		expect(res.body.value).toBe(1000);
		expect(res.body.numberOfUnits).toBe(10);
		expect(res.body.electricDetails.voltage).toBe(220);
		expect(res.body.electricDetails.power).toBe(100);
		expect(res.body.electricDetails.manufacturer).toBe('Test Manufacturer');
		expect(res.body.electricDetails.warranty).toBe('2 years');
		createdAsset = res.body;
	});

	it('should get all assets with filtering', async () => {
		if (!createdAsset) {
			createdAsset = await Asset.create({
				name: 'Test Asset',
				category: 'electric',
				condition: 'new',
				status: 'good condition',
				location: createdRoom._id,
				purchaseDate: '2023-01-01',
				value: 1000,
				numberOfUnits: 10,
				electricDetails: {
					voltage: 220,
					power: 100,
					manufacturer: 'Test Manufacturer',
					warranty: '2 years'
				}
			});
		}
		const res = await request(app).get(`/api/assets?room=${createdRoom._id}&category=electric&status=good condition&condition=new`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(expect.arrayContaining([
			expect.objectContaining({
				name: createdAsset.name,
				category: createdAsset.category,
				condition: createdAsset.condition,
				status: createdAsset.status,
				location: expect.objectContaining({ _id: String(createdRoom._id), name: createdRoom.name }),
				value: createdAsset.value,
				numberOfUnits: createdAsset.numberOfUnits,
				electricDetails: expect.objectContaining({
					voltage: createdAsset.electricDetails.voltage,
					power: createdAsset.electricDetails.power,
					manufacturer: createdAsset.electricDetails.manufacturer,
					warranty: createdAsset.electricDetails.warranty
				})
			})
		]));
	});

	it('should get an asset by ID', async () => {
		if (!createdAsset) {
			createdAsset = await Asset.create({
				name: 'Test Asset',
				category: 'electric',
				condition: 'new',
				status: 'good condition',
				location: createdRoom._id,
				purchaseDate: '2023-01-01',
				value: 1000,
				numberOfUnits: 10,
				electricDetails: {
					voltage: 220,
					power: 100,
					manufacturer: 'Test Manufacturer',
					warranty: '2 years'
				}
			});
		}
		const res = await request(app).get(`/api/assets/${createdAsset._id}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.name).toBe(createdAsset.name);
		expect(res.body.category).toBe(createdAsset.category);
		expect(res.body.condition).toBe(createdAsset.condition);
		expect(res.body.status).toBe(createdAsset.status);
		expect(res.body.location._id).toBe(String(createdRoom._id));
		expect(res.body.value).toBe(createdAsset.value);
		expect(res.body.numberOfUnits).toBe(createdAsset.numberOfUnits);
		expect(res.body.electricDetails.voltage).toBe(createdAsset.electricDetails.voltage);
		expect(res.body.electricDetails.power).toBe(createdAsset.electricDetails.power);
		expect(res.body.electricDetails.manufacturer).toBe(createdAsset.electricDetails.manufacturer);
		expect(res.body.electricDetails.warranty).toBe(createdAsset.electricDetails.warranty);
	});

	it('should update an asset by ID', async () => {
		if (!createdAsset) {
			createdAsset = await Asset.create({
				name: 'Test Asset',
				category: 'electric',
				condition: 'new',
				status: 'good condition',
				location: createdRoom._id,
				purchaseDate: '2023-01-01',
				value: 1000,
				numberOfUnits: 10,
				electricDetails: {
					voltage: 220,
					power: 100,
					manufacturer: 'Test Manufacturer',
					warranty: '2 years'
				}
			});
		}
		const reqPayload = {
			name: 'Updated Asset',
			category: 'non-electric',
			condition: 'good',
			status: 'under maintenance',
			location: createdRoom._id,
			purchaseDate: '2023-01-01',
			value: 2000,
			numberOfUnits: 5,
			nonElectricDetails: {
				material: 'Wood',
				dimensions: '10x10x10',
				weight: 50
			}
		};
		const res = await request(app)
			.put(`/api/assets/${createdAsset._id}`)
			.send(reqPayload);
		expect(res.statusCode).toEqual(200);
		expect(res.body.name).toBe('Updated Asset');
		expect(res.body.category).toBe('non-electric');
		expect(res.body.condition).toBe('good');
		expect(res.body.status).toBe('under maintenance');
		expect(res.body.location).toBe(String(createdRoom._id));
		expect(res.body.value).toBe(2000);
		expect(res.body.numberOfUnits).toBe(5);
		expect(res.body.nonElectricDetails.material).toBe('Wood');
		expect(res.body.nonElectricDetails.dimensions).toBe('10x10x10');
		expect(res.body.nonElectricDetails.weight).toBe(50);
		createdAsset = res.body;
	});

	it('should delete an asset by ID', async () => {
		if (!createdAsset) {
			createdAsset = await Asset.create({
				name: 'Test Asset',
				category: 'electric',
				condition: 'new',
				status: 'good condition',
				location: createdRoom._id,
				purchaseDate: '2023-01-01',
				value: 1000,
				numberOfUnits: 10,
				electricDetails: {
					voltage: 220,
					power: 100,
					manufacturer: 'Test Manufacturer',
					warranty: '2 years'
				}
			});
		}
		const res = await request(app).delete(`/api/assets/${createdAsset._id}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toBe('Asset deleted successfully');
		createdAsset = null;
	});
});