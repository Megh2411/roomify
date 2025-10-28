import Room from '../models/roomModel.js';

// @desc    Update a room's status
// @route   PUT /api/housekeeping/rooms/:id/status
// @access  Private/Housekeeping or Admin
const updateRoomStatus = async (req, res) => {
  const { status } = req.body;
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  // Validate status
  if (!['Available', 'Occupied', 'Maintenance'].includes(status)) {
    return res.status(400).json({ message: 'Invalid room status' });
  }

  room.status = status;
  const updatedRoom = await room.save();
  res.json(updatedRoom);
};

export { updateRoomStatus };