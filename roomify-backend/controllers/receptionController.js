import Booking from '../models/bookingModel.js';
import Room from '../models/roomModel.js';
import Invoice from '../models/invoiceModel.js';

// @desc    Check in a guest for a booking
// @route   POST /api/reception/checkin
// @access  Private/Staff (Receptionist or Admin)
const checkInGuest = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (booking.status !== 'Confirmed') {
    return res
      .status(400)
      .json({ message: `Booking is already ${booking.status}` });
  }

  // 1. Update Booking status to 'Active'
  booking.status = 'Active';
  await booking.save();

  // 2. Update all Rooms in the booking to 'Occupied'
  await Room.updateMany(
    { _id: { $in: booking.rooms } }, // Find all rooms in the booking.rooms array
    { $set: { status: 'Occupied' } }
  );

  res.json({ message: 'Guest checked in successfully', booking });
};

// @desc    Check out a guest from a booking
// @route   POST /api/reception/checkout
// @access  Private/Staff (Receptionist or Admin)
const checkOutGuest = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (booking.status !== 'Active') {
    return res
      .status(400)
      .json({ message: `Booking is not 'Active'. Cannot check out.` });
  }

  // Business Rule: Check if the invoice is paid before checkout
  const invoice = await Invoice.findOne({ booking: bookingId });
  if (!invoice || invoice.status !== 'Paid') {
    return res
      .status(400)
      .json({ message: 'Cannot check out: Invoice is not paid.' });
  }

  // 1. Update Booking status to 'Completed'
  booking.status = 'Completed';
  await booking.save();

  // 2. Update Rooms to 'Maintenance' (i.e., needs cleaning)
  await Room.updateMany(
    { _id: { $in: booking.rooms } },
    { $set: { status: 'Maintenance' } }
  );

  res.json({ message: 'Guest checked out successfully', booking });
};

export { checkInGuest, checkOutGuest };