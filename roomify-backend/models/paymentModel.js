import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Invoice',
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: true,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI/Online'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Completed', 'Failed', 'Refunded'],
      default: 'Completed',
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;