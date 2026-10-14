import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Receipt, PlusCircle, PieChart as PieChartIcon, 
  BarChart3, Settings, Trash2, TrendingUp, TrendingDown, Wallet, 
  PiggyBank, ArrowUpRight, ArrowDownRight, Menu, X, CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const initialTransactions = [
    { id: 1, date: '2026-04-25', description: 'Groceries', category: 'Food', amount: 680, type: 'Expense' },
    { id: 2, date: '2026-04-24', description: 'Bus Pass', category: 'Transport', amount: 200, type: 'Expense' },
    { id: 3, date: '2026-04-23', description: 'Freelance Work', category: 'Income', amount: 2000, type: 'Income' },
    { id: 4, date: '2026-04-22', description: 'Netflix', category: 'Entertainment', amount: 499, type: 'Expense' },
    { id: 5, date: '2026-04-20', description: 'Shopping', category: 'Shopping', amount: 1250, type: 'Expense' }
  ];

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('pixelbudget_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  useEffect(() => {
    localStorage.setItem('pixelbudget_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const [formType, setFormType] = useState('Expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || isNaN(amount)) {
      showNotification('Please enter a valid description and amount.');
      return;
    }

    const newTx = {
      id: Date.now(),
      date,
      description: description.trim(),
      category: formType === 'Income' ? 'Income' : category,
      amount: parseFloat(amount),
      type: formType
    };

    setTransactions([newTx, ...transactions]);
    setDescription('');
    setAmount('');
    showNotification('Transaction added successfully!');
    setActiveTab('dashboard');
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    showNotification('Transaction deleted.');
  };

  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;
  const savings = totalBalance > 0 ? totalBalance * 0.4 : 0;

  const categoryTotals = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const categoryColors = {
    Food: '#4B5694',
    Transport: '#7288AE',
    Shopping: '#EAE0CF',
    Bills: '#111844',
    Entertainment: '#6366f1',
    Others: '#94a3b8'
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-mono text-[#111844]" style={{ backgroundColor: '#EAE0CF' }}>
      
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-[#111844] text-[#EAE0CF] px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 border-2 border-[#7288AE] animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm">{notification}</span>
        </div>
      )}

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#111844] text-[#EAE0CF] border-b-4 border-[#4B5694]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#4B5694] flex items-center justify-center border-2 border-[#7288AE]">
            <Wallet className="w-4 h-4 text-[#EAE0CF]" />
          </div>
          <span className="font-bold tracking-wider text-lg">PixelBudget</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-[#4B5694] text-[#EAE0CF] focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111844] text-[#EAE0CF] border-b-4 border-[#4B5694] px-4 py-4 space-y-2 z-40">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'transactions', label: 'Transactions', icon: Receipt },
            { id: 'add', label: 'Add Expense', icon: PlusCircle },
            { id: 'categories', label: 'Categories', icon: PieChartIcon },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-[#4B5694] text-[#EAE0CF] border-2 border-[#7288AE]' : 'hover:bg-[#4B5694]/50 text-[#EAE0CF]/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#111844] text-[#EAE0CF] p-6 border-r-4 border-[#4B5694] shrink-0 justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#4B5694] flex items-center justify-center border-2 border-[#7288AE] shadow-md">
              <Wallet className="w-5 h-5 text-[#EAE0CF]" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide text-[#EAE0CF]">PixelBudget</h1>
              <p className="text-xs text-[#7288AE]">Smart steps. Big goals.</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'transactions', label: 'Transactions', icon: Receipt },
              { id: 'add', label: 'Add Expense', icon: PlusCircle },
              { id: 'categories', label: 'Categories', icon: PieChartIcon },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-[#4B5694] text-[#EAE0CF] border-2 border-[#7288AE] shadow-inner' 
                      : 'hover:bg-[#4B5694]/30 text-[#EAE0CF]/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 rounded-xl bg-[#4B5694]/30 border-2 border-[#4B5694] text-xs text-[#EAE0CF]/90">
          <p className="font-semibold mb-1">💡 Daily Tip</p>
          <p className="text-[11px] leading-relaxed opacity-80">Good money habits build a brighter future!</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl p-5 mb-6 border-2 border-[#4B5694] shadow-sm gap-3">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#111844] flex items-center justify-center text-[#EAE0CF] font-bold text-lg border-2 border-[#7288AE]">
              👤
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111844]">Hello, User!</h2>
              <p className="text-xs text-[#4B5694]">Keep going! You're doing great.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold bg-[#EAE0CF] px-3 py-2 rounded-xl border border-[#7288AE] text-[#111844] self-start sm:self-auto">
            <span>📅</span>
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border-2 border-[#4B5694] shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#4B5694] uppercase tracking-wider">Total Balance</span>
                  <div className="p-2 rounded-xl bg-[#EAE0CF] text-[#111844]"><Wallet className="w-4 h-4" /></div>
                </div>
                <div className="my-3">
                  <span className="text-2xl font-black text-[#111844]">₹ {totalBalance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center text-xs text-emerald-600 font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                  <span>+12% this month</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-[#4B5694] shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#4B5694] uppercase tracking-wider">Total Expenses</span>
                  <div className="p-2 rounded-xl bg-red-100 text-red-600"><TrendingDown className="w-4 h-4" /></div>
                </div>
                <div className="my-3">
                  <span className="text-2xl font-black text-red-600">₹ {totalExpense.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center text-xs text-red-500 font-semibold">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
                  <span>+8% this month</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-[#4B5694] shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#4B5694] uppercase tracking-wider">Total Income</span>
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600"><TrendingUp className="w-4 h-4" /></div>
                </div>
                <div className="my-3">
                  <span className="text-2xl font-black text-emerald-600">₹ {totalIncome.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center text-xs text-emerald-600 font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                  <span>+20% this month</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-[#4B5694] shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#4B5694] uppercase tracking-wider">Savings</span>
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-600"><PiggyBank className="w-4 h-4" /></div>
                </div>
                <div className="my-3">
                  <span className="text-2xl font-black text-amber-600">₹ {savings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center text-xs text-emerald-600 font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                  <span>+15% this month</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border-2 border-[#4B5694] shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-[#111844] flex items-center space-x-2">
                    <Receipt className="w-4 h-4 text-[#4B5694]" />
                    <span>Recent Transactions</span>
                  </h3>
                  <button onClick={() => setActiveTab('transactions')} className="text-xs text-[#4B5694] font-semibold hover:underline">
                    View All →
                  </button>
                </div>

                {transactions.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">No transactions recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#EAE0CF] text-xs text-[#4B5694]">
                          <th className="py-2 px-2">Date</th>
                          <th className="py-2 px-2">Description</th>
                          <th className="py-2 px-2">Category</th>
                          <th className="py-2 px-2">Amount</th>
                          <th className="py-2 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE0CF]/50 text-xs">
                        {transactions.slice(0, 5).map(t => (
                          <tr key={t.id} className="hover:bg-[#EAE0CF]/20">
                            <td className="py-3 px-2 text-gray-600">{t.date}</td>
                            <td className="py-3 px-2 font-medium text-[#111844]">{t.description}</td>
                            <td className="py-3 px-2">
                              <span className="px-2 py-0.5 rounded-md bg-[#EAE0CF] text-[#111844] font-semibold text-[11px]">
                                {t.category}
                              </span>
                            </td>
                            <td className={`py-3 px-2 font-bold ${t.type === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>
                              {t.type === 'Income' ? '+' : '-'}₹ {t.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-5 border-2 border-[#4B5694] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#111844] mb-4 flex items-center space-x-2">
                    <PlusCircle className="w-4 h-4 text-[#4B5694]" />
                    <span>Quick Add Transaction</span>
                  </h3>

                  <form onSubmit={handleAddTransaction} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4B5694] mb-1">Type</label>
                      <select 
                        value={formType} 
                        onChange={(e) => setFormType(e.target.value)}
                        className="w-full p-2 rounded-xl border border-[#4B5694] bg-[#EAE0CF]/30 text-xs focus:outline-none"
                      >
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4B5694] mb-1">Description</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Coffee, Bus, Salary" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 rounded-xl border border-[#4B5694] bg-[#EAE0CF]/30 text-xs focus:outline-none"
                      />
                    </div>

                    {formType === 'Expense' && (
                      <div>
                        <label className="block text-[11px] font-bold text-[#4B5694] mb-1">Category</label>
                        <select 
                          value={category} 
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full p-2 rounded-xl border border-[#4B5694] bg-[#EAE0CF]/30 text-xs focus:outline-none"
                        >
                          <option value="Food">Food</option>
                          <option value="Transport">Transport</option>
                          <option value="Shopping">Shopping</option>
                          <option value="Bills">Bills</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-[#4B5694] mb-1">Amount (₹)</label>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 rounded-xl border border-[#4B5694] bg-[#EAE0CF]/30 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4B5694] mb-1">Date</label>
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 rounded-xl border border-[#4B5694] bg-[#EAE0CF]/30 text-xs focus:outline-none"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-2.5 rounded-xl bg-[#111844] text-[#EAE0CF] font-bold text-xs hover:bg-[#4B5694] transition-all shadow-md mt-2"
                    >
                      Add Transaction
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl p-6 border-2 border-[#4B5694] shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-[#111844]">All Transactions</h3>
              <span className="text-xs text-[#4B5694]">Total: {transactions.length} items</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE0CF] text-xs text-[#4B5694]">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Description</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE0CF]/50 text-xs">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-[#EAE0CF]/20">
                      <td className="py-3 px-3 text-gray-600">{t.date}</td>
                      <td className="py-3 px-3 font-semibold text-[#111844]">{t.description}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-md bg-[#EAE0CF] text-[#111844] font-semibold text-[11px]">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${t.type === 'Income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className={`py-3 px-3 font-bold ${t.type === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {t.type === 'Income' ? '+' : '-'}₹ {t.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ADD EXPENSE */}
        {activeTab === 'add' && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 border-2 border-[#4B5694] shadow-sm">
            <h3 className="font-bold text-base text-[#111844] mb-4 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-[#4B5694]" />
              <span>Add New Transaction</span>
            </h3>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4B5694] mb-1">Transaction Type</label>
                <select 
                  value={formType} 
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#4B5694] bg-[#EAE0CF]/30 text-xs focus:outline-none"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5694] mb-1">Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Grocery store, Monthly Salary" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#4B5694] bg-[#EAE0CF]/30 text-xs focus:outline-none"
                />
              </div>

              {formType === 'Expense' && (
                <div>
                  <label className="block text-xs font-bold text-[#4B5694] mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#4B5694] bg-[#EAE0CF]/30 text-xs focus:outline-none"
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#4B5694] mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#4B5694] bg-[#EAE0CF]/30 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5694] mb-1">Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#4B5694] bg-[#EAE0CF]/30 text-xs focus:outline-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-[#111844] text-[#EAE0CF] font-bold text-xs hover:bg-[#4B5694] transition-all shadow-md mt-4"
              >
                Save Transaction
              </button>
            </form>
          </div>
        )}

        {/* TAB: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl p-6 border-2 border-[#4B5694] shadow-sm space-y-6">
            <h3 className="font-bold text-base text-[#111844]">Expense Categories Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(categoryColors).map(cat => {
                const total = categoryTotals[cat] || 0;
                const percentage = totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0;
                return (
                  <div key={cat} className="p-4 rounded-xl bg-[#EAE0CF]/20 border border-[#4B5694]/40 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-[#111844]">{cat}</span>
                      <span className="text-xs font-bold text-[#4B5694]">₹ {total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: categoryColors[cat] }}></div>
                    </div>
                    <span className="text-[11px] text-gray-500 mt-2 text-right">{percentage}% of total expenses</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: REPORTS */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl p-6 border-2 border-[#4B5694] shadow-sm space-y-6">
            <h3 className="font-bold text-base text-[#111844]">Financial Summary Report</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#EAE0CF]/30 border border-[#4B5694]">
                <p className="text-xs text-[#4B5694] font-bold">Total Inflows</p>
                <p className="text-xl font-black text-emerald-600 mt-1">₹ {totalIncome.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#EAE0CF]/30 border border-[#4B5694]">
                <p className="text-xs text-[#4B5694] font-bold">Total Outflows</p>
                <p className="text-xl font-black text-red-600 mt-1">₹ {totalExpense.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#EAE0CF]/30 border border-[#4B5694]">
                <p className="text-xs text-[#4B5694] font-bold">Net Savings Rate</p>
                <p className="text-xl font-black text-[#111844] mt-1">
                  {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 border-2 border-[#4B5694] shadow-sm space-y-6">
            <h3 className="font-bold text-base text-[#111844]">Settings & Data Management</h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#EAE0CF]/20 border border-[#4B5694]/40 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-[#111844]">Reset All Data</h4>
                  <p className="text-[11px] text-gray-500">Clears custom transactions and restores default records.</p>
                </div>
                <button 
                  onClick={() => {
                    setTransactions(initialTransactions);
                    showNotification('Data reset to default.');
                  }}
                  className="px-3 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
                >
                  Reset
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#EAE0CF]/20 border border-[#4B5694]/40 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-[#111844]">Clear Local Storage</h4>
                  <p className="text-[11px] text-gray-500">Deletes all saved transactions completely.</p>
                </div>
                <button 
                  onClick={() => {
                    setTransactions([]);
                    localStorage.removeItem('pixelbudget_transactions');
                    showNotification('Storage cleared.');
                  }}
                  className="px-3 py-2 rounded-xl bg-[#111844] text-[#EAE0CF] font-bold text-xs hover:bg-[#4B5694]"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}