import { AlertTriangle, CheckCircle, FileText, Camera, User, MapPin, Clock } from 'lucide-react';

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
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-main)] flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Evidence Checklist
                </h3>
                <div className="flex items-center gap-2">
                    <div className="text-xs font-bold text-[var(--text-muted)]">
                        Completion:
                    </div>
                    <div className={`text-sm font-bold px-2 py-0.5 rounded ${completionRate === 100 ? 'bg-emerald-500/20 text-emerald-500' :
                        completionRate >= 70 ? 'bg-blue-500/20 text-blue-400' :
                            'bg-amber-500/20 text-amber-500'
                        }`}>
                        {completionRate}%
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ${completionRate === 100 ? 'bg-emerald-500' :
                        completionRate >= 70 ? 'bg-blue-500' :
                            'bg-amber-500'
                        }`}
                    style={{ width: `${completionRate}%` }}
                />
            </div>

            {/* Missing Critical Evidence Alert */}
            {missingCritical.length > 0 && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-rose-400 mb-1">
                                {missingCritical.length} Critical Evidence Missing
                            </p>
                            <p className="text-[11px] text-rose-300/80">
                                Case may be weak without these documents
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Evidence Checklist */}
            <div className="space-y-2">
                {requiredEvidence.map((item, idx) => (
                    <div
                        key={idx}
                        className={`flex items-center justify-between p-2.5 rounded-lg transition-colors ${item.present
                            ? 'bg-emerald-500/5 border border-emerald-500/20'
                            : item.critical
                                ? 'bg-rose-500/5 border border-rose-500/20'
                                : 'bg-amber-500/5 border border-amber-500/20'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <item.icon className={`h-4 w-4 ${item.present ? 'text-emerald-500' :
                                item.critical ? 'text-rose-400' :
                                    'text-amber-500'
                                }`} />
                            <span className={`text-xs font-medium ${item.present ? 'text-emerald-400' :
                                item.critical ? 'text-rose-400' :
                                    'text-amber-400'
                                }`}>
                                {item.name}
                                {item.critical && <span className="ml-1.5 text-[10px] text-rose-500">*</span>}
                            </span>
                        </div>
                        {item.present ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : (
                            <div className="bg-[var(--bg-surface)] px-2 py-0.5 rounded text-[10px] font-bold text-[var(--text-muted)]">
                                PENDING
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <p className="text-[10px] text-[var(--text-muted)] italic">
                * Critical evidence required for strong case
            </p>
        </div>
    );
}
