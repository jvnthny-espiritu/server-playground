const Building = require('../models/Building');
const Room = require('../models/Room');

const updateBuildingFacilities = async (buildingId) => {
    try {
        const rooms = await Room.find({ building: buildingId });
        const facilities = [...new Set(rooms.map(room => room.purpose))];
        await Building.findByIdAndUpdate(buildingId, { facilities });
    } catch (error) {
        console.error('Error updating building facilities:', error);
    }
};

module.exports = updateBuildingFacilities;