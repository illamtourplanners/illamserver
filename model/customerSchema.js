import mongoose from 'mongoose';

const customerInfoSchema = new mongoose.Schema({
  fullName: String,
  age: Number,
  phoneNumber: String,
  gender: String,
  email: String,
  bookingNumber:Number,
  pickupPoint:String,
   aadhaarNumber: {
    type: String,
    required: true,
    match: /^[2-9]{1}[0-9]{11}$/,
  },
});


const packageSchema = new mongoose.Schema({
  packageName: String,
  packageDate: Date,
  packageDetails: [ // Add this field
    {
      packageNumber:String,
      packageName: String,
      packageDate: String,
      packageDay: String,
      packageDestination: String,
      packageDescription: String,
      packagePerson: Number,
    }
  ],
  customers: [customerInfoSchema],
  amount: Number,
  name: String,
  advancePayment:Number,
  bookingNumber: String,
  transactionId: String,
   image:{
    type:String,
  
  },
});

export const Customer = mongoose.model("Customer", packageSchema);
