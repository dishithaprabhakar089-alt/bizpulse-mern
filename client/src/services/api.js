const API_BASE = '/api';

export const api = {
  // Authentication
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async demoLogin() {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Demo login failed');
    return data;
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Session expired');
    return res.json();
  },

  // Dashboard Summary
  async getSummary(timeRange = 'all') {
    const res = await fetch(`${API_BASE}/dashboard/summary?timeRange=${timeRange}`);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  // Sales
  async getSales(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/sales?${query}`);
    if (!res.ok) throw new Error('Failed to fetch sales');
    return res.json();
  },

  async createSale(saleData) {
    const res = await fetch(`${API_BASE}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to record sale');
    return data;
  },

  async deleteSale(id) {
    const res = await fetch(`${API_BASE}/sales/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete sale');
    return res.json();
  },

  // Expenses
  async getExpenses(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/expenses?${query}`);
    if (!res.ok) throw new Error('Failed to fetch expenses');
    return res.json();
  },

  async createExpense(expenseData) {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to record expense');
    return data;
  },

  async deleteExpense(id) {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete expense');
    return res.json();
  },

  // Seed & Reset
  async seedDemo() {
    const res = await fetch(`${API_BASE}/dashboard/seed`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to seed demo data');
    return res.json();
  },

  async resetData() {
    const res = await fetch(`${API_BASE}/dashboard/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset store data');
    return res.json();
  }
};
