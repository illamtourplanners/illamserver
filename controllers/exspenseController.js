import expenseSchema from "../model/expenseSchema.js";
import { Package } from "../model/packageSchema.js";



export const createExpense = async (req, res) => {
  try {
    const { packageId, category, categoryname, rupee, quantity, paymentMethode, date } = req.body;

    console.log(req.body);
    
    if (!packageId || !category || !categoryname || !rupee || !quantity || !paymentMethode) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Validate package exists
    const packageExists = await Package.findById(packageId);
    if (!packageExists) {
      return res.status(404).json({ success: false, message: "Package not found." });
    }

    const finalDate = date || new Date().toISOString().split('T')[0];

    const newExpense = new expenseSchema({
      packageId,
      category,
      categoryname,
      rupee,
      quantity,
      paymentMethode,
      date: finalDate,
    });

    await newExpense.save();

    res.status(201).json({
      success: true,
      message: "Expense linked to package created successfully",
      data: newExpense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};



export const getExpenseById = async (req, res) => {
  try {
    const expense = await expenseSchema.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// UPDATE Expense by ID
export const updateExpenseById = async (req, res) => {
  try {
    const updatedExpense = await expenseSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, message: "Expense updated", data: updatedExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// DELETE Expense by ID
export const deleteExpenseById = async (req, res) => {
  try {
    const deletedExpense = await expenseSchema.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};



// GET All Expenses
export const getAllExpenses = async (req, res) => {
  try {
    const { packageId } = req.params;

    const expenses = await expenseSchema.find({ packageId });

    res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    console.error("Error fetching expenses by packageId:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};