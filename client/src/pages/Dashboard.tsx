import { useEffect, useState } from 'react';
import api from '../services/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ArrowUp, ArrowDown, Wallet, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/ai/analyze');
            setData(res.data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white">Loading Dashboard...</div>;

    const chartData = {
        labels: ['Safe-to-Spend', 'Expenses', 'Savings'],
        datasets: [
            {
                data: [
                    data?.totalIncome - data?.totalExpense,
                    data?.totalExpense,
                    data?.savings > 0 ? data?.savings : 0
                ],
                backgroundColor: [
                    '#10B981', // Emerald (Safe)
                    '#F43F5E', // Rose (Expense)
                    '#8B5CF6', // Purple (Savings)
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">Financial Overview</h2>
                    <p className="text-gray-400">Your AI-driven wealth summary.</p>
                </div>
                <Link to="/transactions" className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> Add New
                </Link>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet size={100} className="text-primary-500" />
                    </div>
                    <p className="text-gray-400 mb-1">Total Balance</p>
                    <h3 className="text-3xl font-bold text-white">${(data?.totalIncome - data?.totalExpense).toFixed(2)}</h3>
                    <div className="mt-4 flex items-center text-primary-400 text-sm">
                        <TrendingUp size={16} className="mr-1" />
                        <span>+12% vs last month</span>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <ArrowUp size={24} />
                        </div>
                        <span className="text-sm text-gray-400">Income</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">${data?.totalIncome.toFixed(2)}</h3>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400">
                            <ArrowDown size={24} />
                        </div>
                        <span className="text-sm text-gray-400">Expenses</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">${data?.totalExpense.toFixed(2)}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-xl font-bold mb-6">Spending Analysis</h3>
                    <div className="h-64 flex items-center justify-center">
                        <div className="w-64">
                            <Doughnut data={chartData} options={{ cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } } }} />
                        </div>
                    </div>
                </div>

                {/* AI Insights Sidebar */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                        AI Insights
                    </h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border-l-4 border-primary-500">
                            <p className="text-sm text-gray-300">
                                🤖 Based on your pattern, you are projected to save
                                <span className="font-bold text-white"> ${data?.predictionNextMonth.toFixed(0)} </span>
                                next month.
                            </p>
                        </div>

                        {data?.anomalies.length > 0 && (
                            <div className="p-4 bg-rose-500/10 rounded-xl border-l-4 border-rose-500">
                                <p className="text-sm text-rose-200">
                                    ⚠️ Unusual high spending detected in
                                    <span className="font-bold"> {data?.anomalies[0].category} </span>
                                </p>
                            </div>
                        )}

                        <div className="p-4 bg-white/5 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-400">Top Spend</span>
                                <span className="text-xs font-bold text-white">Food</span>
                            </div>
                            <div className="w-full bg-dark-900 rounded-full h-2">
                                <div className="bg-accent-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
