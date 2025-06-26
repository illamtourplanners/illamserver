import mongoose from 'mongoose';


const packageSchema = new mongoose.Schema({
  PackageName: {
    type: String,
    required: [true, 'Package Name is required'],
    trim: true,
  },
  PricePerPerson: {
    type: Number,
    required: [true, 'Price per person is required'],
    min: [1, 'Price per person must be at least 1'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  day: {
    type: Number,
    required: [true, 'Day count is required'],
    min: [1, 'Minimum 1 day required'],
  },
  night: {
    type: Number,
    required: [true, 'Night count is required'],
    min: [0, 'Nights cannot be negative'],
  },
  includes: {
    type: [String],
    required: [true, 'Includes list is required'],
  },
  pickupPoints: {
    type: [String],
    required: [true, 'Pickup point is required'],
    trim: true,
  },
  advancePrice: { type: Number, required: true,default: 0 },
  image:{
    type:String,
    required:[true,'Image is required'],
  },
  dropoff: {
    type: String,
    required: [true, 'Dropoff point is required'],
    trim: true,
  },
  pkgNumber: {
  type: String,
  required: true,
  unique: true
},

  description:{
    type:String,
    required:[true,'Description is required'],

  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
  },
}, { timestamps: true });


export const Package=mongoose.model("Package",packageSchema);
