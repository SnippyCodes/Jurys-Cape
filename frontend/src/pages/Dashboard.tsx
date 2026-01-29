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
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Central Command</p>
                    <h1 className="text-3xl font-bold tracking-tight text-glow text-[var(--text-main)]">Dashboard Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-200">{time.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}</p>
                        <p className="text-xs text-slate-500 uppercase">{time.toLocaleTimeString()} • New Delhi</p>
                    </div>
                    <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse" />
                    </button>
                </div>
            </div>

            {/* Priority Alerts Ticker */}
            {(() => {
                const urgentCases = cases.filter(c => c.priority === 'High' || c.priority === 'Critical');
                const urgentCount = urgentCases.length;

                if (urgentCount === 0) return null;

                return (
                    <div className="glass-panel border-l-4 border-l-rose-500 p-4 rounded-r-xl flex items-center justify-between shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                        <div className="flex items-center gap-4">
                            <div className="bg-rose-500/10 p-2 rounded-full border border-rose-500/20">
                                <AlertTriangle className="h-5 w-5 text-rose-500" />
                            </div>
                            <div>
                                <p className="text-rose-400 font-bold text-sm tracking-wide">URGENT ACTION REQUIRED</p>
                                <p className="text-slate-400 text-xs mt-0.5">
                                    {urgentCount} {urgentCount === 1 ? 'case' : 'cases'} marked as {urgentCount === 1 ? urgentCases[0].priority : 'High/Critical'} priority {urgentCount === 1 ? 'requires' : 'require'} immediate attention.
                                </p>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:underline px-4">VIEW ALL ALERTS</button>
                    </div>
                );
            })()}

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'TOTAL CASES', value: cases.length.toString(), color: 'border-l-blue-500', glow: 'shadow-blue-500/20' },
                    { label: 'PENDING ACTION', value: cases.filter(c => c.status === 'Draft').length.toString(), color: 'border-l-amber-500', glow: 'shadow-amber-500/20' },
                    { label: 'ANALYZED TODAY', value: cases.filter(c => c.status === 'Analyzed').length.toString(), color: 'border-l-emerald-500', glow: 'shadow-emerald-500/20' },
                    { label: 'HIGH PRIORITY', value: cases.filter(c => c.priority === 'High').length.toString(), color: 'border-l-rose-500', glow: 'shadow-rose-500/20' },
                ].map((stat) => (
                    <div key={stat.label} className={`glass-card p-5 rounded-xl border-l-4 ${stat.color} shadow-lg hover:translate-y-[-2px] transition-all`}>
                        <p className="text-xs font-bold hover:text-slate-600 uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1 text-[var(--text-main)]">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Registry Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-400" />
                            CASE REGISTRY
                        </h2>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search Registry..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 w-64 placeholder:text-slate-600 transition-all"
                                />
                            </div>
                            <button className="p-2 bg-slate-800/50 border border-white/10 rounded-lg hover:bg-slate-800 hover:border-white/20 text-slate-400 hover:text-white transition-all">
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
                                className="p-2 bg-slate-800/50 border border-white/10 rounded-lg hover:bg-slate-800 hover:border-white/20 text-slate-400 hover:text-white transition-all"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="glass-panel rounded-xl overflow-hidden">
                        {cases.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-800/50 mb-4">
                                    <FileText className="h-8 w-8 text-slate-600" />
                                </div>
                                <p className="text-slate-400 text-sm">No cases found in registry.</p>
                                <button onClick={() => navigate('/case/new')} className="text-blue-400 hover:text-blue-300 text-sm font-bold mt-2">Start a new case entry &rarr;</button>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-[var(--bg-panel)] theme-border">
                                    <tr>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-[var(--text-muted)]">ID / Case Title</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-[var(--text-muted)]">Type</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-[var(--text-muted)]">Status</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-[var(--text-muted)]">Priority</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right text-[var(--text-muted)]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {cases.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((c) => (
                                        <motion.tr
                                            key={c.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-bold transition-colors group-hover:text-blue-400 text-[var(--text-main)]">{c.id}</p>
                                                <p className="text-xs truncate max-w-[180px] text-[var(--text-muted)]">{c.title}</p>
                                            </td>
                                            <td className="px-6 py-4 text-[var(--text-muted)]">{c.case_type}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${c.status === 'Analyzed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    c.status === 'Draft' ? 'bg-slate-700/30 text-slate-400 border-slate-600/30' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold uppercase tracking-wide ${c.priority === 'High' ? 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
                                                    c.priority === 'Medium' ? 'text-amber-500' : 'text-slate-500'
                                                    }`}>
                                                    {c.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/case/${c.id}`)}
                                                    className="text-blue-400 hover:text-blue-300 font-medium text-xs uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-all hover:translate-x-[-4px]"
                                                >
                                                    Open Case &rarr;
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
                    <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-400" />
                        QUICK ACTIONS
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => navigate('/case/new')}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white p-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-4 group border border-blue-400/20"
                        >
                            <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                                <Plus className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">NEW CASE ENTRY</p>
                                <p className="text-xs text-blue-100">Draft FIR or Report</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/evidence')}
                            className="glass-card hover:bg-slate-800/60 p-4 rounded-xl flex items-center gap-4 group cursor-pointer text-slate-300 hover:text-white"
                        >
                            <div className="bg-slate-800 p-3 rounded-lg group-hover:bg-slate-700 transition-colors border border-white/5">
                                <Camera className="h-6 w-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">UPLOAD EVIDENCE</p>
                                <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Media Analysis</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/chat')}
                            className="glass-card hover:bg-slate-800/60 p-4 rounded-xl flex items-center gap-4 group cursor-pointer text-slate-300 hover:text-white"
                        >
                            <div className="bg-slate-800 p-3 rounded-lg group-hover:bg-slate-700 transition-colors border border-white/5">
                                <MessageSquare className="h-6 w-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">LEGAL CONSULT</p>
                                <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">RAG Chatbot</p>
                            </div>
                        </button>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 rounded-xl p-6 text-white mt-8 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Briefing</p>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start group">
                                <span className="text-xs font-mono text-blue-500 mt-0.5 bg-blue-500/10 px-1 rounded">10:00</span>
                                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">New circular issued regarding BNS Section 69 updates.</span>
                            </li>
                            <li className="flex gap-3 items-start group">
                                <span className="text-xs font-mono text-blue-500 mt-0.5 bg-blue-500/10 px-1 rounded">09:15</span>
                                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">System maintenance scheduled for 02:00 AM.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
