import { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Brain, AlertTriangle, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function Analytics() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/ai/analyze');
                setData(res.data.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading AI Insights...</div>;

    const barData = {
        labels: Object.keys(data?.spendingByCategory || {}),
        datasets: [{
            label: 'Spending by Category',
            data: Object.values(data?.spendingByCategory || {}),
            backgroundColor: '#8B5CF6',
            borderRadius: 8,
        }]
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-accent-500/20 rounded-xl text-accent-400">
                    <Brain size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">AI Insights</h2>
                    <p className="text-gray-400">Deep dive into your financial patterns.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Forecast Card */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-xl font-bold mb-6">Spending Breakdown</h3>
                    <div className="h-64">
                        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.1)' } }, x: { grid: { display: false } } } }} />
                    </div>
                </div>

                {/* Anomalies Card */}
                <div className="glass-card p-6 border border-accent-500/20 bg-accent-900/10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-rose-400" />
                        Risk Analysis
                    </h3>

                    {data?.anomalies.length > 0 ? (
                        <div className="space-y-4">
                            {data.anomalies.map((a: any, i: number) => (
                                <div key={i} className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/20">
                                    <p className="text-rose-200 text-sm font-bold mb-1">Unusual Spending</p>
                                    <p className="text-white text-lg">${Math.abs(a.amount)} on {a.category}</p>
                                    <p className="text-rose-200/60 text-xs">Standard deviation exceeded</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <p className="text-emerald-400 font-bold">No anomalies detected.</p>
                            <p className="text-emerald-200/60 text-sm">Your spending is consistent.</p>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-gray-400 text-sm mb-2">Projected Next Month Expense</p>
                        <h3 className="text-3xl font-bold text-white">${data?.predictionNextMonth.toFixed(0)}</h3>
                        <div className="flex items-center gap-1 text-accent-400 text-sm mt-1">
                            <TrendingUp size={14} />
                            <span>AI Forecast</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
