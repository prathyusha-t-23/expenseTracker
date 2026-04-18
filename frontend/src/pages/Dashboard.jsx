import { useState, useEffect } from 'react';
import API from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

const Dashboard = () => {
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [summaryRes, expensesRes] = await Promise.all([
                    API.get('/expenses/summary'),
                    API.get('/expenses')
                ]);
                setSummary(summaryRes.data);
                setExpenses(expensesRes.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    // Group expenses by category for PieChart
    const categoryData = expenses
        .filter(exp => exp.type === 'Expense')
        .reduce((acc, curr) => {
            const existing = acc.find(item => item.name === curr.category);
            if (existing) {
                existing.value += curr.amount;
            } else {
                acc.push({ name: curr.category, value: curr.amount });
            }
            return acc;
        }, []);

    // Recent 5 transactions
    const recentTransactions = expenses.slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="glass p-6 rounded-2xl flex flex-col justify-between group transform transition hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Balance</h3>
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg"><Wallet className="text-indigo-600 dark:text-indigo-400 w-5 h-5"/></div>
                    </div>
                    <p className={`text-4xl font-bold ${summary.balance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}>
                        ${summary.balance.toFixed(2)}
                    </p>
                </div>
                
                {/* Income Card */}
                <div className="glass p-6 rounded-2xl flex flex-col justify-between group transform transition hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Income</h3>
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><ArrowUpRight className="text-green-600 dark:text-green-400 w-5 h-5"/></div>
                    </div>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                        +${summary.totalIncome.toFixed(2)}
                    </p>
                </div>

                {/* Expense Card */}
                <div className="glass p-6 rounded-2xl flex flex-col justify-between group transform transition hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Expense</h3>
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"><ArrowDownRight className="text-red-600 dark:text-red-400 w-5 h-5"/></div>
                    </div>
                    <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                        -${summary.totalExpense.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visualizations */}
                <div className="glass p-6 rounded-2xl h-96 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center"><Activity className="w-5 h-5 mr-2" /> Expenses by Category</h3>
                    {categoryData.length > 0 ? (
                        <div className="flex-grow">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-gray-500">No expenses recorded yet.</div>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="glass p-6 rounded-2xl flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Transactions</h3>
                        <Link to="/expenses" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                        {recentTransactions.length > 0 ? recentTransactions.map(tx => (
                            <div key={tx._id} className="flex justify-between items-center p-4 border border-gray-100 dark:border-gray-700/50 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-full ${tx.type === 'Income' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                                        {tx.type === 'Income' ? <ArrowUpRight className="w-4 h-4"/> : <ArrowDownRight className="w-4 h-4"/>}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{tx.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()} • {tx.category}</p>
                                    </div>
                                </div>
                                <div className={`font-bold ${tx.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex items-center justify-center text-gray-500">No transactions found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
