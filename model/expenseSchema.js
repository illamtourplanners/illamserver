import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({

    categoryname: { type: String, required: true },
  category: { type: String, required: true },
  rupee: { type: Number, required: true },
  quantity: { type: Number},
  paymentMethode : {   type: String,required: true },
   date: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
