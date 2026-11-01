import Expense from '../models/Expense.js';

// Get all expenses with optional filters
export const getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category, paymentMethod, search, limit = 100 } = req.query;
    const filter = {};

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (paymentMethod && paymentMethod !== 'All') {
      filter.paymentMethod = paymentMethod;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { recipient: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .limit(Number(limit));

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      success: true,
      count: expenses.length,
      totalAmount,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new expense
export const createExpense = async (req, res) => {
  try {
    const { title, category, amount, paymentMethod, recipient, receiptNumber, notes, date } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid expense amount is required' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Expense title/description is required' });
    }

    const expense = new Expense({
      title: title.trim(),
      category: category || 'Stock',
      amount: Number(amount),
      paymentMethod: paymentMethod || 'UPI',
      recipient: recipient ? recipient.trim() : '',
      notes: notes ? notes.trim() : '',
      date: date ? new Date(date) : new Date(),
      ...(receiptNumber ? { receiptNumber } : {})
    });

    const savedExpense = await expense.save();
    res.status(201).json({ success: true, data: savedExpense });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update an expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
