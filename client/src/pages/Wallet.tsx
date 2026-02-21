import { useAuth } from '../context/AuthContext';
import { Wallet as WalletIcon, TrendingUp, Shield, CreditCard } from 'lucide-react';
import api from '../services/api';

export default function Wallet() {
    const { user, setUser } = useAuth();

    // Mock data for UI as market mock was in backend and we need simpler UI for now
    const goldPrice = 85.50;
    // const silverPrice = 1.20;

    const goldValue = (user?.goldBalance || 0) * goldPrice;

    const handleAddFunds = async () => {
        const amount = prompt("Enter amount to add in ₹ (Minimum 10):");
        if (!amount || isNaN(Number(amount)) || Number(amount) < 10) {
            return alert("Invalid amount");
        }

        try {
            const res = await api.post('/payments/order', { amount: Number(amount) });
            const { order } = res.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
                amount: order.amount,
                currency: "INR",
                name: "AuraFinance",
                description: "Add funds to wallet",
                order_id: order.id,
                handler: async (response: any) => {
                    const verifyRes = await api.post('/payments/verify', {
                        ...response,
                        amount: Number(amount)
                    });

                    if (verifyRes.data.success) {
                        alert("Payment successful! Funds added.");
                        // Update local user state
                        if (user) {
                            setUser({
                                ...user,
                                walletBalance: Number(user.walletBalance) + Number(amount)
                            });
                        }
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: "#10B981",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            alert("Payment initiation failed");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">My Wallet</h2>
                    <p className="text-gray-400">Manage your assets and savings.</p>
                </div>
                <button
                    onClick={handleAddFunds}
                    className="btn-primary flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-primary-600 border-none px-6 py-3"
                >
                    <CreditCard size={20} /> Add Funds (₹)
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cash Card */}
                <div className="glass-card p-8 bg-gradient-to-br from-emerald-900/40 to-dark-800">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
                            <WalletIcon size={32} />
                        </div>
                        <div>
                            <p className="text-gray-400">Cash Balance</p>
                            <h3 className="text-3xl font-bold text-white">₹{user?.walletBalance.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>

                {/* Digital Gold */}
                <div className="glass-card p-8 bg-gradient-to-br from-yellow-900/40 to-dark-800">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-yellow-500/20 rounded-2xl text-yellow-500">
                            <Shield size={32} />
                        </div>
                        <div>
                            <p className="text-gray-400">Digital Gold</p>
                            <h3 className="text-3xl font-bold text-white">{(user?.goldBalance || 0).toFixed(4)} g</h3>
                            <p className="text-sm text-yellow-500/80">≈ ₹{goldValue.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Current Price</span>
                            <span className="text-yellow-400 font-bold">₹{goldPrice} / g</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-8 glass-card text-center">
                <TrendingUp size={48} className="mx-auto text-primary-500 mb-4" opacity={0.5} />
                <h3 className="text-xl font-bold text-white">Advanced Trading</h3>
                <p className="text-gray-400 mt-2">Full exchange capabilities coming in next release.</p>
            </div>
        </div>
    );
}
