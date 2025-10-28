import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Single', 'Double', 'Suite', 'Deluxe'] // You can expand this
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Occupied', 'Maintenance'],
    default: 'Available',
  },
  pricePerNight: { type: Number, required: true },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;