import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface EvidenceItem {
    id: string;
    type: 'image' | 'video' | 'audio' | 'file';
    title: string;
    date: string;
    status: 'Analyzed' | 'Processing' | 'Pending' | 'Failed';
    uri?: string;
    analysis?: string;
}

export interface Case {
    id: string;
    title: string;
    type: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low' | 'Review';
    date: string;
    status: string;
    description: string;
    summary?: string;
    aiAnalysis?: any;
    evidence: EvidenceItem[]; // New field
}

interface CaseContextType {
    cases: Case[];
    addCase: (newCase: Case) => void;
    getCaseById: (id: string) => Case | undefined;
    addEvidenceToCase: (caseId: string, evidence: EvidenceItem) => void; // New method
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: ReactNode }) {
    const [cases, setCases] = useState<Case[]>([
        {
            id: '402', title: 'State v. Sharma', type: 'Criminal Theft', priority: 'Critical', date: 'Today, 10:00 AM', status: 'Active', description: 'Sample case description.',
            evidence: []
        },
        {
            id: '399', title: 'Land Dispute: Patil Estimate', type: 'Civil Litigation', priority: 'Medium', date: 'Yesterday', status: 'Pending', description: 'Sample case description.',
            evidence: []
        },
    ]);

    const addCase = (newCase: Case) => {
        setCases(prev => [{ ...newCase, evidence: [] }, ...prev]);
    };

    const getCaseById = (id: string) => {
        return cases.find(c => c.id === id);
    };

    const addEvidenceToCase = (caseId: string, evidence: EvidenceItem) => {
        setCases(prev => prev.map(c => {
            if (c.id === caseId) {
                return { ...c, evidence: [evidence, ...c.evidence] };
            }
            return c;
        }));
    };

    return (
        <CaseContext.Provider value={{ cases, addCase, getCaseById, addEvidenceToCase }}>
            {children}
        </CaseContext.Provider>
    );
}

export function useCases() {
    const context = useContext(CaseContext);
    if (context === undefined) {
        throw new Error('useCases must be used within a CaseProvider');
    }
    return context;
}
