import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-[var(--bg-app)] text-slate-200 font-sans selection:bg-blue-500/30">
            <Sidebar />
            <main className="flex-1 h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
