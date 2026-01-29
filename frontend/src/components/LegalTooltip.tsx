import { useState } from 'react';
import { Info } from 'lucide-react';
import glossary from '../data/legal-glossary.json';

interface GlossaryEntry {
    term: string;
    full?: string;
    definition: string;
    hindi?: string;
    section?: string;
}

interface LegalTooltipProps {
    term: string;
    children?: React.ReactNode;
}

export default function LegalTooltip({ term, children }: LegalTooltipProps) {
    const [show, setShow] = useState(false);
    const entry = (glossary as Record<string, GlossaryEntry>)[term];

    if (!entry) {
        return <>{children || term}</>;
    }

    return (
        <span className="relative inline-block group">
            <span
                className="cursor-help border-b-2 border-dotted border-blue-400/50 text-blue-400 hover:border-blue-400 transition-colors"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children || term}
            </span>

            {show && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="glass-panel p-4 rounded-lg shadow-2xl border-2 theme-border">
                        <div className="flex items-start gap-2 mb-2">
                            <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-[var(--text-main)] mb-1">
                                    {entry.full ?? entry.term}
                                </h4>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                    {entry.definition}
                                </p>
                            </div>
                        </div>

                        {entry.hindi && (
                            <div className="mt-2 pt-2 border-t theme-border">
                                <p className="text-xs text-amber-500">
                                    <span className="font-semibold">हिंदी:</span> {entry.hindi}
                                </p>
                            </div>
                        )}

                        {entry.section && (
                            <div className="mt-2 pt-2 border-t theme-border">
                                <p className="text-[10px] font-mono text-emerald-500">
                                    {entry.section}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="w-3 h-3 bg-[var(--bg-surface)] border-r-2 border-b-2 theme-border rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5" />
                </div>
            )}
        </span>
    );
}
