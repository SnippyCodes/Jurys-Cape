import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CaseOutcomePredictorProps {
    hasEvidence: boolean;
    evidenceCount: number;
    hasWitness: boolean;
    caseType: string;
    hasMedicalReport: boolean;
    chronologyFactsCount: number;
}

export default function CaseOutcomePredictor({
    hasEvidence,
    evidenceCount,
    hasWitness,
    caseType,
    hasMedicalReport,
    chronologyFactsCount
}: CaseOutcomePredictorProps) {

    // Calculate conviction probability based on evidence strength
    let score = 50; // Base score

    // Evidence scoring
    if (hasEvidence) score += 15;
    score += Math.min(evidenceCount * 5, 15); // Max +15 for evidence

    // Witness scoring
    if (hasWitness) score += 10;

    // Medical/forensic evidence
    if (hasMedicalReport) score += 15;

    // Chronology completeness
    if (chronologyFactsCount >= 5) score += 10;
    else if (chronologyFactsCount >= 3) score += 5;

    // Case type adjustments
    const caseTypeLower = caseType.toLowerCase();
    if (caseTypeLower.includes('murder') || caseTypeLower.includes('rape')) {
        score -= 5; // Harder burden of proof
    }

    // Cap at 95% (never show 100%)
    score = Math.min(Math.max(score, 15), 95);

    const confidenceLevel = score >= 80 ? 'Strong' : score >= 60 ? 'Moderate' : 'Weak';
    const strengthFactors = [];
    const weaknessFactors = [];

    // Analyze strengths
    if (evidenceCount >= 3) strengthFactors.push('Multiple evidence items collected');
    if (hasMedicalReport) strengthFactors.push('Medical/forensic documentation present');
    if (chronologyFactsCount >= 5) strengthFactors.push('Detailed chronological sequence');
    if (hasWitness) strengthFactors.push('Witness statements available');

    // Analyze weaknesses
    if (evidenceCount === 0) weaknessFactors.push('No physical evidence uploaded');
    if (!hasMedicalReport && (caseTypeLower.includes('assault') || caseTypeLower.includes('hurt'))) {
        weaknessFactors.push('Medical report required but missing');
    }
    if (chronologyFactsCount < 3) weaknessFactors.push('Insufficient timeline details');

    return (
        <div className="glass-panel p-4 rounded-xl border theme-border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-main)] flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    Case Strength Analysis
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                        score >= 60 ? 'bg-blue-500/20 text-blue-400' :
                            'bg-amber-500/20 text-amber-400'
                    }`}>
                    {confidenceLevel}
                </div>
            </div>

            {/* Conviction Probability */}
            <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                    <div className={`text-4xl font-bold ${score >= 80 ? 'text-emerald-400' :
                            score >= 60 ? 'text-blue-400' :
                                'text-amber-400'
                        }`}>
                        {score}%
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                        Estimated Success Rate
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-700 ${score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                                score >= 60 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                                    'bg-gradient-to-r from-amber-500 to-orange-400'
                            }`}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>

            {/* Strength Factors */}
            {strengthFactors.length > 0 && (
                <div className="mb-3">
                    <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Strengths
                    </p>
                    <ul className="space-y-1">
                        {strengthFactors.map((factor, idx) => (
                            <li key={idx} className="text-xs text-emerald-300/80 flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                <span>{factor}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Weakness Factors */}
            {weaknessFactors.length > 0 && (
                <div>
                    <p className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Areas to Strengthen
                    </p>
                    <ul className="space-y-1">
                        {weaknessFactors.map((factor, idx) => (
                            <li key={idx} className="text-xs text-amber-300/80 flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span>{factor}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-4 pt-3 border-t theme-border">
                <p className="text-[10px] text-[var(--text-muted)] italic">
                    * Prediction based on evidence completeness. Actual outcome may vary based on legal arguments and court proceedings.
                </p>
            </div>
        </div>
    );
}
