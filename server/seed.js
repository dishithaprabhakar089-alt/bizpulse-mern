import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Sale from './models/Sale.js';
import Expense from './models/Expense.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Sale.deleteMany({});
    await Expense.deleteMany({});

    const now = new Date();

    const sampleSales = [
      {
        invoiceNumber: 'INV-100101',
        customerName: 'Aarav Sharma',
        customerPhone: '9876543210',
        amount: 3250,
        paymentMethod: 'UPI',
        upiApp: 'GPay',
        items: [{ name: 'Casual Linen Shirts', quantity: 2, price: 1625 }],
        notes: 'GPay payment received',
        date: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },
      {
        invoiceNumber: 'INV-100102',
        customerName: 'Priya Sundaram',
        customerPhone: '9845123456',
        amount: 4800,
        paymentMethod: 'UPI',
        upiApp: 'PhonePe',
        items: [{ name: 'Designer Anarkali Suit', quantity: 1, price: 4800 }],
        notes: 'PhonePe QR scan at counter',
        date: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      },
      {
        invoiceNumber: 'INV-100103',
        customerName: 'Ramesh Patel',
        customerPhone: '9711223344',
        amount: 1500,
        paymentMethod: 'Cash',
        upiApp: 'N/A',
        items: [{ name: 'Slim Fit Denim Jeans', quantity: 1, price: 1500 }],
        notes: 'Paid cash at billing counter',
        date: new Date(now.getTime() - 14 * 60 * 60 * 1000)
      },
      {
        invoiceNumber: 'INV-100104',
        customerName: 'Sneha Reddy',
        customerPhone: '9654128970',
        amount: 7200,
        paymentMethod: 'Card',
        upiApp: 'N/A',
        items: [{ name: 'Partywear Blazer & Trousers', quantity: 1, price: 7200 }],
        notes: 'HDFC Credit Card POS swipe',
        date: new Date(now.getTime() - 26 * 60 * 60 * 1000)
      },
      {
        invoiceNumber: 'INV-100105',
        customerName: 'Vikram Joshi',
        customerPhone: '9822334455',
        amount: 2900,
        paymentMethod: 'UPI',
        upiApp: 'GPay',
        items: [{ name: 'Cotton Polos (Pack of 2)', quantity: 2, price: 1450 }],
        notes: 'GPay transaction ID verified',
        date: new Date(now.getTime() - 44 * 60 * 60 * 1000)
      },
      {
        invoiceNumber: 'INV-100106',
        customerName: 'Meera Iyer',
        customerPhone: '9900112233',
        amount: 950,
        paymentMethod: 'Cash',
        upiApp: 'N/A',
        items: [{ name: 'Accessories & Socks Set', quantity: 1, price: 950 }],
        notes: 'Cash payment',
        date: new Date(now.getTime() - 65 * 60 * 60 * 1000)
      }
    ];

    const sampleExpenses = [
      {
        title: 'Monthly Shop Rent (Current Month)',
        category: 'Shop Rent',
        amount: 12000,
        paymentMethod: 'Bank Transfer',
        recipient: 'Mr. K. Raman (Shop Landlord)',
        receiptNumber: 'EXP-RENT-101',
        notes: 'Transferred via RTGS',
        date: new Date(now.getTime() - 90 * 60 * 60 * 1000)
      },
      {
        title: 'Wholesale Fabric & Inventory Restock',
        category: 'Stock',
        amount: 7500,
        paymentMethod: 'UPI',
        recipient: 'Surat Textile Wholesalers',
        receiptNumber: 'EXP-STK-492',
        notes: 'New seasonal arrival batch',
        date: new Date(now.getTime() - 40 * 60 * 60 * 1000)
      },
      {
        title: 'Commercial Electricity Bill (Shop AC & Lighting)',
        category: 'Electricity Bills',
        amount: 2150,
        paymentMethod: 'UPI',
        recipient: 'Electricity Distribution Board',
        receiptNumber: 'EXP-EB-773',
        notes: 'Monthly billing consumption',
        date: new Date(now.getTime() - 20 * 60 * 60 * 1000)
      },
      {
        title: 'Staff Salary - Sales Associate Arun',
        category: 'Staff Salaries',
        amount: 4500,
        paymentMethod: 'Cash',
        recipient: 'Arun Kumar (Store Associate)',
        receiptNumber: 'EXP-SAL-02',
        notes: 'Monthly salary distribution',
        date: new Date(now.getTime() - 12 * 60 * 60 * 1000)
      }
    ];

    await Sale.insertMany(sampleSales);
    await Expense.insertMany(sampleExpenses);

    console.log(`✅ Seeded ${sampleSales.length} sales and ${sampleExpenses.length} expenses successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
