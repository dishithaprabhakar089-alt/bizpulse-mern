import Sale from '../models/Sale.js';
import Expense from '../models/Expense.js';

// Get comprehensive dashboard analytics
export const getDashboardSummary = async (req, res) => {
  try {
    const { timeRange = 'all' } = req.query;
    const dateFilter = {};

    const now = new Date();
    if (timeRange === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter.date = { $gte: startOfDay };
    } else if (timeRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      dateFilter.date = { $gte: weekAgo };
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      dateFilter.date = { $gte: monthAgo };
    } else if (timeRange === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      dateFilter.date = { $gte: yearAgo };
    }

    // Parallel fetch for Sales and Expenses
    const [sales, expenses] = await Promise.all([
      Sale.find(dateFilter).sort({ date: -1 }),
      Expense.find(dateFilter).sort({ date: -1 })
    ]);

    // Aggregate Sales (Money In)
    const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
    const salesCount = sales.length;

    // Sales by Payment Method
    const salesByMethod = {
      Cash: { amount: 0, count: 0 },
      UPI: { amount: 0, count: 0, gpay: 0, phonepe: 0, paytm: 0, other: 0 },
      Card: { amount: 0, count: 0 }
    };

    sales.forEach(sale => {
      const method = sale.paymentMethod || 'Cash';
      if (!salesByMethod[method]) {
        salesByMethod[method] = { amount: 0, count: 0 };
      }
      salesByMethod[method].amount += sale.amount;
      salesByMethod[method].count += 1;

      if (method === 'UPI') {
        const app = (sale.upiApp || '').toLowerCase();
        if (app.includes('gpay')) salesByMethod.UPI.gpay += sale.amount;
        else if (app.includes('phonepe')) salesByMethod.UPI.phonepe += sale.amount;
        else if (app.includes('paytm')) salesByMethod.UPI.paytm += sale.amount;
        else salesByMethod.UPI.other += sale.amount;
      }
    });

    // Aggregate Expenses (Money Out)
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const expensesCount = expenses.length;

    // Expenses by Category
    const expensesByCategory = {
      'Stock': 0,
      'Shop Rent': 0,
      'Electricity Bills': 0,
      'Staff Salaries': 0,
      'Supplies': 0,
      'Maintenance': 0,
      'Marketing': 0,
      'Other': 0
    };

    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + exp.amount;
    });

    // Net Profit / Loss Calculation
    const netProfitOrLoss = totalSales - totalExpenses;
    const isProfit = netProfitOrLoss > 0;
    const isLoss = netProfitOrLoss < 0;
    const isBreakEven = netProfitOrLoss === 0;

    const profitMargin = totalSales > 0 ? ((netProfitOrLoss / totalSales) * 100).toFixed(1) : 0;

    // Recent 15 Unified Transactions
    const mappedSales = sales.slice(0, 15).map(s => ({
      _id: s._id,
      type: 'SALE',
      title: s.items && s.items.length > 0 ? s.items.map(i => i.name).join(', ') : 'Sale Transaction',
      subtitle: s.customerName || 'Walk-in Customer',
      amount: s.amount,
      paymentMethod: s.paymentMethod,
      detailBadge: s.paymentMethod === 'UPI' ? s.upiApp : s.paymentMethod,
      date: s.date,
      reference: s.invoiceNumber,
      raw: s
    }));

    const mappedExpenses = expenses.slice(0, 15).map(e => ({
      _id: e._id,
      type: 'EXPENSE',
      title: e.title,
      subtitle: e.recipient || e.category,
      amount: e.amount,
      paymentMethod: e.paymentMethod,
      detailBadge: e.category,
      date: e.date,
      reference: e.receiptNumber,
      raw: e
    }));

    const recentTransactions = [...mappedSales, ...mappedExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 15);

    // Last 7 days chart data
    const dailyData = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyData[dateKey] = { date: dateKey, sales: 0, expenses: 0 };
    }

    sales.forEach(s => {
      const d = new Date(s.date);
      const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyData[dateKey]) {
        dailyData[dateKey].sales += s.amount;
      }
    });

    expenses.forEach(e => {
      const d = new Date(e.date);
      const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyData[dateKey]) {
        dailyData[dateKey].expenses += e.amount;
      }
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalSales,
          salesCount,
          totalExpenses,
          expensesCount,
          netProfitOrLoss,
          status: isProfit ? 'profit' : (isLoss ? 'loss' : 'breakeven'),
          profitMargin: Number(profitMargin)
        },
        salesByMethod,
        expensesByCategory,
        recentTransactions,
        trend: Object.values(dailyData)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seed demo data for instant testing
