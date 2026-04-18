import { useState, useEffect } from 'react';
import API from '../services/api';
import TransactionForm from '../components/TransactionForm';
import { Plus, Trash2, Edit2, Download, Search, Filter, X } from 'lucide-react';

const predefinedCategories = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Others'];

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters state
    const [category, setCategory] = useState('All');
    const [type, setType] = useState('All');
    const [search, setSearch] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category !== 'All') params.append('category', category);
            if (type !== 'All') params.append('type', type);
            if (search) params.append('search', search);

            const res = await API.get(`/expenses?${params.toString()}`);
            setExpenses(res.data);
        } catch (err) {
            console.error('Failed to fetch expenses', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Simple debounce for search
        const timeoutId = setTimeout(() => {
            fetchExpenses();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [category, type, search]);

    const handleTransactionSubmit = async (data) => {
        try {
            if (data._id) {
                await API.put(`/expenses/${data._id}`, data);
            } else {
                await API.post('/expenses', data);
            }
            setIsModalOpen(false);
            setEditingTransaction(null);
            fetchExpenses(); // Refresh list
        } catch (err) {
            console.error('Error saving transaction: ', err);
            alert('Failed to save transaction');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await API.delete(`/expenses/${id}`);
            fetchExpenses(); // Refresh list
        } catch (err) {
            console.error('Failed to delete transaction', err);
        }
    };

    const exportCSV = () => {
        if (expenses.length === 0) return;
        
        const headers = ['Date', 'Title', 'Amount', 'Type', 'Category', 'Description'];
        const csvContent = [
            headers.join(','),
            ...expenses.map(e => [
                new Date(e.date).toLocaleDateString(),
                `"${e.title.replace(/"/g, '""')}"`,
                e.amount,
                e.type,
                `"${e.category}"`,
                `"${(e.description || '').replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                <div className="flex space-x-3 w-full sm:w-auto">
                    <button onClick={exportCSV} className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition font-medium text-sm">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                    <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition shadow-md font-medium text-sm">
                        <Plus className="w-4 h-4" />
                        <span>Add New</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="glass p-4 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search title..." 
                        value={search} 
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800/50 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800/50 dark:text-white outline-none">
                        <option value="All">All Types</option>
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                    </select>
                </div>
                <div>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800/50 dark:text-white outline-none">
                        {predefinedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/80">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Info</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500"><div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div></td></tr>
                            ) : expenses.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No transactions found matching your criteria.</td></tr>
                            ) : expenses.map(tx => (
                                <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        <div className="font-medium">{tx.title}</div>
                                        {tx.description && <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{tx.description}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${tx.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => { setEditingTransaction(tx); setIsModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(tx._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative z-50 w-full max-w-lg transform transition-all animate-in fade-in zoom-in duration-200">
                            <TransactionForm 
                                initialData={editingTransaction} 
                                onSubmit={handleTransactionSubmit} 
                                onClose={() => setIsModalOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
