import mongoose from 'mongoose';

const invoiceSchema = mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Booking',
      unique: true, // One invoice per booking
    },
    user: {
      // User who the invoice is for
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Paid', 'Cancelled'],
      default: 'Pending',
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    payment: {
      // Links to the single payment that settles this
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;