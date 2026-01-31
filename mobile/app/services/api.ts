import { Alert } from 'react-native';

// REPLACE WITH YOUR COMPUTER'S LOCAL IP ADDRESS
// If using Android Emulator: 'http://10.0.2.2:8000/api/v1'
// If using Physical Device: 'http://192.168.7.1:8000/api/v1' (Detected)
export const API_BASE_URL = 'http://192.168.7.1:8000/api/v1';

export const api = {
    async chatWithAI(message: string) {
        try {
            console.log('Sending message to:', `${API_BASE_URL}/gemini/chat`);
            const response = await fetch(`${API_BASE_URL}/gemini/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Chat API Error:', error);
            throw error;
        }
    },

    async analyzeCase(caseText: string) {
        try {
            console.log('Analyzing case at:', `${API_BASE_URL}/analyze`);
            const response = await fetch(`${API_BASE_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    case_id: `CASE-${Date.now().toString().slice(-4)}`, // Generate temp ID
                    case_text: caseText
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Analyze API Error: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Analyze API Error:', error);
            throw error;
        }
    }
};
