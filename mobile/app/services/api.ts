import { Alert } from 'react-native';

// REPLACE WITH YOUR COMPUTER'S LOCAL IP ADDRESS
// If using Android Emulator: 'http://10.0.2.2:8000/api/v1'
// If using Physical Device: 'http://192.168.7.10:8000/api/v1' (Detected Corrected)
export const API_BASE_URL = 'http://192.168.7.10:8000/api/v1';

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
    },

    async analyzeMedia(fileUri: string, fileType: 'image' | 'video' | 'doc', prompt: string = 'Describe this evidence in legal context') {
        try {
            console.log(`Uploading ${fileType} from:`, fileUri);

            const formData = new FormData();

            // Infer filename and mime type
            const filename = fileUri.split('/').pop() || `upload.${fileType === 'doc' ? 'pdf' : 'jpg'}`;
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `${fileType}/${match[1]}` : `${fileType}/jpeg`;

            formData.append('file', {
                uri: fileUri,
                name: filename,
                type: type === 'doc/pdf' ? 'application/pdf' : type // Fix for PDFs
            } as any);

            formData.append('prompt', prompt);

            const endpoint = `${API_BASE_URL}/gemini/analyze/${fileType}`;
            console.log('Sending to:', endpoint);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Media Analyze API Error: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Media Analyze API Error:', error);
            throw error;
        }
    }
};
