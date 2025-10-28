import Invoice from '../models/invoiceModel.js';
import Booking from '../models/bookingModel.js';
import Payment from '../models/paymentModel.js';

// @desc    Generate invoice for a booking
// @route   POST /api/invoices
// @access  Private/Receptionist or Admin
const generateInvoice = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if invoice already exists
  const existingInvoice = await Invoice.findOne({ booking: bookingId });
  if (existingInvoice) {
    return res
      .status(400)
      .json({ message: 'Invoice already exists for this booking' });
  }

  const invoice = await Invoice.create({
    booking: bookingId,
    user: booking.user,
    amount: booking.totalPrice, // Use the price calculated at booking time
    status: 'Pending',
  });

  res.status(201).json(invoice);
};

// @desc    Record a payment for an invoice
// @route   POST /api/invoices/:id/pay
// @access  Private/Receptionist
const recordPayment = async (req, res) => {
  const { amount, method } = req.body;
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  if (invoice.status === 'Paid') {
    return res.status(400).json({ message: 'Invoice is already paid' });
  }

  // Create the payment record
  const payment = await Payment.create({
    invoice: invoice._id,
    amount: amount,
    method: method,
    status: 'Completed', // We assume payment is successful
  });

  // Update invoice
  invoice.payment = payment._id;
  invoice.status = 'Paid';
  await invoice.save();

  res.json({ message: 'Payment recorded successfully', invoice, payment });
};

// @desc    Get an invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('user', 'name email')
    .populate('booking', 'checkInDate checkOutDate status')
    .populate('payment');

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  // Security check: Only user who owns it or staff can see it
  if (
    invoice.user._id.toString() !== req.user._id.toString() &&
    req.user.role === 'Guest'
  ) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  res.json(invoice);
};

export { generateInvoice, recordPayment, getInvoiceById };