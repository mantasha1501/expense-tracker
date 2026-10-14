import React, { useState, useEffect } from 'react';

// Color Palette Constants
const COLORS = {
  primaryDark: '#111844',
  secondaryBlue: '#4B5694',
  accentMuted: '#7288AE',
  lightBg: '#EAE0CF',
};

// Initial default transactions
const INITIAL_TRANSACTIONS = [
  { id: 1, date: '2026-10-10', description: 'Groceries & Provisions', category: 'Food', amount: 680, type: 'Expense' },
  { id: 2, date: '2026-10-12', description: 'Client Consulting Retainer', category: 'Income', amount: 18000, type: 'Income' },
  { id: 3, date: '2026-10-13', description: 'Monthly Transit Pass', category: 'Transport', amount: 200, type: 'Expense' },
  { id: 4, date: '2026-10-14', description: 'Media Subscription', category: 'Entertainment', amount: 499, type: 'Expense' },
  { id: 5, date: '2026-10-14', description: 'Weekend Apparel', category: 'Shopping', amount: 1250, type: 'Expense' },
  { id: 6, date: '2026-10-14', description: 'Internet & Utility Bill', category: 'Bills', amount: 850, type: 'Expense' }
];

// Sample Weekly Data for Chart Visualization
const WEEKLY_DATA = [
  { day: 'Mon', amount: 2100 },
  { day: 'Tue', amount: 1300 },
  { day: 'Wed', amount: 2600 },
  { day: 'Thu', amount: 1650 },
  { day: 'Fri', amount: 2350 },
  { day: 'Sat', amount: 3400 },
  { day: 'Sun', amount: 1550 }
];

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('pixel_budget_v2_data');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form State
  const [type, setType] = useState('Expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [chartTimeframe, setChartTimeframe] = useState('This Week');

  useEffect(() => {
    localStorage.setItem('pixel_budget_v2_data', JSON.stringify(transactions));
  }, [transactions]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || isNaN(amount) || Number(amount) <= 0) {
      showNotification('⚠️ Please enter a valid description and positive amount.');
      return;
    }

    const newTx = {
      id: Date.now(),
      description: description.trim(),
      category: type === 'Income' ? 'Income' : category,
      amount: parseFloat(amount),
      type,
      date
    };

    setTransactions([newTx, ...transactions]);
    setDescription('');
    setAmount('');
    showNotification('✨ Transaction recorded successfully!');
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    showNotification('🗑️ Transaction removed.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all transaction data to default parameters?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      showNotification('🔄 Data reset to defaults.');
    }
  };

  // Dynamic Financial Metrics
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = 12850 + totalIncome - totalExpense;
  const savings = 7700 + Math.floor(totalIncome * 0.25);

  // Category Breakdown for Donut Chart
  const categoryColors = {
    Food: '#4B5694',
    Transport: '#7288AE',
    Shopping: '#E59866',
    Bills: '#52BE80',
    Entertainment: '#AF7AC5',
    Others: '#AAB7B8',
    Income: '#2ECC71'
  };

  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'];
  const categoryTotals = expenseCategories.map(cat => {
    const val = transactions
      .filter(t => t.type === 'Expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, value: val };
  });

  const totalExpenseCatSum = categoryTotals.reduce((a, b) => a + b.value, 0) || 1;

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'All' || t.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans selection:bg-[#4B5694] selection:text-white" style={{ backgroundColor: COLORS.lightBg }}>
      
      {/* Toast Notification */}
      {notification && (
        <div 
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl text-white text-xs font-bold transition-all transform animate-fade-in flex items-center gap-2 border border-white/20"
          style={{ backgroundColor: COLORS.primaryDark }}
        >
          {notification}
        </div>
      )}

      {/* MOBILE TOP BAR */}
      <div 
        className="md:hidden flex items-center justify-between p-4 sticky top-0 z-40 border-b shadow-sm"
        style={{ backgroundColor: COLORS.primaryDark, borderColor: '#232b5d' }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/20" style={{ backgroundColor: COLORS.secondaryBlue }}>
            👛
          </div>
          <div>
            <h1 className="font-black text-white tracking-wide text-base leading-tight">PixelBudget</h1>
            <p className="text-[10px]" style={{ color: COLORS.accentMuted }}>Small steps. Big goals.</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* BACKDROP OVERLAY FOR MOBILE SIDEBAR */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* NAVIGATION SIDEBAR */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 w-72 md:w-64 flex-shrink-0 flex flex-col justify-between p-6 shadow-2xl md:shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: COLORS.primaryDark, color: COLORS.lightBg }}
      >
        <div>
          {/* Brand Logo Header (Desktop) */}
          <div className="hidden md:flex items-center space-x-3 mb-8">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/20" style={{ backgroundColor: COLORS.secondaryBlue }}>
              👛
            </div>
            <div>
              <h1 className="font-black tracking-wider text-lg text-white">PixelBudget</h1>
              <p className="text-[11px]" style={{ color: COLORS.accentMuted }}>Small steps. Big goals.</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5 mt-4 md:mt-0">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
              { id: 'transactions', label: 'Transactions', icon: '📋' },
              { id: 'add-expense', label: 'Add Expense', icon: '➕' },
              { id: 'categories', label: 'Categories', icon: '🗂️' },
              { id: 'reports', label: 'Reports', icon: '📊' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold text-xs tracking-wide transition-all min-h-[44px] ${
                  activeTab === item.id 
                    ? 'shadow-md text-white border border-white/10' 
                    : 'hover:bg-white/5 text-gray-300'
                }`}
                style={{
                  backgroundColor: activeTab === item.id ? COLORS.secondaryBlue : 'transparent'
                }}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Pixel Mascot Footer */}
        <div className="mt-8 p-4 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center space-x-3">
            <span className="text-2xl animate-pulse">🐱</span>
            <div>
              <p className="text-xs font-extrabold text-white">Good Money Habits</p>
              <p className="text-[10px] text-gray-300 leading-tight">build a brighter future!</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP BAR / USER GREETING */}
        <header 
          className="px-4 sm:px-6 py-4 border-b flex flex-row justify-between items-center gap-3 bg-white/60 backdrop-blur-md sticky top-0 z-20"
          style={{ borderColor: '#d9cebc' }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-[#4B5694] text-white shadow-sm border border-white/30">
              👧🏽
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black" style={{ color: COLORS.primaryDark }}>Hello, User!</h2>
              <p className="text-[10px] sm:text-[11px] text-gray-600 font-medium">Keep going! You're doing great!</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div 
              className="px-3 py-2 rounded-xl text-[11px] font-bold bg-white shadow-sm border flex items-center gap-1.5"
              style={{ color: COLORS.primaryDark, borderColor: '#d9cebc' }}
            >
              <span>📅</span>
              <span className="hidden sm:inline">Apr 26, 2026</span>
              <span className="sm:hidden">Apr 26</span>
            </div>
            <button 
              onClick={handleResetData}
              className="p-2 rounded-xl text-xs font-bold text-gray-700 bg-white border shadow-sm hover:bg-gray-100 transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
              style={{ borderColor: '#d9cebc' }}
              title="Reset Application Data"
            >
              🔄
            </button>
          </div>
        </header>

        {/* DYNAMIC TAB BODY */}
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
          
          {/* DASHBOARD TAB */}
          {(activeTab === 'dashboard' || activeTab === 'add-expense') && (
            <>
              {/* TOP SUMMARY STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Balance */}
                <div className="p-5 rounded-2xl shadow-sm border bg-white flex items-center justify-between" style={{ borderColor: '#dfd4c0' }}>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">Total Balance</p>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: COLORS.primaryDark }}>
                      ₹ {netBalance.toLocaleString()}
                    </h3>
                    <span className="inline-flex items-center mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ▲ +12% this month
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
                    👛
                  </div>
                </div>

                {/* Total Expenses */}
                <div className="p-5 rounded-2xl shadow-sm border bg-white flex items-center justify-between" style={{ borderColor: '#dfd4c0' }}>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">Total Expenses</p>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-rose-700">
                      ₹ {(5150 + totalExpense).toLocaleString()}
                    </h3>
                    <span className="inline-flex items-center mt-2 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                      ▲ +8% this month
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-rose-50 border border-rose-100 shadow-sm">
                    🪙
                  </div>
                </div>

                {/* Total Income */}
                <div className="p-5 rounded-2xl shadow-sm border bg-white flex items-center justify-between" style={{ borderColor: '#dfd4c0' }}>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">Total Income</p>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-700">
                      ₹ {(18000 + totalIncome).toLocaleString()}
                    </h3>
                    <span className="inline-flex items-center mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ▲ +20% this month
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
                    💵
                  </div>
                </div>

                {/* Savings */}
                <div className="p-5 rounded-2xl shadow-sm border bg-white flex items-center justify-between" style={{ borderColor: '#dfd4c0' }}>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">Savings</p>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: COLORS.primaryDark }}>
                      ₹ {savings.toLocaleString()}
                    </h3>
                    <span className="inline-flex items-center mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ▲ +15% this month
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-amber-50 border border-amber-100 shadow-sm">
                    🐷
                  </div>
                </div>

              </div>

              {/* VISUAL CHARTS ROW (RESPONSIVE SVG VISUALIZATIONS) */}
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Spending Overview SVG Bar Chart */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-5 sm:p-6" style={{ borderColor: '#dfd4c0' }}>
                    <div className="flex flex-row justify-between items-center mb-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">📊</span>
                        <h3 className="text-sm sm:text-base font-black" style={{ color: COLORS.primaryDark }}>
                          Spending Overview
                        </h3>
                      </div>
                      <select 
                        value={chartTimeframe}
                        onChange={(e) => setChartTimeframe(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border text-xs font-bold bg-white text-gray-700"
                        style={{ borderColor: '#d9cebc' }}
                      >
                        <option value="This Week">This Week</option>
                        <option value="This Month">This Month</option>
                      </select>
                    </div>

                    {/* Dynamic Responsive SVG Bar Chart */}
                    <div className="w-full aspect-[16/9] sm:aspect-[2/1] max-h-64">
                      <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
                        {/* Grid Lines */}
                        {[0, 50, 100, 150].map((yVal, idx) => (
                          <g key={idx}>
                            <line x1="35" y1={180 - yVal} x2="480" y2={180 - yVal} stroke="#f0e6d6" strokeWidth="1" strokeDasharray="3,3" />
                            <text x="5" y={184 - yVal} fill="#9ea7ba" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                              ₹{idx}k
                            </text>
                          </g>
                        ))}

                        {/* Bars */}
                        {WEEKLY_DATA.map((item, idx) => {
                          const x = 55 + idx * 60;
                          const height = (item.amount / 4000) * 150;
                          const y = 180 - height;
                          return (
                            <g key={item.day} className="group cursor-pointer">
                              <rect
                                x={x}
                                y={y}
                                width="32"
                                height={height}
                                rx="6"
                                fill={idx === 5 ? '#E59866' : idx % 2 === 0 ? COLORS.secondaryBlue : COLORS.accentMuted}
                                className="transition-all hover:opacity-80"
                              />
                              <text x={x + 16} y="198" textAnchor="middle" fill="#606f8c" fontSize="11" fontWeight="bold">
                                {item.day}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Expense by Category Donut Chart */}
                  <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6 flex flex-col justify-between" style={{ borderColor: '#dfd4c0' }}>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-xl">🍕</span>
                      <h3 className="text-sm sm:text-base font-black" style={{ color: COLORS.primaryDark }}>
                        Expense by Category
                      </h3>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-4">
                      {/* Responsive SVG Donut */}
                      <div className="w-36 h-36 relative flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                          {(() => {
                            let cumulativePercent = 0;
                            return categoryTotals.map((cat, i) => {
                              const percent = (cat.value / totalExpenseCatSum) * 100;
                              if (percent <= 0) return null;
                              const strokeDasharray = `${percent} ${100 - percent}`;
                              const strokeDashoffset = -cumulativePercent;
                              cumulativePercent += percent;

                              return (
                                <circle
                                  key={cat.name}
                                  cx="18"
                                  cy="18"
                                  r="15.91549430918954"
                                  fill="transparent"
                                  stroke={categoryColors[cat.name] || COLORS.secondaryBlue}
                                  strokeWidth="6"
                                  strokeDasharray={strokeDasharray}
                                  strokeDashoffset={strokeDashoffset}
                                />
                              );
                            });
                          })()}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
                          <span className="text-xs font-black" style={{ color: COLORS.primaryDark }}>100%</span>
                        </div>
                      </div>

                      {/* Legend List */}
                      <div className="w-full space-y-1.5 text-xs">
                        {categoryTotals.map((cat) => {
                          const pct = Math.round((cat.value / totalExpenseCatSum) * 100);
                          return (
                            <div key={cat.name} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColors[cat.name] }}></span>
                                <span className="font-bold text-gray-700 text-[11px]">{cat.name}</span>
                              </div>
                              <span className="font-extrabold text-gray-900 text-[11px]">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* LOWER MAIN GRID: TRANSACTIONS & ADD FORM */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Transactions Section */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-5 sm:p-6" style={{ borderColor: '#dfd4c0' }}>
                  <div className="flex flex-row justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">📋</span>
                      <h3 className="text-sm sm:text-base font-black" style={{ color: COLORS.primaryDark }}>
                        Recent Transactions
                      </h3>
                    </div>
                    <button 
                      onClick={() => setActiveTab('transactions')}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#EAE0CF] text-[#111844] hover:opacity-80 transition-opacity"
                    >
                      View All →
                    </button>
                  </div>

                  {/* DESKTOP TABLE VIEW (md+) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b uppercase tracking-wider text-gray-400 text-[10px]" style={{ borderColor: '#f0e8d8' }}>
                          <th className="pb-3 font-bold">Date</th>
                          <th className="pb-3 font-bold">Description</th>
                          <th className="pb-3 font-bold">Category</th>
                          <th className="pb-3 font-bold">Amount</th>
                          <th className="pb-3 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: '#f4ede1' }}>
                        {transactions.slice(0, 5).map((tx) => (
                          <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3.5 text-gray-500 font-mono text-[11px]">{tx.date}</td>
                            <td className="py-3.5 font-bold text-gray-800">{tx.description}</td>
                            <td className="py-3.5">
                              <span 
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold" 
                                style={{ backgroundColor: COLORS.lightBg, color: COLORS.primaryDark }}
                              >
                                {tx.category}
                              </span>
                            </td>
                            <td className={`py-3.5 font-black ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {tx.type === 'Income' ? '+ ₹ ' : '- ₹ '} {tx.amount.toLocaleString()}
                            </td>
                            <td className="py-3.5 text-right">
                              <button
                                onClick={() => handleDelete(tx.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors min-h-[36px] min-w-[36px]"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARD VIEW (< md) */}
                  <div className="md:hidden space-y-3">
                    {transactions.slice(0, 5).map((tx) => (
                      <div 
                        key={tx.id} 
                        className="p-3.5 rounded-xl border bg-gray-50/50 flex items-center justify-between gap-3"
                        style={{ borderColor: '#f0e6d6' }}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span 
                              className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase"
                              style={{ backgroundColor: COLORS.lightBg, color: COLORS.primaryDark }}
                            >
                              {tx.category}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">{tx.date}</span>
                          </div>
                          <p className="text-xs font-bold text-gray-900 truncate">{tx.description}</p>
                        </div>

                        <div className="flex items-center space-x-3 flex-shrink-0">
                          <span className={`text-xs font-black ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {tx.type === 'Income' ? '+' : '-'}₹{tx.amount}
                          </span>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Transaction Form */}
                <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6 flex flex-col justify-between" style={{ borderColor: '#dfd4c0' }}>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">➕</span>
                      <h3 className="text-sm sm:text-base font-black" style={{ color: COLORS.primaryDark }}>
                        Add New Transaction
                      </h3>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-5">Saved locally on your browser.</p>

                    <form onSubmit={handleAddTransaction} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Select Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setType('Expense')}
                            className={`py-2.5 text-xs font-bold rounded-xl border transition-all min-h-[44px] ${
                              type === 'Expense' ? 'text-white border-transparent shadow-sm' : 'bg-white text-gray-600 border-gray-200'
                            }`}
                            style={{ backgroundColor: type === 'Expense' ? COLORS.secondaryBlue : 'transparent' }}
                          >
                            Expense
                          </button>
                          <button
                            type="button"
                            onClick={() => setType('Income')}
                            className={`py-2.5 text-xs font-bold rounded-xl border transition-all min-h-[44px] ${
                              type === 'Income' ? 'text-white border-transparent shadow-sm' : 'bg-white text-gray-600 border-gray-200'
                            }`}
                            style={{ backgroundColor: type === 'Income' ? COLORS.secondaryBlue : 'transparent' }}
                          >
                            Income
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Description</label>
                        <input
                          type="text"
                          placeholder="e.g. Coffee, Bus Pass, Salary"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4B5694] bg-white text-gray-800 min-h-[44px]"
                          style={{ borderColor: '#d9cebc' }}
                          required
                        />
                      </div>

                      {type === 'Expense' && (
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">Category</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4B5694] bg-white text-gray-800 min-h-[44px]"
                            style={{ borderColor: '#d9cebc' }}
                          >
                            <option value="Food">Food & Groceries</option>
                            <option value="Transport">Transport</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills & Utilities</option>
                            <option value="Entertainment">Entertainment</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Amount (₹)</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4B5694] bg-white text-gray-800 min-h-[44px]"
                          style={{ borderColor: '#d9cebc' }}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4B5694] bg-white text-gray-800 min-h-[44px]"
                          style={{ borderColor: '#d9cebc' }}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-2 min-h-[48px]"
                        style={{ backgroundColor: COLORS.primaryDark }}
                      >
                        <span>💾 Add Transaction</span>
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === 'transactions' && (
            <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6 space-y-6" style={{ borderColor: '#dfd4c0' }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-black" style={{ color: COLORS.primaryDark }}>All Transactions Ledger</h3>
                  <p className="text-xs text-gray-500">Filter, search, and manage all logged transactions.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border text-xs w-full sm:w-48 bg-white min-h-[40px]"
                    style={{ borderColor: '#d9cebc' }}
                  />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border text-xs w-full sm:w-auto bg-white min-h-[40px]"
                    style={{ borderColor: '#d9cebc' }}
                  >
                    <option value="All">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>

              {/* Responsive Table / Cards */}
              <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-xs">No transactions match your query.</div>
                ) : (
                  filteredTransactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="p-4 rounded-xl border bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      style={{ borderColor: '#dfd4c0' }}
                    >
                      <div className="flex items-center space-x-3">
                        <span 
                          className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase"
                          style={{ backgroundColor: COLORS.lightBg, color: COLORS.primaryDark }}
                        >
                          {tx.category}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{tx.description}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{tx.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end space-x-4">
                        <span className={`text-sm font-black ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.type === 'Income' ? '+ ₹ ' : '- ₹ '}{tx.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6 space-y-6" style={{ borderColor: '#dfd4c0' }}>
              <div>
                <h3 className="text-base font-black" style={{ color: COLORS.primaryDark }}>Category Expense Summary</h3>
                <p className="text-xs text-gray-500">Distribution of expenditures across all categories.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {expenseCategories.map((cat) => {
                  const spent = transactions
                    .filter(t => t.category === cat && t.type === 'Expense')
                    .reduce((sum, t) => sum + t.amount, 0);

                  return (
                    <div key={cat} className="p-5 rounded-2xl border bg-gray-50/50 flex flex-col justify-between" style={{ borderColor: '#dfd4c0' }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold" style={{ color: COLORS.primaryDark }}>{cat}</span>
                        <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-white border text-xs" style={{ borderColor: '#dfd4c0' }}>
                          📦
                        </span>
                      </div>
                      <p className="text-xl font-black text-rose-600">₹ {spent.toLocaleString()}</p>
                      <p className="text-[11px] text-gray-500 mt-1">Total recorded outflow</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6 space-y-6" style={{ borderColor: '#dfd4c0' }}>
              <div>
                <h3 className="text-base font-black" style={{ color: COLORS.primaryDark }}>Financial Cash Flow Report</h3>
                <p className="text-xs text-gray-500">Overall income, expense, and net position breakdown.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border bg-emerald-50/50 border-emerald-100">
                  <p className="text-xs font-bold text-emerald-800 mb-1">Total Inflows</p>
                  <p className="text-2xl font-black text-emerald-700">₹ {(18000 + totalIncome).toLocaleString()}</p>
                </div>
                <div className="p-5 rounded-2xl border bg-rose-50/50 border-rose-100">
                  <p className="text-xs font-bold text-rose-800 mb-1">Total Outflows</p>
                  <p className="text-2xl font-black text-rose-700">₹ {(5150 + totalExpense).toLocaleString()}</p>
                </div>
                <div className="p-5 rounded-2xl border bg-indigo-50/50 border-indigo-100">
                  <p className="text-xs font-bold text-indigo-800 mb-1">Net Balance Position</p>
                  <p className="text-2xl font-black" style={{ color: COLORS.primaryDark }}>₹ {netBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6 space-y-6" style={{ borderColor: '#dfd4c0' }}>
              <div>
                <h3 className="text-base font-black" style={{ color: COLORS.primaryDark }}>Settings & Storage</h3>
                <p className="text-xs text-gray-500">Manage client data and view deployment status.</p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="p-4 rounded-xl border bg-gray-50" style={{ borderColor: '#dfd4c0' }}>
                  <h4 className="text-xs font-bold text-gray-800 mb-1">Reset Storage</h4>
                  <p className="text-[11px] text-gray-600 mb-3">Clear local modifications and restore standard starter data.</p>
                  <button
                    onClick={handleResetData}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-sm hover:bg-rose-700 transition-colors min-h-[44px]"
                  >
                    Reset Application Data
                  </button>
                </div>

                <div className="p-4 rounded-xl border bg-gray-50" style={{ borderColor: '#dfd4c0' }}>
                  <h4 className="text-xs font-bold text-gray-800 mb-1">GitHub Hosting Status</h4>
                  <p className="text-[11px] text-gray-600">
                    This build is 100% client-side with persistent browser storage. Ready for hosting directly on GitHub Pages!
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}