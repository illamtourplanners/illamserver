import expenseSchema from "../model/expenseSchema.js";



export const createExpense = async (req, res) => {
  try {
    const { category, categoryname, rupee, quantity, paymentMethode, date } = req.body;

    if (!category || !categoryname || !rupee || !quantity || !paymentMethode) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const finalDate = date || new Date().toISOString().split('T')[0];

    const newExpense = new expenseSchema({
      category,
      categoryname,
      rupee,
      quantity,
      paymentMethode,
      date: finalDate,
    });

    await newExpense.save();

    res.status(201).json({ success: true, message: "Expense created successfully", data: newExpense });
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
    const expenses = await expenseSchema.find();
    res.status(200).json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};