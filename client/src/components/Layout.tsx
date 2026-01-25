import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Wallet, PieChart, LogOut, ArrowRightLeft } from 'lucide-react';
import clsx from 'clsx';

const SidebarItem = ({ to, icon: Icon, label }: any) => {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link
            to={to}
            className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                active ? "bg-primary-500/20 text-primary-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </Link>
    );
};

export default function Layout() {
    const { logout, user } = useAuth();

    return (
        <div className="flex h-screen bg-dark-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-800 border-r border-white/5 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                        AuraFinance
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/transactions" icon={ArrowRightLeft} label="Transactions" />
                    <SidebarItem to="/wallet" icon={Wallet} label="My Wallet" />
                    <SidebarItem to="/analytics" icon={PieChart} label="AI Insights" />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold text-dark-900">
                            {user?.name?.[0]}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
