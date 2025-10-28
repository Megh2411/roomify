import Room from '../models/roomModel.js';

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  const { roomNumber, type, pricePerNight } = req.body;
  
  const room = new Room({
    roomNumber,
    type,
    pricePerNight,
    status: 'Available', // Default
  });

  const createdRoom = await room.save();
  res.status(201).json(createdRoom);
};

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private (all logged-in users)
const getRooms = async (req, res) => {
  const rooms = await Room.find({}); // Find all rooms
  res.json(rooms);
};

// You would also add updateRoom, deleteRoom, etc. here

export { createRoom, getRooms };