import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const saleSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
    default: () => 'INV-' + Math.floor(100000 + Math.random() * 900000)
  },
  customerName: {
    type: String,
    default: 'Walk-in Customer',
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true,
    default: ''
  },
  amount: {
    type: Number,
    required: [true, 'Sale amount is required'],
    min: [0, 'Sale amount cannot be negative']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['Cash', 'UPI', 'Card'],
    default: 'Cash'
  },
  upiApp: {
    type: String,
    enum: ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Other', 'N/A'],
    default: 'N/A'
  },
  items: [saleItemSchema],
  notes: {
    type: String,
    default: '',
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

saleSchema.index({ date: -1 });
saleSchema.index({ paymentMethod: 1 });

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
