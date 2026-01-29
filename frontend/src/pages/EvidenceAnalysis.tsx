import { useState } from 'react';
import { caseService } from '../api/client';
import { UploadCloud, Image as ImageIcon, Film, FileText, Loader2, Play, Search, ScanLine, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

type MediaType = 'image' | 'video' | 'doc';

export default function EvidenceAnalysis() {
    const [activeTab, setActiveTab] = useState<MediaType>('image');
    const [file, setFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!file || !prompt) return;
        setLoading(true);
        setResult(null);
        try {
            const data = await caseService.analyzeMedia(file, prompt, activeTab);
            setResult(data.analysis);
        } catch (error) {
            setResult("Unable to process request. Check system connection.");
        } finally {
            setLoading(false);
        }
    };

    const tabs: { id: MediaType; label: string; icon: any }[] = [
        { id: 'image', label: 'Photo Forensics', icon: ImageIcon },
        { id: 'video', label: 'CCTV/Video', icon: Film },
        { id: 'doc', label: 'Document Scan', icon: FileText },
    ];

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] text-glow">Digital Forensics Lab</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1 flex items-center gap-2">
                        <ShieldAlert className="h-3 w-3 text-amber-500" />
                        AI-assisted evidence processor
                    </p>
                </div>
                <div className="flex bg-[var(--bg-panel)] p-1 rounded-lg theme-border border backdrop-blur-md">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setFile(null); setResult(null); }}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="space-y-6">
                    <div className="glass-panel rounded-xl overflow-hidden p-6 relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-50"><ScanLine className="h-6 w-6 text-slate-500" /></div>
                        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Source Material</h3>
                        <div className={cn(
                            "border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative group/drop",
                            file
                                ? "border-emerald-500/50 bg-emerald-500/10"
                                : "theme-border hover:border-blue-500/50 bg-[var(--bg-surface)] theme-hover"
                        )}>
                            <input
                                type="file"
                                id="file-upload"
                                accept={activeTab === 'image' ? 'image/*' : activeTab === 'video' ? 'video/*' : '.pdf'}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <div className="bg-[var(--bg-panel)] p-4 rounded-full shadow-lg theme-border border mb-3 group-hover/drop:scale-110 transition-transform">
                                <UploadCloud className={cn("h-6 w-6", file ? "text-emerald-500" : "text-slate-400")} />
                            </div>
                            <p className="font-bold text-[var(--text-main)] text-sm">
                                {file ? file.name : "Drop evidence file here"}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                                {file ? "Ready for analysis" : `Supports ${activeTab.toUpperCase()} format`}
                            </p>
                        </div>
                    </div>

                    <div className="glass-panel rounded-xl overflow-hidden p-6 relative">
                        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Investigative Query</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe specific details to identify (e.g., 'Extract vehicle number plate' or 'Summarize text')"
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-surface)] theme-border border text-[var(--text-main)] focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 focus:outline-none min-h-[120px] text-sm resize-none placeholder:text-slate-500"
                            />
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={!file || !prompt || loading}
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-3.5 rounded-lg font-bold text-sm tracking-wide disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                            INITIATE SCAN
                        </button>
                    </div>
                </div>

                {/* Result Panel */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[550px] relative">
                    {/* CRT Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>

                    <div className="bg-slate-900 px-6 py-4 border-b border-white/5 flex items-center justify-between z-20">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse box-shadow-[0_0_10px_#06b6d4]" />
                            System Output
                        </h3>
                        <span className="font-mono text-[10px] text-slate-600">TERM_ID: 884-X</span>
                    </div>

                    <div className="flex-1 p-8 font-mono text-sm text-cyan-200/90 leading-relaxed overflow-y-auto relative z-20">
                        {loading ? (
                            <div className="h-full flex flex-col items-end justify-end space-y-2">
                                <span className="text-blue-500/50 text-xs animate-pulse">Processing media stream...</span>
                                <div className="w-full h-px bg-slate-800 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-cyan-500/50 w-1/2 animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                        ) : result ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-invert max-w-none">
                                <p className="whitespace-pre-wrap">{result}</p>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                                <ScanLine className="h-12 w-12 text-slate-700" />
                                <p className="text-xs tracking-[0.2em]">[ NO DATA STREAM ]</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
