import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Camera, MessageSquare, BookOpen, Shield, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/case/new', icon: FileText, label: 'Case Filing' },
    { to: '/evidence', icon: Camera, label: 'Forensics' },
    { to: '/chat', icon: MessageSquare, label: 'Legal Consult' },
    { to: '/mapper', icon: BookOpen, label: 'Law Mapper' },
];

export default function Sidebar() {
    return (
        <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 bg-slate-900 border-r border-slate-800 text-slate-300 shadow-2xl z-20 font-sans">
            {/* Header */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/50 bg-slate-900">
                <div className="bg-blue-600/10 p-1.5 rounded-lg border border-blue-500/20">
                    <Globe className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                    <h1 className="text-sm font-bold text-slate-100 tracking-wide">JURIS-CAPE</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">System v1.0</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 overflow-y-auto">
                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Operations</p>
                <nav className="space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative",
                                isActive
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                            )}
                        >
                            <link.icon className={cn("h-4 w-4 transition-colors", ({ isActive }: any) => isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                            <span>{link.label}</span>
                            {({ isActive }: any) => isActive && (
                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-slate-800 bg-slate-900">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center border border-slate-600 group-hover:border-slate-500 overflow-hidden">
                        <Shield className="h-4 w-4 text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">Officer Krushna</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] text-slate-500 font-medium tracking-tight">ENCRYPTED</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
