import mongoose from 'mongoose';

const serviceSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['Food', 'Laundry', 'Transport', 'Other'], // From SRS 
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // Matches 'availability' in your class diagram [cite: 70]
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;