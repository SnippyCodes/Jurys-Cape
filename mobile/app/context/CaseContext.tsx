import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Case {
    id: string;
    title: string;
    type: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low' | 'Review';
    date: string;
    status: string;
    description: string;
    summary?: string;
    aiAnalysis?: any; // To store the full AI report
}

interface CaseContextType {
    cases: Case[];
    addCase: (newCase: Case) => void;
    getCaseById: (id: string) => Case | undefined;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: ReactNode }) {
    const [cases, setCases] = useState<Case[]>([
        { id: '402', title: 'State v. Sharma', type: 'Criminal Theft', priority: 'Critical', date: 'Today, 10:00 AM', status: 'Active', description: 'Sample case description.' },
        { id: '399', title: 'Land Dispute: Patil Estimate', type: 'Civil Litigation', priority: 'Medium', date: 'Yesterday', status: 'Pending', description: 'Sample case description.' },
        { id: '388', title: 'Traffic Violation #2991', type: 'Traffic', priority: 'Low', date: 'Jan 29', status: 'Review', description: 'Sample case description.' },
    ]);

    const addCase = (newCase: Case) => {
        setCases(prev => [newCase, ...prev]);
    };

    const getCaseById = (id: string) => {
        return cases.find(c => c.id === id);
    };

    return (
        <CaseContext.Provider value={{ cases, addCase, getCaseById }}>
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
