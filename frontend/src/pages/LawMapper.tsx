import { useState, type FormEvent } from 'react';
import { caseService } from '../api/client';
import { ArrowRight, Scale, BookOpen, Search } from 'lucide-react';
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
                <div className="inline-flex items-center gap-2 border border-slate-200 rounded-full px-4 py-1.5 bg-white shadow-sm mb-6">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Official Transition Utility</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                    IPC <span className="text-slate-300">to</span> BNS
                </h1>
                <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">
                    Instantly map Indian Penal Code sections to the new Bharatiya Nyaya Sanhita 2023.
                </p>
            </div>

            <div className="max-w-xl mx-auto mb-16 relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full -z-10" />
                <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            placeholder="Enter IPC Section (e.g. 302)"
                            className="w-full h-full pl-12 pr-4 bg-transparent outline-none text-lg font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
                        />
                    </div>
                    <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors">
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
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
                >
                    {/* Old Card */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col items-center justify-center text-center opacity-70 grayscale hover:grayscale-0 transition-all">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Legacy Code</span>
                        <div className="text-4xl font-black text-slate-400 mb-2">IPC {result.ipc_section}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase rounded-full bg-slate-200/50 px-3 py-1">Repealed</div>
                    </div>

                    {/* New Card */}
                    <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-24 bg-blue-500/20 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-blue-500/30 transition-colors" />
                        <div className="relative z-10 text-center">
                            <div className="bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-xs uppercase tracking-widest inline-block px-3 py-1 rounded-full mb-6">
                                Active Law
                            </div>
                            <div className="text-5xl font-black mb-2 tracking-tighter">BNS {result.bns_equivalent}</div>
                            <h2 className="text-xl font-bold text-blue-200 mb-6">{result.title}</h2>

                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-left">
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Key Changes</p>
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
