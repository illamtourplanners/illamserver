import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
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
    video: {
      type: String, 
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

export const Video = mongoose.model('Video', videoSchema);