export const seedDemoData = async (req, res) => {
  try {
    await Sale.deleteMany({});
    await Expense.deleteMany({});

    const now = new Date();

    const sampleSales = [
      {
        invoiceNumber: 'INV-100101',
        customerName: 'Aarav Sharma',
        customerPhone: '9876543210',
        amount: 2450,
        paymentMethod: 'UPI',
        upiApp: 'GPay',
        items: [{ name: 'Premium Cotton Shirt', quantity: 2, price: 1225 }],
        notes: 'Festival discount applied',
        date: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },
      {
        invoiceNumber: 'INV-100102',
        customerName: 'Priya Sundaram',
        customerPhone: '9845123456',
        amount: 4800,
        paymentMethod: 'UPI',
        upiApp: 'PhonePe',
        items: [{ name: 'Silk Kurti Set', quantity: 1, price: 4800 }],
        notes: 'Regular customer',
        date: new Date(now.getTime() - 5 * 60 * 60 * 1000)
      },
      {
        invoiceNumber: 'INV-100103',
        customerName: 'Ramesh Patel',
        customerPhone: '9711223344',
        amount: 1200,
        paymentMethod: 'Cash',
        upiApp: 'N/A',
        items: [{ name: 'Denim Jeans', quantity: 1, price: 1200 }],
        notes: 'Paid exact cash',
        date: new Date(now.getTime() - 24 * 60 * 60 * 1000)
      },
      {
        invoiceNumber: 'INV-100104',
        customerName: 'Sneha Reddy',
        customerPhone: '9654128970',
        amount: 6500,
        paymentMethod: 'Card',
        upiApp: 'N/A',
        items: [{ name: 'Designer Jacket', quantity: 1, price: 6500 }],
        notes: 'HDFC Credit card swipe',
        date: new Date(now.getTime() - 36 * 60 * 60 * 1000)
      },
      {
        invoiceNumber: 'INV-100105',
        customerName: 'Vikram Joshi',
        customerPhone: '9822334455',
        amount: 3100,
        paymentMethod: 'UPI',
        upiApp: 'GPay',
        items: [{ name: 'Casual T-shirts (Pack of 3)', quantity: 2, price: 1550 }],
        notes: 'GPay QR Scan',
        date: new Date(now.getTime() - 48 * 60 * 60 * 1000)
      },
      {
        invoiceNumber: 'INV-100106',
        customerName: 'Meera Iyer',
        customerPhone: '9900112233',
        amount: 850,
        paymentMethod: 'Cash',
        upiApp: 'N/A',
        items: [{ name: 'Leather Belt & Socks', quantity: 1, price: 850 }],
        notes: 'Counter sale',
        date: new Date(now.getTime() - 72 * 60 * 60 * 1000)
      }
    ];

    const sampleExpenses = [
      {
        title: 'Monthly Shop Rent (October)',
        category: 'Shop Rent',
        amount: 12000,
        paymentMethod: 'Bank Transfer',
        recipient: 'Property Owner (K. Raman)',
        receiptNumber: 'EXP-RENT-10',
        notes: 'Main market shop rent',
        date: new Date(now.getTime() - 96 * 60 * 60 * 1000)
      },
      {
        title: 'Weekly Fresh Stock Wholesale Purchase',
        category: 'Stock',
        amount: 8500,
        paymentMethod: 'UPI',
        recipient: 'Metro Garment Wholesalers',
        receiptNumber: 'EXP-STK-442',
        notes: 'Winter arrival collection batch 1',
        date: new Date(now.getTime() - 40 * 60 * 60 * 1000)
      },
      {
        title: 'Commercial Electricity Bill',
        category: 'Electricity Bills',
        amount: 2350,
        paymentMethod: 'UPI',
        recipient: 'State Electricity Board',
        receiptNumber: 'EXP-EB-891',
        notes: 'Shop AC and display lights',
        date: new Date(now.getTime() - 15 * 60 * 60 * 1000)
      },
      {
        title: 'Sales Assistant Salary Advance',
        category: 'Staff Salaries',
        amount: 5000,
        paymentMethod: 'Cash',
        recipient: 'Arun Kumar (Staff)',
        receiptNumber: 'EXP-SAL-01',
        notes: 'Mid-month staff salary installment',
        date: new Date(now.getTime() - 10 * 60 * 60 * 1000)
      }
    ];

    await Sale.insertMany(sampleSales);
    await Expense.insertMany(sampleExpenses);

    res.json({
      success: true,
      message: 'Demo business data successfully seeded! Ready for demonstration.',
      salesCount: sampleSales.length,
      expensesCount: sampleExpenses.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset all store data
export const resetStoreData = async (req, res) => {
  try {
    await Sale.deleteMany({});
    await Expense.deleteMany({});
    res.json({
      success: true,
      message: 'All sales and expense records have been cleared. Fresh store ready.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
