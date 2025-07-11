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
  status: {
    type: String,
     enum: ['Pending', 'Boarded', 'Missed','Confirmed'],
    default: 'Pending', // ✅ now each customer has a status
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
  totalPerPerson:Number,
  name: String,
  advancePayment:Number,
  bookingNumber: String,
  transactionId: String,
   status: {
    type: String,
    enum: ['Pending', 'Boarded', 'Missed','Confirmed'],
    default: 'Pending',
  },
   image:{
    type:String,
  
  },
  
},
 { timestamps: true });

export const Customer = mongoose.model("Customer", packageSchema);
