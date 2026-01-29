import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { caseService, type FactExtractionResponse, type Evidence } from '../api/client';
import { Loader2, Zap, Save, CheckCircle, Scale, AlertTriangle, Edit3, Camera, UploadCloud, File as FileIcon, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import EvidenceGapAnalysis from '../components/EvidenceGapAnalysis';
import CaseOutcomePredictor from '../components/CaseOutcomePredictor';
import CaseTimeline from '../components/CaseTimeline';

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
        incident_time: '',
        priority: 'Medium'
    });

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
                    incident_time: c.incident_time || '',
                    priority: c.priority || 'Medium'
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
        <div className="h-[78vh] grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 mb-20">
            {/* LEFT: Case Filing Form */}
            <div className="lg:col-span-5 h-full flex flex-col gap-4">
                <div className="glass-panel rounded-xl h-full flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-4 theme-border bg-[var(--bg-surface)] flex justify-between items-center border-b">
                        <h2 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2 text-[var(--text-main)]">
                            <Edit3 className="h-4 w-4 text-blue-400" />
                            Filing Details
                        </h2>
                        <div className="flex gap-2">
                            {id && id !== 'new' && (
                                <div className="relative overflow-hidden group">
                                    <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <button className="px-2 py-1 bg-[var(--bg-surface)] theme-border border text-[var(--text-muted)] rounded text-[10px] font-bold flex items-center gap-1 hover:bg-[var(--bg-hover)] transition-colors">
                                        {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <UploadCloud className="h-3 w-3" />}
                                        ATTACH EVIDENCE
                                    </button>
                                </div>
                            )}
                            <div className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold">
                                INTAKE FORM
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                        {/* Metadata Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Inc. Date</label>
                                <input
                                    type="text"
                                    value={formData.incident_date}
                                    onChange={e => setFormData({ ...formData, incident_date: e.target.value })}
                                    placeholder="YYYY-MM-DD"
                                    className="w-full px-3 py-2 bg-[var(--bg-surface)] theme-border border rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 placeholder:text-slate-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Inc. Time</label>
                                <input
                                    type="text"
                                    value={formData.incident_time}
                                    onChange={e => setFormData({ ...formData, incident_time: e.target.value })}
                                    placeholder="HH:MM"
                                    className="w-full px-3 py-2 bg-[var(--bg-surface)] theme-border border rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Incident Location"
                                    className="w-full px-3 py-2 bg-[var(--bg-surface)] theme-border border rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 placeholder:text-slate-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Priority</label>
                                <select
                                    value={formData.priority || 'Medium'}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-3 py-2 bg-[var(--bg-surface)] theme-border border rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                                >
                                    <option value="Low">Low Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="High">High Priority</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Complainant</label>
                                <input
                                    type="text"
                                    value={formData.complainant}
                                    onChange={e => setFormData({ ...formData, complainant: e.target.value })}
                                    placeholder="Name"
                                    className="w-full px-3 py-2 bg-[var(--bg-surface)] theme-border border rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 placeholder:text-slate-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Accused</label>
                                <input
                                    type="text"
                                    value={formData.accused}
                                    onChange={e => setFormData({ ...formData, accused: e.target.value })}
                                    placeholder="Name (if known)"
                                    className="w-full px-3 py-2 bg-[var(--bg-surface)] theme-border border rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        {/* Narrative */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Narrative / FIR Text</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Type incident details here..."
                                className="w-full h-48 p-3 bg-[var(--bg-surface)] theme-border border rounded-lg text-sm text-[var(--text-main)] leading-relaxed focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 resize-none font-mono placeholder:text-slate-500"
                            />
                        </div>

                        {/* Evidence Locker */}
                        {evidenceList.length > 0 && (
                            <div className="space-y-2 border-t border-white/5 pt-4">
                                <label className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3" /> Chain of Custody Secured
                                </label>
                                <div className="bg-slate-900/50 rounded-lg p-2 space-y-2 border border-white/5">
                                    {evidenceList.map(ev => (
                                        <div key={ev.id} className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-xs font-medium text-slate-300 truncate">{ev.file_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono text-slate-500 bg-black/20 px-1 rounded hidden sm:inline-block">
                                                    {ev.file_hash.substring(0, 8)}...
                                                </span>
                                                <a
                                                    href={`http://localhost:8000/api/v1/cases/${id}/evidence/${ev.file_name}`}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
                                                    title="Download Evidence"
                                                >
                                                    <Download className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 theme-border bg-[var(--bg-surface)] flex justify-end border-t">
                        <button
                            onClick={handleAnalyzeAndSave}
                            disabled={analyzing || !formData.description}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />}
                            {analyzing ? 'Processing...' : 'Analyze & Auto-Fill'}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT: Intelligence Report (SAME AS BEFORE) */}
            <div className="lg:col-span-7 h-full">
                <div className="glass-panel rounded-xl h-full flex flex-col overflow-hidden border-l-4 border-l-emerald-500/50">
                    <div className="p-4 theme-border border-b flex items-center justify-between bg-[var(--bg-surface)]">
                        <h2 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2 text-[var(--text-main)]">
                            <Scale className="h-4 w-4 text-emerald-500" />
                            AI Intelligence Report
                        </h2>
                        {result && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const report = `CASE DATA EXPORT\n------------------\nID: ${id}\nTitle: ${formData.title}\nDate: ${new Date().toLocaleString()}\n\nSUMMARY\n${result.summary}\n\nFACTS\n${result.chronological_facts.join('\n')}\n\nVIOLATIONS\n${result.potential_bns_sections.join(', ')}`;
                                        const blob = new Blob([report], { type: 'text/plain' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `${id}_Report.txt`;
                                        a.click();
                                    }}
                                    className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-bold flex items-center gap-1.5 uppercase bg-[var(--bg-hover)] px-2 py-1 rounded transition-colors"
                                >
                                    <Save className="h-3 w-3" />
                                    Download
                                </button>
                                <div className="text-emerald-500 text-xs font-bold flex items-center gap-1.5 uppercase bg-emerald-500/10 px-2 py-1 rounded">
                                    <CheckCircle className="h-3 w-3" />
                                    Saved
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-0 bg-[var(--bg-app)] custom-scrollbar">
                        {!result ? (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] space-y-4">
                                <div className="w-16 h-16 rounded-full bg-[var(--bg-surface)] theme-border border flex items-center justify-center animate-pulse">
                                    <Camera className="h-6 w-6 text-slate-400" />
                                </div>
                                <p className="text-sm font-medium">Waiting for Case Data</p>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-3xl mx-auto space-y-8">
                                <div className="glass-card p-6 rounded-xl theme-border border shadow-lg">
                                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-emerald-500" /> Executive Summary
                                    </h3>
                                    <p className="text-[var(--text-main)] text-sm leading-relaxed font-medium">{result.summary}</p>
                                </div>

                                {/* Case Outcome Predictor */}
                                <CaseOutcomePredictor
                                    hasEvidence={evidenceList.length > 0}
                                    evidenceCount={evidenceList.length}
                                    hasWitness={!!formData.complainant}
                                    caseType={formData.title}
                                    hasMedicalReport={evidenceList.some(e => e.file_name.toLowerCase().includes('medical') || e.file_name.toLowerCase().includes('report'))}
                                    chronologyFactsCount={result.chronological_facts.length}
                                />

                                {/* Sections */}
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Timeline Visualization */}
                                    <CaseTimeline chronologicalFacts={result.chronological_facts} />
                                    {/* Violations */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest pl-1 border-l-2 border-rose-500 ml-1"><AlertTriangle className="h-3 w-3 inline mr-2 text-rose-500" /> Violations</h3>
                                        <div className="grid gap-2">
                                            {result.potential_bns_sections.map((law, i) => (
                                                <div key={i} className="bg-rose-500/10 p-2.5 rounded border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-bold hover:bg-rose-500/20 transition-colors cursor-default">
                                                    {law}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Evidence Gap Analysis */}
                                    <EvidenceGapAnalysis
                                        caseType={formData.title}
                                        hasDescription={!!formData.description}
                                        hasComplainant={!!formData.complainant}
                                        hasLocation={!!formData.location}
                                        hasIncidentDate={!!formData.incident_date}
                                        hasIncidentTime={!!formData.incident_time}
                                        evidenceCount={evidenceList.length}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
