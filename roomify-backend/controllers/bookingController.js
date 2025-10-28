import Booking from '../models/bookingModel.js';
import Room from '../models/roomModel.js';
import Service from '../models/serviceModel.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (any logged-in user)
const createBooking = async (req, res) => {
  const { roomIds, checkInDate, checkOutDate, serviceIds } = req.body;
  const userId = req.user._id;

  if (!roomIds || roomIds.length === 0) {
    return res.status(400).json({ message: 'No room IDs provided' });
  }

  const requestedCheckIn = new Date(checkInDate);
  const requestedCheckOut = new Date(checkOutDate);

  if (requestedCheckIn >= requestedCheckOut) {
    return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
  }

  // --- Availability Check ---
  for (const roomId of roomIds) {
    const existingBookings = await Booking.find({
      rooms: { $in: [roomId] },
      status: { $in: ['Confirmed', 'Active'] },
      $or: [
        { checkInDate: { $lt: requestedCheckOut, $gte: requestedCheckIn } },
        { checkOutDate: { $gt: requestedCheckIn, $lte: requestedCheckOut } },
        { checkInDate: { $lte: requestedCheckIn }, checkOutDate: { $gte: requestedCheckOut } }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        message: `Room ${roomId} is not available for the selected dates.`,
      });
    }
  }

  // --- Price Calculation ---
  let numNights = Math.ceil(
    (requestedCheckOut - requestedCheckIn) / (1000 * 60 * 60 * 24)
  );
  if (numNights <= 0) numNights = 1;

  let totalRoomPrice = 0;
  try {
    const rooms = await Room.find({ _id: { $in: roomIds } });
    if (rooms.length !== roomIds.length) {
      return res.status(404).json({ message: 'One or more rooms not found.' });
    }
    rooms.forEach(room => { totalRoomPrice += room.pricePerNight; });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching room details.' });
  }

  let totalServicePrice = 0;
  if (serviceIds && serviceIds.length > 0) {
     try {
       const services = await Service.find({ _id: { $in: serviceIds } });
        if (services.length !== serviceIds.length) {
          return res.status(404).json({ message: 'One or more services not found.' });
        }
       services.forEach(service => { totalServicePrice += service.price; });
     } catch (err) {
       return res.status(500).json({ message: 'Error fetching service details.' });
     }
  }

  const totalPrice = totalRoomPrice * numNights + totalServicePrice;

  // --- Create Booking ---
  try {
    const booking = await Booking.create({
      user: userId,
      rooms: roomIds,
      services: serviceIds || [],
      checkInDate: requestedCheckIn,
      checkOutDate: requestedCheckOut,
      totalPrice: totalPrice,
      status: 'Confirmed',
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create booking.', error: err.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('user', 'name email')
      .populate('rooms', 'roomNumber type')
      .populate('services', 'description price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
     res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'Confirmed') {
        return res.status(400).json({ message: `Cannot cancel booking with status: ${booking.status}` });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      !['Admin', 'Receptionist'].includes(req.user.role)
    ) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'Cancelled';
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch(error) {
     res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('rooms', 'roomNumber type')
      .populate('services', 'description price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- ADDED FUNCTION ---
// @desc    Get booking by ID (Staff use)
// @route   GET /api/bookings/:id
// @access  Private/Staff (Added for Reception Desk)
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('rooms', 'roomNumber type'); // Added room population

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Authorization check (staff or owner)
    if (booking.user._id.toString() !== req.user._id.toString() && !['Admin', 'Receptionist'].includes(req.user.role)) {
       return res.status(401).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    // Handle invalid ObjectId errors
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Booking not found (Invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
// --- END ADDED FUNCTION ---

// --- FINAL EXPORT LIST ---
export { createBooking, getMyBookings, cancelBooking, getAllBookings, getBookingById };