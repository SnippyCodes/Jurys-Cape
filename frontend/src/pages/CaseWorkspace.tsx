import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { caseService, type FactExtractionResponse, type Evidence } from '../api/client';
import { Loader2, Zap, Save, FileText, CheckCircle, Scale, Clock, AlertTriangle, User, MapPin, Calendar, Edit3, Camera, UploadCloud, File as FileIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CaseWorkspace() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        title: `Incident Report ${new Date().toLocaleDateString()}`,
        description: '',
        complainant: '',
        accused: '',
        location: '',
        incident_date: '',
        incident_time: ''
    });

    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<FactExtractionResponse | null>(null);
    const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (id && id !== 'new') {
            caseService.getCase(id).then(c => {
                setFormData({
                    title: c.title,
                    description: c.description,
                    complainant: c.complainant || '',
                    accused: c.accused || '',
                    location: c.location || '',
                    incident_date: c.incident_date || '',
                    incident_time: c.incident_time || ''
                });
                // Load evidence
                caseService.getEvidence(id).then(setEvidenceList);
            });
        }
    }, [id]);

    const handleAnalyzeAndSave = async () => {
        if (!formData.description.trim()) return;
        setAnalyzing(true);
        try {
            // 1. Create/Update Case
            let caseId = id;
            if (!caseId || caseId === 'new') {
                const newCase = await caseService.createCase({
                    id: `FIR-${Math.floor(Math.random() * 90000) + 10000}`,
                    ...formData,
                    case_type: 'General',
                    status: 'Draft',
                    priority: 'Medium',
                    officer_id: 'Officer-Krushna'
                });
                caseId = newCase.id;
                navigate(`/case/${caseId}`, { replace: true });
            }

            // 2. Run AI Analysis
            const data = await caseService.analyze(formData.description, caseId || 'temp');
            setResult(data);

            // 3. Auto-Fill Form from AI Metadata
            if (data.metadata) {
                setFormData(prev => ({
                    ...prev,
                    complainant: data.metadata?.complainant || prev.complainant,
                    accused: data.metadata?.accused || prev.accused,
                    location: data.metadata?.location || prev.location,
                    incident_date: data.metadata?.incident_date || prev.incident_date,
                    incident_time: data.metadata?.incident_time || prev.incident_time
                }));
            }

            // 4. Save Everything
            if (caseId) {
                await caseService.saveIntelligence(
                    caseId,
                    data.summary,
                    data.chronological_facts,
                    data.potential_bns_sections,
                    data.metadata
                );
            }

        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !id || id === 'new') return; // Must save case first

        setUploading(true);
        try {
            const newEvidence = await caseService.uploadEvidence(id, file);
            setEvidenceList(prev => [...prev, newEvidence]);
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
            {/* LEFT: Case Filing Form */}
            <div className="lg:col-span-5 h-full flex flex-col gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                            <Edit3 className="h-4 w-4 text-blue-600" />
                            Filing Details
                        </h2>
                        <div className="flex gap-2">
                            {id && id !== 'new' && (
                                <div className="relative overflow-hidden group">
                                    <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <button className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-slate-200 transition-colors">
                                        {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <UploadCloud className="h-3 w-3" />}
                                        ATTACH EVIDENCE
                                    </button>
                                </div>
                            )}
                            <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">
                                INTAKE FORM
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Metadata Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Inc. Date</label>
                                <input
                                    type="text"
                                    value={formData.incident_date}
                                    onChange={e => setFormData({ ...formData, incident_date: e.target.value })}
                                    placeholder="YYYY-MM-DD"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Inc. Time</label>
                                <input
                                    type="text"
                                    value={formData.incident_time}
                                    onChange={e => setFormData({ ...formData, incident_time: e.target.value })}
                                    placeholder="HH:MM"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Incident Location"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Complainant</label>
                                <input
                                    type="text"
                                    value={formData.complainant}
                                    onChange={e => setFormData({ ...formData, complainant: e.target.value })}
                                    placeholder="Name"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Accused</label>
                                <input
                                    type="text"
                                    value={formData.accused}
                                    onChange={e => setFormData({ ...formData, accused: e.target.value })}
                                    placeholder="Name (if known)"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Narrative */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Narrative / FIR Text</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Type incident details here..."
                                className="w-full h-48 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm leading-relaxed focus:outline-none focus:border-blue-500 resize-none font-mono"
                            />
                        </div>

                        {/* Evidence Locker */}
                        {evidenceList.length > 0 && (
                            <div className="space-y-2 border-t border-slate-100 pt-4">
                                <label className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3" /> Chain of Custody Secured
                                </label>
                                <div className="bg-slate-50 rounded-lg p-2 space-y-2">
                                    {evidenceList.map(ev => (
                                        <div key={ev.id} className="flex items-center justify-between bg-white p-2 rounded border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-xs font-medium text-slate-700 truncate">{ev.file_name}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 rounded">
                                                {ev.file_hash.substring(0, 8)}...
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <button
                            onClick={handleAnalyzeAndSave}
                            disabled={analyzing || !formData.description}
                            className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg disabled:opacity-50"
                        >
                            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />}
                            {analyzing ? 'Processing...' : 'Analyze & Auto-Fill'}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT: Intelligence Report (SAME AS BEFORE) */}
            <div className="lg:col-span-7 h-full">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                            <Scale className="h-4 w-4 text-emerald-600" />
                            AI Intelligence Report
                        </h2>
                        {result && (
                            <div className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 uppercase">
                                <Save className="h-3 w-3" />
                                Saved
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-0 bg-slate-50/30">
                        {!result ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    <Camera className="h-6 w-6 text-slate-300" />
                                </div>
                                <p className="text-sm font-medium text-slate-600">Waiting for Case Data</p>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-3xl mx-auto space-y-8">
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3" /> Executive Summary
                                    </h3>
                                    <p className="text-slate-800 text-sm leading-relaxed font-medium">{result.summary}</p>
                                </div>

                                {/* Sections */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1"><Clock className="h-3 w-3 inline mr-1" /> Chronology</h3>
                                        <div className="border-l-2 border-slate-200 ml-2 space-y-4 pb-2">
                                            {result.chronological_facts.map((fact, i) => (
                                                <div key={i} className="pl-4 relative"><div className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-slate-300" />
                                                    <p className="text-xs text-slate-600">{fact}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1"><AlertTriangle className="h-3 w-3 inline mr-1" /> Violations</h3>
                                        <div className="grid gap-2">
                                            {result.potential_bns_sections.map((law, i) => (
                                                <div key={i} className="bg-rose-50 p-2 rounded border border-rose-100 text-rose-800 text-xs font-bold">{law}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
