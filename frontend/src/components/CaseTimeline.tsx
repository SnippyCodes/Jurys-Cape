import { motion } from 'framer-motion';
import { Clock, MapPin, User } from 'lucide-react';

interface CaseTimelineProps {
    chronologicalFacts: string[];
}

export default function CaseTimeline({ chronologicalFacts }: CaseTimelineProps) {
    if (!chronologicalFacts || chronologicalFacts.length === 0) {
        return null;
    }

    const extractTime = (fact: string): string | null => {
        // Try to extract time patterns
        const timeMatch = fact.match(/(\d{1,2}:\d{2}\s*(AM|PM|am|pm)?|\d{1,2}\s*(AM|PM|am|pm))/);
        return timeMatch ? timeMatch[0] : null;
    };

    const extractLocation = (fact: string): boolean => {
        const locationKeywords = ['at', 'in', 'near', 'location', 'place', 'area'];
        return locationKeywords.some(kw => fact.toLowerCase().includes(kw));
    };

    const extractPerson = (fact: string): boolean => {
        const personKeywords = ['accused', 'complainant', 'witness', 'victim', 'person'];
        return personKeywords.some(kw => fact.toLowerCase().includes(kw));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                <Clock className="h-3 w-3 text-blue-500" />
                Case Timeline
            </h3>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

                <div className="space-y-6">
                    {chronologicalFacts.map((fact, idx) => {
                        const time = extractTime(fact);
                        const hasLocation = extractLocation(fact);
                        const hasPerson = extractPerson(fact);

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative pl-12"
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-2.5 top-1.5">
                                    <div className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-[var(--bg-app)] shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                                </div>

                                {/* Event Card */}
                                <div className="glass-card p-3 rounded-lg border theme-border hover:border-blue-500/30 transition-all group">
                                    {/* Header */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-bold">
                                            EVENT {idx + 1}
                                        </div>
                                        {time && (
                                            <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px] font-bold">
                                                <Clock className="h-3 w-3" />
                                                {time}
                                            </div>
                                        )}
                                    </div>

                                    {/* Fact Text */}
                                    <p className="text-xs text-[var(--text-main)] leading-relaxed mb-2">
                                        {fact}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex gap-2 flex-wrap">
                                        {hasLocation && (
                                            <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                                                <MapPin className="h-3 w-3" />
                                                Location
                                            </div>
                                        )}
                                        {hasPerson && (
                                            <div className="flex items-center gap-1 text-[10px] text-amber-400">
                                                <User className="h-3 w-3" />
                                                Person
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
