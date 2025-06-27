import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    categoryname: { type: String, required: true },
  category: { type: String, required: true },
  rupee: { type: Number, required: true },
  quantity: { type: Number},
  paymentMethod: {   type: String,required: true },
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
