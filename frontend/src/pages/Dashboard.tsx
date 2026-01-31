import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, Activity, FileText, AlertTriangle,
    Filter, Download, Bell, Camera, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { caseService, type Case } from '../api/client';

export default function Dashboard() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [cases, setCases] = useState<Case[]>([]);

    useEffect(() => {
        caseService.getCases().then(setCases).catch(console.error);
    }, []);

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-8 font-sans">
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[var(--text-main)] font-serif mb-2">My Docket</h1>
                    <p className="text-slate-400 font-medium">Welcome back, Officer Krushna. You have {cases.length} active cases.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-200 font-serif tracking-wide">{time.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        <p className="text-xs text-amber-500/80 uppercase font-bold tracking-widest">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • New Delhi HQ</p>
                    </div>
                    <button className="relative p-3 text-slate-400 hover:text-white transition-colors glass-card rounded-full hover:bg-white/5">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2.5 h-2 w-2 bg-amber-500 rounded-full border border-slate-900 animate-pulse" />
                    </button>
                </div>
            </div>

            {/* Priority Alerts Ticker */}
            {(() => {
                const urgentCases = cases.filter(c => c.priority === 'High' || c.priority === 'Critical');
                const urgentCount = urgentCases.length;

                if (urgentCount === 0) return null;

                return (
                    <div className="glass-panel border-l-4 border-l-rose-500 p-5 rounded-r-xl flex items-center justify-between shadow-[0_0_20px_rgba(244,63,94,0.1)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-rose-500/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 pointer-events-none" />
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="bg-rose-500/10 p-2.5 rounded-full border border-rose-500/20 animate-pulse">
                                <AlertTriangle className="h-5 w-5 text-rose-500" />
                            </div>
                            <div>
                                <p className="text-rose-400 font-bold text-sm tracking-wide font-serif">CRITICAL ATTENTION REQUIRED</p>
                                <p className="text-slate-400 text-sm mt-0.5">
                                    {urgentCount} {urgentCount === 1 ? 'case' : 'cases'} marked as {urgentCount === 1 ? urgentCases[0].priority : 'High/Critical'} priority {urgentCount === 1 ? 'requires' : 'require'} your immediate review.
                                </p>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:underline px-4 z-10 uppercase tracking-widest">View Alerts</button>
                    </div>
                );
            })()}

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'TOTAL CASES', value: cases.length.toString(), color: 'border-l-blue-500', glow: 'shadow-blue-500/10' },
                    { label: 'PENDING ACTION', value: cases.filter(c => c.status === 'Draft').length.toString(), color: 'border-l-amber-500', glow: 'shadow-amber-500/10' },
                    { label: 'ANALYZED TODAY', value: cases.filter(c => c.status === 'Analyzed').length.toString(), color: 'border-l-emerald-500', glow: 'shadow-emerald-500/10' },
                    { label: 'HIGH PRIORITY', value: cases.filter(c => c.priority === 'High').length.toString(), color: 'border-l-rose-500', glow: 'shadow-rose-500/10' },
                ].map((stat) => (
                    <div key={stat.label} className={`glass-card p-6 rounded-xl border-l-4 ${stat.color} shadow-lg hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group`}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors">{stat.label}</p>
                        <p className="text-4xl font-black mt-2 text-[var(--text-main)] font-serif tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Registry Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-200 flex items-center gap-3 font-serif">
                            <FileText className="h-5 w-5 text-amber-500" />
                            Case Registry
                        </h2>
                        <div className="flex gap-2">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by ID or Title..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 w-64 placeholder:text-slate-600 transition-all focus:w-72"
                                />
                            </div>
                            <button className="p-2 bg-slate-800/50 border border-white/10 rounded-lg hover:bg-slate-800 hover:border-white/20 text-slate-400 hover:text-white transition-all tooltip" title="Filter">
                                <Filter className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => {
                                    const headers = ['ID', 'Title', 'Type', 'Status', 'Priority', 'Date'];
                                    const rows = cases.map(c => [
                                        c.id, c.title, c.case_type, c.status, c.priority, new Date().toLocaleDateString()
                                    ]);
                                    const csvContent = "data:text/csv;charset=utf-8,"
                                        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", "case_registry.csv");
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className="p-2 bg-slate-800/50 border border-white/10 rounded-lg hover:bg-slate-800 hover:border-white/20 text-slate-400 hover:text-white transition-all tooltip"
                                title="Export CSV"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="glass-panel rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                        {cases.length === 0 ? (
                            <div className="p-16 text-center flex flex-col items-center">
                                <div className="p-5 rounded-full bg-slate-800/50 mb-6 ring-1 ring-white/10">
                                    <FileText className="h-10 w-10 text-slate-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-300 font-serif">Registry Empty</h3>
                                <p className="text-slate-500 text-sm mt-2 max-w-xs">No active cases found. Begin by filing a new case or checking the archives.</p>
                                <button onClick={() => navigate('/case/new')} className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-blue-900/20">
                                    Initiate New Filing
                                </button>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-slate-900/60 theme-border backdrop-blur-sm">
                                    <tr>
                                        <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px] text-[var(--text-muted)] font-mono">Reference</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px] text-[var(--text-muted)] font-mono">Classification</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px] text-[var(--text-muted)] font-mono">State</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px] text-[var(--text-muted)] font-mono">Urgency</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px] text-right text-[var(--text-muted)] font-mono">Proceedings</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {cases.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((c) => (
                                        <motion.tr
                                            key={c.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-white/[0.02] transition-colors group cursor-default"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-xs text-slate-500 mb-1">#{c.id}</span>
                                                    <span className="font-bold text-[var(--text-main)] group-hover:text-blue-400 transition-colors font-serif text-base">{c.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-400 font-medium">{c.case_type}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${c.status === 'Analyzed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    c.status === 'Draft' ? 'bg-slate-700/30 text-slate-400 border-slate-600/30' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${c.priority === 'High' ? 'bg-rose-500 animate-pulse' :
                                                        c.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-500'
                                                        }`} />
                                                    <span className={`text-xs font-bold uppercase tracking-wide ${c.priority === 'High' ? 'text-rose-400' :
                                                        c.priority === 'Medium' ? 'text-amber-400' : 'text-slate-500'
                                                        }`}>
                                                        {c.priority}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/case/${c.id}`)}
                                                    className="text-slate-400 hover:text-white font-medium text-xs uppercase tracking-widest border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5"
                                                >
                                                    Open
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-200 flex items-center gap-3 font-serif">
                        <Activity className="h-5 w-5 text-amber-500" />
                        Quick Commands
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => navigate('/case/new')}
                            className="bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white p-5 rounded-xl shadow-lg shadow-amber-900/20 transition-all flex items-center gap-5 group border border-amber-400/20 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                            <div className="bg-white/20 p-3 rounded-lg group-hover:scale-105 transition-transform backdrop-blur-sm relative z-10">
                                <Plus className="h-6 w-6" />
                            </div>
                            <div className="text-left relative z-10">
                                <p className="font-bold text-base font-serif tracking-wide">NEW CASE FILING</p>
                                <p className="text-xs text-amber-100/80 font-medium">Draft FIR / Incident Report</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/evidence')}
                            className="glass-card hover:bg-slate-800/60 p-5 rounded-xl flex items-center gap-5 group cursor-pointer text-slate-300 hover:text-white transition-all border border-white/5 hover:border-blue-500/30"
                        >
                            <div className="bg-slate-800/80 p-3 rounded-lg group-hover:bg-blue-600/20 transition-colors border border-white/5 group-hover:border-blue-500/30">
                                <Camera className="h-6 w-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm tracking-wide">UPLOAD EVIDENCE</p>
                                <p className="text-xs text-slate-500 group-hover:text-slate-400">Forensic Analysis</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/chat')}
                            className="glass-card hover:bg-slate-800/60 p-5 rounded-xl flex items-center gap-5 group cursor-pointer text-slate-300 hover:text-white transition-all border border-white/5 hover:border-emerald-500/30"
                        >
                            <div className="bg-slate-800/80 p-3 rounded-lg group-hover:bg-emerald-600/20 transition-colors border border-white/5 group-hover:border-emerald-500/30">
                                <MessageSquare className="h-6 w-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm tracking-wide">LEGAL CONSULTANT</p>
                                <p className="text-xs text-slate-500 group-hover:text-slate-400">AI Legal Assistance</p>
                            </div>
                        </button>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 rounded-xl p-6 text-white mt-8 backdrop-blur-sm shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="flex items-center gap-2 mb-6 relative z-10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Live Briefing</p>
                        </div>
                        <ul className="space-y-6 relative z-10">
                            <li className="flex gap-4 items-start group">
                                <span className="text-[10px] font-mono text-slate-500 mt-1">10:00</span>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-300 group-hover:text-blue-300 transition-colors uppercase tracking-wider">Circular 24/B</p>
                                    <p className="text-sm text-slate-400 leading-relaxed section-glow">Updated protocols for handling BNS Section 69 digital evidence.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start group">
                                <span className="text-[10px] font-mono text-slate-500 mt-1">09:15</span>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-300 group-hover:text-amber-300 transition-colors uppercase tracking-wider">System Alert</p>
                                    <p className="text-sm text-slate-400 leading-relaxed">Scheduled maintenance for archive servers at 02:00 AM tonight.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

