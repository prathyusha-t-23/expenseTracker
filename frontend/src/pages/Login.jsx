import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="w-full max-w-md p-8 glass rounded-2xl mx-4">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8 tracking-tight">Welcome Back</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"><span className="block sm:inline">{error}</span></div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="you@example.com"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-800/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="••••••••"/>
                    </div>
                    <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-md transform transition hover:-translate-y-0.5 mt-2">
                        Sign In
                    </button>
                </form>
                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account? <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
