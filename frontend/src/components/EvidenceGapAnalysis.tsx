import { AlertTriangle, FileText, Camera, User, MapPin, Clock, ShieldAlert, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface EvidenceGapAnalysisProps {
    caseType: string;
    hasDescription: boolean;
    hasComplainant: boolean;
    hasLocation: boolean;
    hasIncidentDate: boolean;
    hasIncidentTime: boolean;
    evidenceCount: number;
}

export default function EvidenceGapAnalysis({
    caseType,
    hasDescription,
    hasComplainant,
    hasLocation,
    hasIncidentDate,
    hasIncidentTime,
    evidenceCount
}: EvidenceGapAnalysisProps) {

    const requiredEvidence = [];

    // Base requirements for all cases
    requiredEvidence.push(
        { name: 'FIR Narrative', present: hasDescription, icon: FileText, critical: true },
        { name: 'Complainant Details', present: hasComplainant, icon: User, critical: true },
        { name: 'Incident Location', present: hasLocation, icon: MapPin, critical: true },
        { name: 'Date & Time', present: hasIncidentDate && hasIncidentTime, icon: Clock, critical: true }
    );

    // Case-specific requirements
    const caseTypeLower = caseType.toLowerCase();

    if (caseTypeLower.includes('assault') || caseTypeLower.includes('hurt')) {
        requiredEvidence.push(
            { name: 'Medical Report', present: evidenceCount > 0, icon: FileText, critical: true },
            { name: 'Injury Photographs', present: evidenceCount > 0, icon: Camera, critical: false }
        );
    }

    if (caseTypeLower.includes('theft') || caseTypeLower.includes('robbery')) {
        requiredEvidence.push(
            { name: 'List of Stolen Items', present: hasDescription, icon: FileText, critical: true },
            { name: 'Witness Statements', present: false, icon: User, critical: false }
        );
    }

    if (caseTypeLower.includes('rape') || caseTypeLower.includes('sexual')) {
        requiredEvidence.push(
            { name: 'Medical Examination Report', present: evidenceCount > 0, icon: FileText, critical: true },
            { name: 'Forensic Evidence', present: evidenceCount > 0, icon: Camera, critical: true }
        );
    }

    if (caseTypeLower.includes('murder') || caseTypeLower.includes('death')) {
        requiredEvidence.push(
            { name: 'Post-Mortem Report', present: evidenceCount > 0, icon: FileText, critical: true },
            { name: 'Crime Scene Photos', present: evidenceCount > 0, icon: Camera, critical: true },
            { name: 'Weapon/Evidence', present: evidenceCount > 0, icon: FileText, critical: false }
        );
    }

    const missingCritical = requiredEvidence.filter(e => e.critical && !e.present);
    const completionRate = Math.round((requiredEvidence.filter(e => e.present).length / requiredEvidence.length) * 100);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-slate-200 flex items-center gap-3 font-serif">
                    <ShieldAlert className="h-5 w-5 text-amber-500" />
                    Evidence Matrix
                </h3>
                <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Case Strength
                    </div>
                    <div className={`text-lg font-black px-3 py-1 rounded-lg border ${completionRate === 100 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        completionRate >= 70 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        }`}>
                        {completionRate}%
                    </div>
                </div>
            </div>

            {/* Missing Critical Evidence Alert */}
            {missingCritical.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex gap-4 items-start relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-12 bg-rose-500/10 blur-2xl rounded-full -mr-6 -mt-6"></div>
                    <div className="bg-rose-500/20 p-2 rounded-lg shrink-0 border border-rose-500/20">
                        <AlertTriangle className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-rose-400 mb-1 font-serif tracking-wide">
                            CRITICAL GAPS IDENTIFIED
                        </p>
                        <p className="text-xs text-rose-300/80 leading-relaxed font-medium">
                            {missingCritical.length} core pieces of evidence are missing. This case is legally vulnerable and may not stand in court without immediate remediation.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Evidence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requiredEvidence.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 rounded-xl border transition-all duration-300 relative group overflow-hidden ${item.present
                            ? 'bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/20 hover:border-emerald-500/40' // Present
                            : item.critical
                                ? 'bg-gradient-to-br from-rose-500/5 to-transparent border-rose-500/20 hover:border-rose-500/40' // Missing Critical
                                : 'bg-gradient-to-br from-slate-800/50 to-transparent border-white/5 hover:border-amber-500/30' // Missing Non-Critical
                            }`}
                    >
                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${item.present ? 'bg-emerald-500/10 text-emerald-500' :
                                    item.critical ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-700/50 text-slate-400'}`}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${item.present ? 'text-emerald-400' :
                                        item.critical ? 'text-rose-400' : 'text-slate-300'}`}>
                                        {item.name}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-wider font-bold opacity-60 mt-0.5">
                                        {item.critical ? 'Mandatory' : 'Supporting'}
                                    </p>
                                </div>
                            </div>

                            {item.present ? (
                                <BadgeCheck className="h-5 w-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-dashed border-slate-600 group-hover:border-current opacity-40" />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <p className="text-[10px] text-slate-500 text-center italic border-t border-white/5 pt-4">
                * Automated analysis based on BNS evidence requirements.
            </p>
        </div>
    );
}
