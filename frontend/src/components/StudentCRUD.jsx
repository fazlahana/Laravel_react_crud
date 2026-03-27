import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, User, Search, Trash2, Edit, Save, X, RotateCcw, Loader2 } from 'lucide-react';

const StudentCRUD = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [form, setForm] = useState({ name: '', email: '', phone: '', course: '' });
    const [editingId, setEditingId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await api.get('/students');
            setStudents(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch students. Please check your authentication.');
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const response = await api.put(`/students/${editingId}`, form);
                setStudents(students.map((s) => (s.id === editingId ? response.data : s)));
            } else {
                const response = await api.post('/students', form);
                setStudents([...students, response.data]);
            }
            closeModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred while saving student.');
        }
    };

    const handleEdit = (student) => {
        setEditingId(student.id);
        setForm({ ...student });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/students/${id}`);
            setStudents(students.filter((s) => s.id !== id));
        } catch (err) {
            setError('Failed to delete student.');
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setForm({ name: '', email: '', phone: '', course: '' });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingId(null);
        setForm({ name: '', email: '', phone: '', course: '' });
    };

    const filteredStudents = students.filter(
        (s) => s.name.toLowerCase().includes(query.toLowerCase()) || 
               s.email.toLowerCase().includes(query.toLowerCase()) ||
               s.course.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Dashboard</h1>
                        <p className="text-slate-500 mt-1">Manage and track your enrolled students effortlessly</p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md shadow-blue-100 transition-all active:scale-95"
                    >
                        <Plus size={18} /> Add New Student
                    </button>
                </div>

                {/* Dashboard Stats / Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search by name, email, or course..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                        Showing <span className="text-slate-900">{filteredStudents.length}</span> students
                        <button onClick={fetchStudents} title="Refresh Data" className="ml-3 p-1.5 inline-flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-md transition transform active:rotate-180">
                            <RotateCcw size={16} />
                        </button>
                    </div>
                </div>

                {/* Main Table Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
                        <p className="text-slate-500 font-medium animate-pulse">Loading student data...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {filteredStudents.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                            <th className="px-6 py-4">Student</th>
                                            <th className="px-6 py-4">Contact Info</th>
                                            <th className="px-6 py-4">Course</th>
                                            <th className="px-6 py-4">Joined On</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredStudents.map((s) => (
                                            <tr key={s.id} className="hover:bg-slate-50/50 transition whitespace-nowrap">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 shadow-sm">
                                                            {s.name.charAt(0)}
                                                        </div>
                                                        <div className="font-semibold text-slate-900">{s.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-700">{s.email}</div>
                                                    <div className="text-xs text-slate-400 mt-0.5">{s.phone}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">
                                                        {s.course}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 text-xs font-medium uppercase tracking-wider">
                                                    {new Date(s.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleEdit(s)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                            title="Edit student"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(s.id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                            title="Delete student"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 border-2 border-dashed border-slate-200">
                                    <Search size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">No students found</h3>
                                <p className="text-slate-500 max-w-xs text-center mt-2">Try adjusting your search or add a new student to get started.</p>
                                <button onClick={openCreateModal} className="mt-6 text-blue-600 font-semibold hover:underline flex items-center gap-1">
                                    <Plus size={16} /> Add your first student
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Update Student' : 'Add New Student'}</h2>
                            <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-0.5">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                        <User size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleFormChange}
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-0.5">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={form.email}
                                    onChange={handleFormChange}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 ml-0.5">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        required
                                        value={form.phone}
                                        onChange={handleFormChange}
                                        placeholder="+1 234 567 890"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 ml-0.5">Course Name</label>
                                    <input 
                                        type="text" 
                                        name="course"
                                        required
                                        value={form.course}
                                        onChange={handleFormChange}
                                        placeholder="Computer Science"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> {editingId ? 'Save Changes' : 'Register Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCRUD;
