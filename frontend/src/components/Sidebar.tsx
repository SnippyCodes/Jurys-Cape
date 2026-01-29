import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Camera, MessageSquare, BookOpen, Shield, Globe, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/case/new', icon: FileText, label: 'Case Filing' },
    { to: '/evidence', icon: Camera, label: 'Forensics' },
    { to: '/chat', icon: MessageSquare, label: 'Legal Consult' },
    { to: '/mapper', icon: BookOpen, label: 'Law Mapper' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
    return (
        <aside className="w-72 flex-shrink-0 flex flex-col h-screen sticky top-0 backdrop-blur-2xl border-r z-50 transition-all duration-300 bg-[var(--bg-panel)] border-[var(--glass-border)] text-[var(--text-muted)]">
            {/* Header */}
            <div className="h-20 flex items-center gap-4 px-6 border-b theme-border bg-gradient-to-r from-[var(--bg-surface)] to-transparent">
                <div className="bg-blue-600/20 p-2 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                    <Globe className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-wide text-glow">JURIS-CAPE</h1>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-[10px] text-emerald-500/80 uppercase tracking-wider font-semibold">System Online</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-8 px-4 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 font-mono">Module Access</p>
                <nav className="space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => cn(
                                "flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.15)]"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:border hover:border-white/5"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon className={cn(
                                        "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                                        isActive
                                            ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                            : "text-slate-500 group-hover:text-slate-300"
                                    )} />
                                    <span className="relative z-10">{link.label}</span>
                                    {isActive && (
                                        <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_#3b82f6]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t theme-border bg-[var(--bg-surface)]">
                <div className="glass-card flex items-center gap-4 p-3 rounded-xl cursor-pointer group theme-hover">
                    <div className="h-10 w-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center border theme-border group-hover:border-blue-500/30 transition-colors shadow-lg">
                        <Shield className="h-5 w-5 text-[var(--text-muted)] group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">Officer Krushna</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-[10px] text-emerald-500 font-medium tracking-wide">SECURE CONN</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
