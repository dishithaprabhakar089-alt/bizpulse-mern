import Sale from '../models/Sale.js';

// Get all sales with optional filters
export const getSales = async (req, res) => {
  try {
    const { startDate, endDate, paymentMethod, upiApp, search, limit = 100 } = req.query;
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

    if (paymentMethod && paymentMethod !== 'All') {
      filter.paymentMethod = paymentMethod;
    }

    if (upiApp && upiApp !== 'All') {
      filter.upiApp = upiApp;
    }

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const sales = await Sale.find(filter)
      .sort({ date: -1 })
      .limit(Number(limit));

    const totalAmount = sales.reduce((sum, s) => sum + s.amount, 0);

    res.json({
      success: true,
      count: sales.length,
      totalAmount,
      data: sales
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new sale
export const createSale = async (req, res) => {
  try {
    const { amount, paymentMethod, upiApp, customerName, customerPhone, items, notes, date, invoiceNumber } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid sale amount is required' });
    }

    const sale = new Sale({
      amount: Number(amount),
      paymentMethod: paymentMethod || 'Cash',
      upiApp: paymentMethod === 'UPI' ? (upiApp || 'GPay') : 'N/A',
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      items: items || [],
      notes: notes || '',
      date: date ? new Date(date) : new Date(),
      ...(invoiceNumber ? { invoiceNumber } : {})
    });

    const savedSale = await sale.save();
    res.status(201).json({ success: true, data: savedSale });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update a sale
export const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a sale
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.json({ success: true, message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
