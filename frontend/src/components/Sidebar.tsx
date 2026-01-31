import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Camera, MessageSquare, BookOpen, Shield, Settings } from 'lucide-react';
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
            <div className="h-24 flex items-center gap-4 px-6 border-b theme-border bg-gradient-to-r from-[var(--bg-surface)] to-transparent">
                <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <ScaleIcon className="h-7 w-7 text-amber-500" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-wide font-serif text-glow-gold">JURIS CAPE</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-[10px] text-emerald-500/80 uppercase tracking-wider font-semibold">Judiciary Net Online</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-8 px-4 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 font-mono">Chambers</p>
                <nav className="space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => cn(
                                "flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-r-xl transition-all duration-300 group relative border-l-2",
                                isActive
                                    ? "bg-gradient-to-r from-amber-500/10 to-transparent text-amber-500 border-amber-500"
                                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon className={cn(
                                        "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                                        isActive
                                            ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                                            : "text-slate-500 group-hover:text-slate-300"
                                    )} />
                                    <span className="relative z-10">{link.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t theme-border bg-[var(--bg-surface)]">
                <div className="glass-card flex items-center gap-4 p-3 rounded-xl cursor-pointer group theme-hover">
                    <div className="h-10 w-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center border theme-border group-hover:border-amber-500/30 transition-colors shadow-lg">
                        <Shield className="h-5 w-5 text-[var(--text-muted)] group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors font-serif">Officer Krushna</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-[10px] text-emerald-500 font-medium tracking-wide">ENCRYPTED</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function ScaleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
    )
}
