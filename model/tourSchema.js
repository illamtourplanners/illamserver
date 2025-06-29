import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images:{
      type:[String],
      required:true
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

export const Tour = mongoose.model('Tour', tourSchema);


