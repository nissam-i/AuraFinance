import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, Calendar, Tag, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        text: '',
        amount: '',
        category: 'Food'
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // If expense, make negative
            const amount = Number(formData.amount);
            const finalAmount = formData.category === 'Salary' || formData.category === 'Freelance' || formData.category === 'Investment'
                ? Math.abs(amount)
                : -Math.abs(amount);

            await api.post('/transactions', {
                text: formData.text,
                amount: finalAmount,
                category: formData.category
            });

            setFormData({ text: '', amount: '', category: 'Food' });
            setShowModal(false);
            fetchTransactions();
        } catch (error) {
            alert('Failed to add transaction');
        }
    };

    const deleteTransaction = async (id: string) => {
        if (confirm('Are you sure?')) {
            try {
                await api.delete(`/transactions/${id}`);
                fetchTransactions();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">Transactions</h2>
                    <p className="text-gray-400">Track your income and expenses.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} /> Add Transaction
                </button>
            </div>

            {/* List */}
            <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full bg-dark-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none"
                        />
                    </div>
                </div>

                <div className="divide-y divide-white/5">
                    {transactions.map((t: any) => (
                        <div key={t.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "p-3 rounded-xl",
                                    t.amount > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                )}>
                                    {t.amount > 0 ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{t.text}</h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                        <span className="flex items-center gap-1"><Tag size={12} /> {t.category}</span>
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(t.createdAt), 'MMM dd, yyyy')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className={clsx(
                                    "font-bold text-lg",
                                    t.amount > 0 ? "text-emerald-400" : "text-rose-400"
                                )}>
                                    {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => deleteTransaction(t.id)}
                                    className="text-gray-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {transactions.length === 0 && !loading && (
                        <div className="p-8 text-center text-gray-400">
                            No transactions found. Add one to get started!
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="glass-card w-full max-w-lg p-6 relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-2xl font-bold mb-6">Add Transaction</h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="glass-input w-full"
                                            placeholder="e.g. Grocery Shopping"
                                            value={formData.text}
                                            onChange={e => setFormData({ ...formData, text: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                                        <input
                                            type="number"
                                            className="glass-input w-full"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                                        <select
                                            className="glass-input w-full appearance-none"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="Salary" className="bg-dark-900">Salary</option>
                                            <option value="Freelance" className="bg-dark-900">Freelance</option>
                                            <option value="Food" className="bg-dark-900">Food</option>
                                            <option value="Transport" className="bg-dark-900">Transport</option>
                                            <option value="Shopping" className="bg-dark-900">Shopping</option>
                                            <option value="Utilities" className="bg-dark-900">Utilities</option>
                                            <option value="Entertainment" className="bg-dark-900">Entertainment</option>
                                            <option value="Health" className="bg-dark-900">Health</option>
                                            <option value="Other" className="bg-dark-900">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary w-full mt-4">
                                    Add Transaction
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
