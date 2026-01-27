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

    return (
        <div className="space-y-8 font-sans">
            {/* Top Header */}
            <div className="flex items-end justify-between border-b border-slate-200 pb-6">
                {/* ... Header content ... */}
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Central Command</p>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* ... Date/Time ... */}
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900">27 JAN 2026</p>
                        <p className="text-xs text-slate-500 uppercase">22:45 HRS • New Delhi</p>
                    </div>
                    <button className="relative p-2 text-slate-400 hover:text-slate-600">
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-slate-50" />
                    </button>
                </div>
            </div>

            {/* Priority Alerts Ticker */}
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-rose-100 p-2 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-rose-900 font-bold text-sm">URGENT ACTION REQUIRED</p>
                        <p className="text-rose-700 text-xs mt-0.5">3 High Priority cases pending analysis for over 24 hours.</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-rose-700 hover:underline px-4">VIEW ALL ALERTS</button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'TOTAL CASES', value: cases.length.toString(), color: 'border-l-blue-500' },
                    { label: 'PENDING ACTION', value: cases.filter(c => c.status === 'Draft').length.toString(), color: 'border-l-amber-500' },
                    { label: 'ANALYZED TODAY', value: cases.filter(c => c.status === 'Analyzed').length.toString(), color: 'border-l-emerald-500' },
                    { label: 'HIGH PRIORITY', value: cases.filter(c => c.priority === 'High').length.toString(), color: 'border-l-rose-500' },
                ].map((stat) => (
                    <div key={stat.label} className={`bg-white p-5 rounded-lg border border-slate-200 shadow-sm ${stat.color} border-l-4`}>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Registry Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-slate-400" />
                            CASE REGISTRY
                        </h2>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search Registry..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                            </div>
                            <button className="p-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50">
                                <Filter className="h-4 w-4 text-slate-600" />
                            </button>
                            <button className="p-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50">
                                <Download className="h-4 w-4 text-slate-600" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        {cases.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No cases found in registry. Start a new case.
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">ID / Case Title</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Type</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Priority</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {cases.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((c) => (
                                        <motion.tr
                                            key={c.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-slate-50 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-900">{c.id}</p>
                                                <p className="text-slate-500 text-xs truncate max-w-[180px]">{c.title}</p>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{c.case_type}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                 ${c.status === 'Analyzed' ? 'bg-emerald-100 text-emerald-800' :
                                                        c.status === 'Draft' ? 'bg-slate-100 text-slate-800' : 'bg-amber-100 text-amber-800'}`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold uppercase tracking-wide
                                 ${c.priority === 'High' ? 'text-rose-600' :
                                                        c.priority === 'Medium' ? 'text-amber-600' : 'text-slate-400'}`}>
                                                    {c.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/case/${c.id}`)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-xs uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Open Case
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
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-slate-400" />
                        QUICK ACTIONS
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => navigate('/case/new')}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center gap-4 group"
                        >
                            <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition-colors">
                                <Plus className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">NEW CASE ENTRY</p>
                                <p className="text-xs text-blue-100">Draft FIR or Report</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/evidence')}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-xl shadow-sm transition-all flex items-center gap-4 group"
                        >
                            <div className="bg-slate-100 p-3 rounded-lg group-hover:bg-slate-200 transition-colors">
                                <Camera className="h-6 w-6 text-slate-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">UPLOAD EVIDENCE</p>
                                <p className="text-xs text-slate-400">Media Analysis</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/chat')}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-xl shadow-sm transition-all flex items-center gap-4 group"
                        >
                            <div className="bg-slate-100 p-3 rounded-lg group-hover:bg-slate-200 transition-colors">
                                <MessageSquare className="h-6 w-6 text-slate-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">LEGAL CONSULT</p>
                                <p className="text-xs text-slate-400">RAG Chatbot</p>
                            </div>
                        </button>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-6 text-white mt-8">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Daily Briefing</p>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <span className="text-xs font-mono text-slate-500 mt-1">10:00</span>
                                <span className="text-sm text-slate-300">New circular issued regarding BNS Section 69 updates.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-xs font-mono text-slate-500 mt-1">09:15</span>
                                <span className="text-sm text-slate-300">System maintenance scheduled for 02:00 AM.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
