import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface FactExtractionResponse {
    case_id: string;
    chronological_facts: string[];
    potential_bns_sections: string[];
    summary: string;
    metadata?: {
        incident_date?: string;
        incident_time?: string;
        location?: string;
        complainant?: string;
        accused?: string;
    }
}

export interface Case {
    id: string;
    title: string;
    description: string;
    case_type: string;
    status: string;
    priority: string;
    officer_id: string;
    created_at?: string;
    // Structured Data
    incident_date?: string;
    incident_time?: string;
    location?: string;
    complainant?: string;
    accused?: string;
    // AI Data
    summary?: string;
    chronology?: string;
    bns_sections?: string;
}

export interface Evidence {
    id: number;
    case_id: string;
    file_name: string;
    file_type: string;
    file_hash: string;
    uploaded_at: string;
}

export const caseService = {
    // LLM & RAG Services
    analyze: async (text: string, caseId: string = 'temp') => {
        const { data } = await api.post<FactExtractionResponse>('/analyze', {
            case_id: caseId,
            case_text: text,
            doc_type: 'FIR'
        });
        return data;
    },

    mapLaw: async (ipcSection: string) => {
        const { data } = await api.get(`/map-law/${ipcSection}`);
        return data;
    },

    chat: async (message: string) => {
        const formData = new FormData();
        formData.append('message', message);
        const { data } = await api.post('/gemini/chat', formData);
        return data;
    },

    analyzeMedia: async (file: File, prompt: string, type: 'image' | 'video' | 'doc') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('prompt', prompt);
        const endpoint = `/gemini/analyze/${type}`;
        const { data } = await api.post(endpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    // Case Management (CRUD)
    getCases: async () => {
        const { data } = await api.get<Case[]>('/cases/');
        return data;
    },

    getCase: async (id: string) => {
        const { data } = await api.get<Case>(`/cases/${id}`);
        return data;
    },

    createCase: async (caseData: Case) => {
        const { data } = await api.post<Case>('/cases/', caseData);
        return data;
    },

    saveIntelligence: async (id: string, summary: string, facts: string[], laws: string[], metadata: any = {}) => {
        const { data } = await api.patch<Case>(`/cases/${id}/intelligence`, {
            summary,
            facts,
            laws,
            metadata
        });
        return data;
    },

    // Evidence Management
    uploadEvidence: async (caseId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post<Evidence>(`/cases/${caseId}/evidence`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    getEvidence: async (caseId: string) => {
        const { data } = await api.get<Evidence[]>(`/cases/${caseId}/evidence`);
        return data;
    }
};
