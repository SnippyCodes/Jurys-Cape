import { useState } from 'react';
import { caseService } from '../api/client';
import { UploadCloud, Image as ImageIcon, Film, FileText, Loader2, Play, Search } from 'lucide-react';
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
                    <h1 className="text-2xl font-bold text-slate-900">Digital Forensics Lab</h1>
                    <p className="text-sm text-slate-500">AI-assisted evidence processor</p>
                </div>
                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setFile(null); setResult(null); }}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                activeTab === tab.id
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-900"
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
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Source Material</h3>
                        <div className={cn(
                            "border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative group",
                            file ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 hover:border-blue-400 bg-slate-50/50"
                        )}>
                            <input
                                type="file"
                                id="file-upload"
                                accept={activeTab === 'image' ? 'image/*' : activeTab === 'video' ? 'video/*' : '.pdf'}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <UploadCloud className={cn("h-6 w-6", file ? "text-emerald-500" : "text-slate-400")} />
                            </div>
                            <p className="font-semibold text-slate-700 text-sm">
                                {file ? file.name : "Drop evidence file here"}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {file ? "Ready for analysis" : `Supports ${activeTab.toUpperCase()} format`}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Investigative Query</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder=" Describe what you are looking for (e.g., 'Identify vehicle number plate' or 'Summarize text')"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px] text-sm resize-none"
                            />
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={!file || !prompt || loading}
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm tracking-wide disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                            INITIATE SCAN
                        </button>
                    </div>
                </div>

                {/* Result Panel */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
                    <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            System Output
                        </h3>
                        <span className="font-mono text-[10px] text-slate-600">TERM_ID: 884-X</span>
                    </div>

                    <div className="flex-1 p-8 font-mono text-sm text-slate-300 leading-relaxed overflow-y-auto">
                        {loading ? (
                            <div className="h-full flex flex-col items-end justify-end space-y-2">
                                <span className="text-blue-500/50">Processing media stream...</span>
                                <div className="w-full h-px bg-slate-800 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-500/50 w-1/2 animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                        ) : result ? (
                            <div className="prose prose-invert max-w-none">
                                <p className="whitespace-pre-wrap">{result}</p>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-700">
                                <p>[ NO DATA STREAM ]</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
