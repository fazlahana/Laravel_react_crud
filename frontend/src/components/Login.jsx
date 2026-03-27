import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { User, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', credentials);
            localStorage.setItem('token', response.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-8 pt-10 pb-6 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500">Log in to manage your students</p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">Email address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                <User size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                required
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                required
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Sign In'}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-6">
                        Use email: <b>test@example.com</b>, password: <b>password</b>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
