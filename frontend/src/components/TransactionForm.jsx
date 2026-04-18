import { useState, useEffect } from 'react';

const predefinedCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Others'];

const TransactionForm = ({ onSubmit, initialData = null, onClose }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [customCategory, setCustomCategory] = useState('');
    const [type, setType] = useState('Expense');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setAmount(initialData.amount);
            
            if (predefinedCategories.includes(initialData.category)) {
                setCategory(initialData.category);
            } else {
                setCategory('Custom');
                setCustomCategory(initialData.category);
            }
            setType(initialData.type);
            setDate(new Date(initialData.date).toISOString().split('T')[0]);
            setDescription(initialData.description || '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const finalCategory = category === 'Custom' ? customCategory : category;
        
        onSubmit({
            _id: initialData?._id,
            title,
            amount: Number(amount),
            category: finalCategory,
            type,
            date,
            description
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 glass rounded-2xl w-full max-w-lg shadow-xl mx-auto relative relative">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {initialData ? 'Edit Transaction' : 'Add Transaction'}
            </h3>
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800/50 dark:text-white outline-none">
                            <option value="Expense">Expense</option>
                            <option value="Income">Income</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800/50 dark:text-white outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800/50 dark:text-white outline-none" placeholder="e.g. Grocery store" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                    <input type="number" step="0.01" min="0.01" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800/50 dark:text-white outline-none" placeholder="0.00" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800/50 dark:text-white outline-none mb-2">
                        {predefinedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        <option value="Custom">Custom...</option>
                    </select>
                    
                    {category === 'Custom' && (
                        <input type="text" value={customCategory} onChange={e => setCustomCategory(e.target.value)} required placeholder="Enter custom category" className="w-full p-2 border border-blue-300 dark:border-blue-700 rounded-lg dark:bg-gray-800/50 dark:text-white outline-none" />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows="2" className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800/50 dark:text-white outline-none resize-none"></textarea>
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                {onClose && (
                    <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        Cancel
                    </button>
                )}
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-md transition">
                    {initialData ? 'Update' : 'Save'}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;
