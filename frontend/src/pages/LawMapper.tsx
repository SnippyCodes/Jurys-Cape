import { useState, type FormEvent } from 'react';
import { caseService } from '../api/client';
import { ArrowRight, Scale, BookOpen, Search, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LawMapper() {
    const [section, setSection] = useState('');
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState('');

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (!section) return;
        setError('');
        setResult(null);

        try {
            const data = await caseService.mapLaw(section);
            setResult(data);
        } catch (err) {
            setError('Section not found in mapping database.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12">

            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 border border-blue-500/30 rounded-full px-4 py-1.5 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)] mb-6">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Official Transition Utility</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tight mb-4 text-glow">
                    IPC <span className="text-slate-600 mx-2">to</span> BNS
                </h1>
                <p className="text-lg text-slate-400 font-medium max-w-lg mx-auto">
                    Instantly map Indian Penal Code sections to the new Bharatiya Nyaya Sanhita 2023.
                </p>
            </div>

            <div className="max-w-xl mx-auto mb-16 relative z-10">
                <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full -z-10" />
                <form onSubmit={handleSearch} className="glass-panel p-2 rounded-2xl shadow-2xl border border-white/10 flex relative overflow-hidden">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <input
                            type="text"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            placeholder="Enter IPC Section (e.g. 302)"
                            className="w-full h-full pl-12 pr-4 bg-transparent outline-none text-lg font-bold text-white placeholder:text-slate-600 placeholder:font-medium"
                        />
                    </div>
                    <button type="submit" className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
                        Map
                    </button>
                </form>
                {error && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-rose-500 font-medium text-center mt-4">
                        {error}
                    </motion.p>
                )}
            </div>

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center"
                >
                    {/* Old Card */}
                    <div className="md:col-span-5 bg-slate-900/50 rounded-2xl p-8 border border-white/5 flex flex-col items-center justify-center text-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Legacy Code</span>
                        <div className="text-5xl font-black text-slate-600 mb-2">IPC {result.ipc_section}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase rounded-full bg-slate-800 px-3 py-1 border border-white/5">Repealed</div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex md:col-span-1 justify-center">
                        <ArrowLeftRight className="text-slate-600 h-8 w-8" />
                    </div>

                    {/* New Card */}
                    <div className="md:col-span-5 bg-gradient-to-br from-blue-900/40 to-slate-900/40 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden group border border-blue-500/30">
                        <div className="absolute top-0 right-0 p-24 bg-blue-500/20 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-blue-500/30 transition-colors" />
                        <div className="relative z-10 text-center">
                            <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold text-[10px] uppercase tracking-widest inline-block px-3 py-1 rounded-full mb-6 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                Active Law
                            </div>
                            <div className="text-6xl font-black mb-2 tracking-tighter text-white drop-shadow-lg">BNS {result.bns_equivalent}</div>
                            <h2 className="text-lg font-bold text-blue-200 mb-6">{result.title}</h2>

                            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5 text-left">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Key Changes</p>
                                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                    {result.key_changes}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
