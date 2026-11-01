import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Expense description/title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Expense category is required'],
    enum: [
      'Stock',
      'Shop Rent',
      'Electricity Bills',
      'Staff Salaries',
      'Supplies',
      'Maintenance',
      'Marketing',
      'Other'
    ],
    default: 'Stock'
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Expense amount cannot be negative']
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Other'],
    default: 'UPI'
  },
  recipient: {
    type: String,
    trim: true,
    default: ''
  },
  receiptNumber: {
    type: String,
    trim: true,
    default: () => 'EXP-' + Math.floor(100000 + Math.random() * 900000)
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
