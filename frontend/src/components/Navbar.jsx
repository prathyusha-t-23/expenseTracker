import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun, LogOut, Wallet } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDark = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setDarkMode(true);
        }
    };

    return (
        <nav className="glass sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Wallet className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">ExpenseFlow</span>
                        </Link>
                    </div>
                    
                    {user && (
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</Link>
                            <Link to="/expenses" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Expenses</Link>
                            
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
                            
                            <button onClick={toggleDark} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition">
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            
                            <button onClick={logout} className="flex items-center space-x-1 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition">
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
