import express from "express"
import { createExpense, deleteExpenseById, getAllExpenses, getExpenseById, updateExpenseById } from "../controllers/exspenseController.js";

const router = express.Router();

router.post("/create",createExpense);

router.get('/ExpenseById/:id', getExpenseById);            // Get by ID
router.put('/update/:id', updateExpenseById);         // Update by ID
router.delete('/delete/:id', deleteExpenseById);      // Delete by ID

router.get('/getAll', getAllExpenses);   
export  default router
